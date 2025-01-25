"""
URL configuration for AI_Radiologist project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from allauth.account.views import ConfirmEmailView
router = DefaultRouter()
urlpatterns = [
    #path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    re_path(
        r"^api/v1/auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$",
        ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api-auth/', include('rest_framework.urls')),


]

''' 
/api/v1/auth/login/ dj_rest_auth.views.LoginView rest_login
/api/v1/auth/logout/ dj_rest_auth.views.LogoutView rest_logout
/api/v1/auth/password/change/ dj_rest_auth.views.PasswordChangeView rest_password_change
/api/v1/auth/password/reset/ dj_rest_auth.views.PasswordResetView rest_password_reset
/api/v1/auth/password/reset/confirm/ dj_rest_auth.views.PasswordResetConfirmView rest_password_reset_confirm
/api/v1/auth/token/refresh/ dj_rest_auth.jwt_auth.RefreshViewWithCookieSupport token_refresh
/api/v1/auth/token/verify/ rest_framework_simplejwt.views.TokenVerifyView token_verify
/api/v1/auth/user/ dj_rest_auth.views.UserDetailsView rest_user_details

available endpoints:
/api/v1/auth/registration/      dj_rest_auth.registration.views.RegisterView    rest_register
/api/v1/auth/registration/account-confirm-email/<key>/  django.views.generic.base.TemplateView  account_confirm_email
/api/v1/auth/registration/account-email-verification-sent/      django.views.generic.base.TemplateView  account_email_verification_sent
/api/v1/auth/registration/resend-email/ dj_rest_auth.registration.views.ResendEmailVerificationView     rest_resend_email
/api/v1/auth/registration/verify-email/ dj_rest_auth.registration.views.VerifyEmailView rest_verify_email

'''