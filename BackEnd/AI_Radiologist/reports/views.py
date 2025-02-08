from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.

from weasyprint import HTML, CSS
from django.template.loader import get_template
from django.http import FileResponse
import io

class GenerateReportPDF(APIView):
    def get(self, request):

        context = {
            "full_name": "Ali Bin Shamlan",
            "radiology_modality": "X-ray",
            "reported_on": "07 Dec 2024 - 04:35 PM",
            "age": "23 years",
            "anatomical_region": "Chest",
            "gender": "Male"
        }

        template = get_template('pdf/pdf_template.html')

        html_content = template.render(context)
        pdf_file = HTML(string=html_content).write_pdf()

        pdf_stream = io.BytesIO(pdf_file)

        response = FileResponse(pdf_stream, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="home_page.pdf"'
        return response