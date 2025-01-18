from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


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
        extra_fields.setdefault("user_type", UserType.objects.get_or_create(name="admin")[0])
        return self.create_user(email, password, **extra_fields)



class UserType(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Role names, e.g., "admin", "user"
    def __str__(self):
        return self.name

class User(AbstractBaseUser, PermissionsMixin):
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
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    join_date = models.DateTimeField(auto_now_add=True)

    # Link to UserType table
    user_type = models.ForeignKey(UserType, on_delete=models.SET_NULL, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    # REQUIRED_FIELDS for admin
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def is_super_admin(self):
        """Check if the user is an admin based on their UserType."""
        return self.user_type and self.user_type.name == "admin"


# from your_app_name.models import UserType
#
# UserType.objects.get_or_create(name="admin")
# UserType.objects.get_or_create(name="user")