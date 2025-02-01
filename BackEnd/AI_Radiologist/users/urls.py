from django.urls import path
from users import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('signup/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('pdf/', views.GenerateReportPDF.as_view(), name='generate_report'),
]

