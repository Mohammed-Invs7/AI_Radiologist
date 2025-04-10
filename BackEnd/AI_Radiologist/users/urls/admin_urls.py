from django.urls import path
from users.views import AdminUserListView, AdminUserDetailView, AdminUserCreateView

urlpatterns = [
    path('', AdminUserListView.as_view(), name='admin_user_list'),
    path('create/', AdminUserCreateView.as_view(), name='admin_user_create'),
    path('<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
]