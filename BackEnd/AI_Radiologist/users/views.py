from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from urllib.parse import urljoin

import requests
from django.urls import reverse
from rest_framework.views import APIView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings
from sqlparse.tokens import Generic


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_OAUTH_CALLBACK_URL
    client_class = OAuth2Client


class GoogleLoginCallback(APIView):
    def get(self, request, *args, **kwargs):
        """
        If you are building a fullstack application (eq. with React app next to Django)
        you can place this endpoint in your frontend application to receive
        the JWT tokens there - and store them in the state
        """

        code = request.GET.get("code")

        if code is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Remember to replace the localhost:8000 with the actual domain name before deployment
        token_endpoint_url = urljoin(settings.DOMAIN_NAME, reverse("google_login"))
        response = requests.post(url=token_endpoint_url, data={"code": code})

        return Response(response.json(), status=status.HTTP_200_OK)


from django.conf import settings
# from django.shortcuts import render
from django.views import View


class LoginPage(View):
    def get(self, request, *args, **kwargs):
        return render(
            request,
            "account/login.html",
            {
                "google_callback_uri": settings.GOOGLE_OAUTH_CALLBACK_URL,
                "google_client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            },
        )

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

# send pdf that already in disk

# from django.http import FileResponse
# from rest_framework.views import APIView
# import os
#
# class GenerateReportPDF(APIView):
#     def get(self, request):
#         pdf_path = "Report1.pdf"
#
#
#         if not os.path.exists(pdf_path):
#             return Response({"error": "File not found"}, status=404)
#
#
#         pdf_file = open(pdf_path, "rb")
#
#
#         response = FileResponse(pdf_file, content_type="application/pdf")
#         response["Content-Disposition"] = 'attachment; filename="Report1.pdf"'
#
#         return response






# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework.reverse import reverse
#

# @api_view(['GET'])
# def api_root(request, format=None):
#     return Response({
#         'users': reverse('user-list', request=request, format=format),
#         'snippets': reverse('snippet-list', request=request, format=format)
#     })