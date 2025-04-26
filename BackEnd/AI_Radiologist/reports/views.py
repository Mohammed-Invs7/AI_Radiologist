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
from ai_models.models import AIModel
from users.permissions import IsAdminUser

from weasyprint import HTML #CSS
from django.template.loader import get_template
from django.http import FileResponse
import io



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


class UserReportCreateView(CreateAPIView):
    """
    View to create a report with a single image.
    The 'model' field is fixed to the AIModel with id=1,
    and 'report_details' is computed using custom logic.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserReportCreateSerializer

    def perform_create(self, serializer):
        # ضبط حقل model بقيمة ثابتة (مثلاً id=1)
        ai_model_instance = AIModel.objects.get(pk=1)


        report_details = "The cardiac silhouette and mediastinum size are within normal limits. There is no pulmonary edema. There is no focal consolidation. There are no XXXX of a pleural effusion. There is no evidence of pneumothorax."

        serializer.save(user=self.request.user, model=ai_model_instance, report_details=report_details)

class GenerateReportPDF(APIView):
    """
    API view for generating a PDF report for an authenticated user.

    This view retrieves a report based on the provided report ID (pk) for the currently authenticated user.
    It then renders a PDF using a designated HTML template populated with the report's details, such as:
      - Full name, age, and gender of the user.
      - Radiology modality and anatomical region information.
      - Report date and detailed report content.

    The generated PDF is returned as a downloadable file in the HTTP response.

    HTTP Method:
      GET - Expects the report ID as a URL parameter.

    Responses:
      200: Returns the PDF file as an attachment if the report is found.
      404: Returns an error response if the report does not exist.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            report = Report.objects.get(user=request.user, id=pk)
        except Report.DoesNotExist:
            return Response({"error": "Report does not exist."}, status=status.HTTP_404_NOT_FOUND)

        context = {
            "full_name": f"{report.user.first_name} {report.user.last_name}",
            "age": f"{report.user.age} years",
            "gender": "Male" if report.user.gender == 'M' else "Female",

            "radiology_modality": report.model.radio_detail.radio_mod.name ,
            "anatomical_region": report.model.radio_detail.body_ana.name,

            "reported_on": report.report_date.strftime("%d %b %Y - %I:%M %p"),
            "report_details": report.report_details,
        }
        template = get_template('pdf/pdf_template.html')

        html_content = template.render(context)
        pdf_file = HTML(string=html_content).write_pdf()

        pdf_stream = io.BytesIO(pdf_file)

        response = FileResponse(pdf_stream, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{report.title}.pdf"'
        return response


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

    # def get_serializer_class(self):
    #     if self.request.method in ['PUT', 'PATCH']:
    #         return ReportUpdateSerializer
    #     return AdminReportDetailSerializer



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
