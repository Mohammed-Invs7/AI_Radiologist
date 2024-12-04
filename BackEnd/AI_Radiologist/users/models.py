from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    gender_choices = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    gender = models.CharField(max_length=1, choices=gender_choices, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    join_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username