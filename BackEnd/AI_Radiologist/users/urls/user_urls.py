from django.urls import path
from users import views
from users.views import CurrentUserTypeView
urlpatterns = [
    path('user-type/', CurrentUserTypeView.as_view(), name='current_user_type')
]

