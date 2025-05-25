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
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from allauth.account.views import ConfirmEmailView
from users.views import (
    GoogleLogin,
    GoogleLoginCallback,
    LoginPage,
    password_reset_confirm_redirect,
    email_confirm_redirect,
    CheckEmailView
)

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from dj_rest_auth.registration.views import (
    ResendEmailVerificationView,
    VerifyEmailView,
    RegisterView,
)
from dj_rest_auth.views import PasswordResetConfirmView

urlpatterns = [

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'), #api/schema/swagger-ui/
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Pages that not an api endpoints
    # path("login/", LoginPage.as_view(), name="login"),
    #########################################################
    #path('admin/', admin.site.urls),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("api/v1/auth/registration/", RegisterView.as_view(), name='rest_register'),
    path("api/v1/auth/registration/verify-email/", VerifyEmailView.as_view(), name="rest_verify_email"),
    path("api/v1/auth/registration/resend-email/", ResendEmailVerificationView.as_view(), name="rest_resend_email"),
    path("api/v1/auth/registration/account-confirm-email/<str:key>/", email_confirm_redirect, name="account_confirm_email"),
    path("api/v1/auth/registration/account-confirm-email/", VerifyEmailView.as_view(), name="account_email_verification_sent"),


    path(
        "api/v1/auth/password/reset/confirm/<str:uidb64>/<str:token>/",
        password_reset_confirm_redirect,
        name="password_reset_confirm",
    ),
    # path('api/v1/auth/password/reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    # re_path(
    #     r"^api/v1/auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$",
    #     ConfirmEmailView.as_view(),
    #     name="account_confirm_email",
    # ),
    # path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    #path('api-auth/', include('rest_framework.urls')),
    re_path(r"^api/v1/auth/accounts/", include("allauth.urls")),
    # path("api/v1/auth/google/", GoogleLogin.as_view(), name="google_login"),
    # path(
    #     "api/v1/auth/google/callback/",
    #     GoogleLoginCallback.as_view(),
    #     name="google_login_callback",
    # ),
    path('api/v1/auth/check-email/<str:email>/', CheckEmailView.as_view(), name='check-email'),    # apps

    path('api/v1/user/reports/', include('reports.urls.user_urls')),
    path('api/v1/admin/users/reports/', include('reports.urls.admin_urls')),

    path('api/v1/user/', include('users.urls.user_urls')),
    path('api/v1/admin/users/', include('users.urls.admin_urls')),

    path('api/v1/admin/ai_models/', include('ai_models.urls')),
    path('api/v1/admin/dashboard/', include('dashboard.urls'))

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

