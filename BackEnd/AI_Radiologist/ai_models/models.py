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


# class RadiologyModality(models.Model):
#     name = models.CharField(max_length=100)
#
# class BodyAnatomicalRegion(models.Model):
#     name = models.CharField(max_length=100)
#
# class RadiologyDetails(models.Model):
#     body_ana = models.ForeignKey(BodyAnatomicalRegion, on_delete=models.CASCADE)
#     radio_mod = models.ForeignKey(RadiologyModality, on_delete=models.CASCADE)
#
# class Model2(models.Model):
#     radio_detail = models.ForeignKey(RadiologyDetails, on_delete=models.CASCADE)
#     model_name = models.CharField(max_length=100)
#     version = models.CharField(max_length=50)
#     description = models.TextField()
#     model_path = models.CharField(max_length=255)
#     upload_date = models.DateTimeField(auto_now_add=True)
#     active_status = models.BooleanField(default=True)