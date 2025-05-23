# from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import mixins, viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny

from reports.models import Report
from reports.serializers import (
    UserReportListSerializer,
    UserReportDetailSerializer,
    AdminReportListSerializer,
    AdminReportDetailSerializer,
    UserReportCreateSerializer,
)
from ai_models.models import AIModel, RadiologyDetails
from users.permissions import IsAdminUser


from django.template.loader import get_template
from django.http import FileResponse
import io

import os, importlib.util
from rest_framework.exceptions import ValidationError
from ai_models.models import AIModelFile



class UserReportsViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         mixins.DestroyModelMixin,
                         mixins.UpdateModelMixin,  # Allow updating title
                         viewsets.GenericViewSet):
    """
    ViewSet to list, retrieve, update (title only), and delete reports for the current user.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter reports for the logged-in user
        return Report.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        # Use different serializers for list and retrieve views
        if self.action in ['retrieve', 'update', 'partial_update']:
            return UserReportDetailSerializer
        return UserReportListSerializer


class UserReportsCountView(APIView):
    """
        API view for retrieving the count of reports for the authenticated user.

        This view filters the Report records based on the currently logged-in user and
        returns the total number of reports as a JSON response.

        HTTP Method:
          GET - Retrieves the count of the user's reports.

        Permissions:
          Only authenticated users can access this view.

        Response:
          200 OK: Returns a JSON object containing the key 'report_count' with the number of reports.
        """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # get user reports count
        report_count = Report.objects.filter(user=request.user).count()
        return Response({"report_count": report_count})


# class UserReportCreateView(CreateAPIView):
#     """
#     View to create a report with a single image.
#     The 'model' field is fixed to the AIModel with id=1,
#     and 'report_details' is computed using custom logic.
#     """
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserReportCreateSerializer
#
#     def perform_create(self, serializer):
#         # ضبط حقل model بقيمة ثابتة (مثلاً id=1)
#         ai_model_instance = AIModel.objects.get(pk=1)
#
#
#         report_details = "The cardiac silhouette and mediastinum size are within normal limits. There is no pulmonary edema. There is no focal consolidation. There are no XXXX of a pleural effusion. There is no evidence of pneumothorax."
#
#         serializer.save(user=self.request.user, model=ai_model_instance, report_details=report_details)



class UserReportCreateView(CreateAPIView):
    """
Description:
    Creates a new radiology Report for the authenticated user by:
      1) Accepting two IDs: `radio_modality` (RadiologyModality) and `body_ana` (BodyAnatomicalRegion).
      2) Looking up an existing RadiologyDetails record matching that modality & region.
      3) Finding the one active AIModel for that RadiologyDetails.
      4) Loading its `get_report.py` file, calling its `get_report(image_path, model_folder)` function.
      5) Saving the returned text as `report_details` on the new Report.

Request (multipart/form-data):
    - radio_modality (int, required):  ID of the chosen RadiologyModality.
    - body_ana       (int, required):  ID of the chosen BodyAnatomicalRegion.
    - image_path     (file, required): The X-ray (or other) image to analyze.

Response:
    201 Created with JSON body:
    {
      "id":             <int>,     # Report ID
      "image_path":     <str>,     # URL to the stored image
      "report_details": <str>,     # Text returned by get_report()
    }

Errors (400 Bad Request):
    - "No RadiologyDetails exists for that modality & region."
    - "No active AIModel for that modality/region."
    - "get_report.py not found for the active model."
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserReportCreateSerializer
    queryset = Report.objects.all()

    def perform_create(self, serializer):
        # 1–2 handled by serializer.source in validate()
        detail = serializer.validated_data.pop('radio_detail')

        # 3. find the active model:
        try:
            ai_model = detail.ai_models.get(active_status=True)
        except AIModel.DoesNotExist:
            raise ValidationError("No active AIModel for that modality/region.")

        # 4. find the get_report.py file record
        try:
            file_record = AIModelFile.objects.get(
                model=ai_model,
                file__endswith='get_report.py'
            )
        except AIModelFile.DoesNotExist:
            raise ValidationError("get_report.py not found for the active model.")

        # compute filesystem paths
        fs_path     = file_record.file.path
        model_folder= os.path.dirname(fs_path) + '/'

        # 5a: save the Report (this writes the uploaded image to disk)
        #    we pass an empty report_details for now
        instance = serializer.save(
            user=self.request.user,
            model=ai_model,
            report_details=""
        )

        # 5b: now that instance.image_path is on disk, get its path:
        img_fs_path = instance.image_path.path

        # 5c: dynamically import and run get_report():
        spec = importlib.util.spec_from_file_location("report_module", fs_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        report_text = module.get_report(img_fs_path, model_folder)

        # 6: update the instance with the real report text
        instance.report_details = report_text
        instance.save()

class RadiologyOptionsView(APIView):
    """
    Returns JSON of all RadiologyModality objects
    each with the list of BodyAnatomicalRegion’s that have
    at least one active AIModel under that modality+region.

    Response format:
    [
      {
        "modality": { "id": 2, "name": "X-ray" },
        "regions": [
          { "id": 3, "name": "Chest" },
          { "id": 5, "name": "Abdomen" }
        ]
      },
      ...
    ]
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # get all RadiologyDetails that have an active model
        active_details = RadiologyDetails.objects.filter(
            ai_models__active_status=True
        ).select_related('radio_mod', 'body_ana').distinct()

        # group by modality
        grouping = {}
        for det in active_details:
            mod = det.radio_mod
            reg = det.body_ana
            grouping.setdefault(mod, set()).add(reg)

        data = []
        for mod, regs in grouping.items():
            data.append({
                "modality": {"id": mod.id, "name": mod.name},
                "regions": [{"id": r.id, "name": r.name} for r in regs]
            })

        return Response(data)


from io import BytesIO
from django.template.loader import get_template
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from xhtml2pdf import pisa
from .models import Report

class GenerateReportPDF(APIView):
    """
    API view for generating a PDF report for an authenticated user.
    Embeds the X-ray image, patient info, report text (preserving line breaks),
    model description, and static sections.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            report = Report.objects.get(user=request.user, id=pk)
        except Report.DoesNotExist:
            return Response({"error": "Report does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        # Prepare context
        context = {
            "full_name":            f"{report.user.first_name} {report.user.last_name}",
            "age":                  f"{report.user.age} years",
            "gender":               "Male" if report.user.gender=='M' else "Female",
            "radiology_modality":   report.model.radio_detail.radio_mod.name,
            "anatomical_region":    report.model.radio_detail.body_ana.name,
            "reported_on":          report.report_date.strftime("%d %b %Y - %I:%M %p"),
            "image_url":            request.build_absolute_uri(report.image_path.url),
            "report_details":       report.report_details,
            "model_description":    report.model.description or "",
        }

        template = get_template('pdf/pdf_template.html')
        html_content = template.render(context)

        # Render to PDF
        pdf_io = BytesIO()
        result = pisa.CreatePDF(src=html_content, dest=pdf_io)
        if result.err:
            return Response({"error": "Error generating PDF."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        pdf_io.seek(0)
        filename = (report.title or f"report_{report.id}").replace(" ", "_") + ".pdf"
        return FileResponse(pdf_io, content_type='application/pdf', headers={
            'Content-Disposition': f'attachment; filename="{filename}"'
        })

# Admin

class AdminReportsListView(ListAPIView):
    """
    View to list reports for all users.
    The list view does not include 'image_path' and 'report_details'.
    """
    serializer_class = AdminReportListSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Report.objects.all()



class AdminReportsDetailView(RetrieveAPIView):
    """
    View to retrieve specific report for all users.
    it includes 'image_path' and 'report_details'.
    """
    serializer_class = AdminReportDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Report.objects.all()



# class GenerateReportPDF2(APIView):
#     def get(self, request):
#
#         context = {
#             "full_name": "Ali Bin Shamlan",
#             "radiology_modality": "X-ray",
#             "reported_on": "07 Dec 2024 - 04:35 PM",
#             "age": "23 years",
#             "anatomical_region": "Chest",
#             "gender": "Male"
#         }
#
#         template = get_template('pdf/pdf_template.html')
#
#         html_content = template.render(context)
#         pdf_file = HTML(string=html_content).write_pdf()
#
#         pdf_stream = io.BytesIO(pdf_file)
#
#         response = FileResponse(pdf_stream, content_type='application/pdf')
#         response['Content-Disposition'] = 'attachment; filename="home_page.pdf"'
#         return response
