from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reports.views import (
    UserReportsCountView,
    GenerateReportPDF,
    UserReportsViewSet,
    UserReportCreateView,
    RadiologyOptionsView,
)

# router = DefaultRouter()
# router.register(r'list', UserReportsViewSet, basename='user_reports')
# path('', include(router.urls)),

# Map viewset actions to HTTP methods for list and detail views
user_reports_list = UserReportsViewSet.as_view({
    'get': 'list',
    # If you support creation, you can add:
    # 'post': 'create'
})
user_reports_detail = UserReportsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',            # For full updates
    'patch': 'partial_update',  # For partial updates
    'delete': 'destroy'
})

urlpatterns = [
    path('', user_reports_list, name='user_reports-list'),
    path('<int:pk>/', user_reports_detail, name='user_reports-detail'),
    path('<int:pk>/pdf/', GenerateReportPDF.as_view(), name='generate_report'),
    path('count/', UserReportsCountView.as_view(), name='report_count'),
    path('create/', UserReportCreateView.as_view(), name='create_report'),
    path('options/', RadiologyOptionsView.as_view(),   name='report-options'),

]

