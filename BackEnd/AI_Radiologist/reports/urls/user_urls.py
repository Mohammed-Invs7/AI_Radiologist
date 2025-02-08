from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reports.views import UserReportsCountView, GenerateReportPDF, UserReportsViewSet

router = DefaultRouter()
router.register(r'', UserReportsViewSet, basename='user_reports')


urlpatterns = [
    path('', include(router.urls)),
    path('count/', UserReportsCountView.as_view(), name='report_count'),
    path('pdf/', GenerateReportPDF.as_view(), name='generate_report'),
]

