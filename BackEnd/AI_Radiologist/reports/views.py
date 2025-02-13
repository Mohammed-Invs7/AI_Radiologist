from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from rich.diagnose import report

from reports.models import Report
from reports.serializers import UserReportListSerializer, UserReportDetailSerializer
from weasyprint import HTML, CSS
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
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # get user reports count
        report_count = Report.objects.filter(user=request.user).count()
        return Response({"report_count": report_count})

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

class GenerateReportPDF(APIView):
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