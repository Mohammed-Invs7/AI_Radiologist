from django.db import models

# Create your models here.
class ModelType(models.Model):
    id = models.AutoField(primary_key=True)
    type_name = models.CharField(max_length=50, unique=True)  # اسم النوع (مثل "X-ray", "CT")
    is_active = models.BooleanField(default=True)  # هل النوع نشط حاليًا؟

    def __str__(self):
        return self.type_name


class Model(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    model_type = models.ForeignKey(
        ModelType,
        on_delete=models.CASCADE,
        related_name="models",
    )
    version = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    active_status = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} (v{self.version})"