from django.urls import path
from reports.views import AdminReportsListView, AdminReportsDetailView

urlpatterns = [
    path('', AdminReportsListView.as_view(), name='user_report_list'),
    path('<int:pk>/', AdminReportsDetailView.as_view(), name='user_report_detail'),
]