# dashboard/urls.py
from django.urls import path
from .views import (
    DashboardSummaryView, UserTrendView, ReportTrendView,
    RecentUsersView, RecentReportsView,
    ModelsListView,
)

urlpatterns = [
    path('summary/',       DashboardSummaryView.as_view(),  name='dash-summary'),
    path('trends/users/',  UserTrendView.as_view(),         name='dash-user-trend'),
    path('trends/reports/',ReportTrendView.as_view(),       name='dash-report-trend'),
    path('recent/users/',  RecentUsersView.as_view(),       name='dash-recent-users'),
    path('recent/reports/',RecentReportsView.as_view(),     name='dash-recent-reports'),
    path('models/',        ModelsListView.as_view(),        name='dash-models'),
]
