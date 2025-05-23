from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from datetime import date
from django.core.validators import FileExtensionValidator

from rest_framework.exceptions import ValidationError


def validate_date_of_birth(value):
    if value > date.today():
        raise ValidationError("Date of birth cannot be in the future.")


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("user_type", UserType.objects.get_or_create(name="admin")[0])
        return self.create_user(email, password, **extra_fields)



class UserType(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Role names "admin", "user"
    def __str__(self):
        return self.name

def get_profile_image_upload_to(instance, filename):
    extension = filename.split('.')[-1]
    return fr'users_data/user_{instance.id}/profile.{extension}'

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    # password is already in AbstractBaseUser
    first_name = models.CharField(max_length=30, null=False, blank=False)
    last_name = models.CharField(max_length=30, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    gender_choices = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    gender = models.CharField(max_length=1, choices=gender_choices, null=False, blank=False)
    date_of_birth = models.DateField(null=False, blank=False)
    profile_image = models.ImageField(
        upload_to= get_profile_image_upload_to, blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],
        default='users_data/default_data/account_default.jpg'
    )

    phone_number = models.CharField(max_length=15, null=True, blank=True)
    join_date = models.DateTimeField(auto_now_add=True)

    @property
    def age(self):
        if self.date_of_birth:
            today = date.today()
            age = today.year - self.date_of_birth.year

            if (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day):
                age -= 1
            return age
        return None

    # Link to UserType table
    user_type = models.ForeignKey(UserType, on_delete=models.SET_NULL, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    # REQUIRED_FIELDS for admin
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


    def is_superuser(self):
        """Check if the user is an admin based on their UserType."""
        return self.user_type and self.user_type.name == "admin"


