from django.db import models
import os

# # Create your models here.
# class ModelType(models.Model):
#     id = models.AutoField(primary_key=True)
#     type_name = models.CharField(max_length=50, unique=True)  # اسم النوع (مثل "X-ray", "CT")
#     is_active = models.BooleanField(default=True)
#
#     def __str__(self):
#         return self.type_name


class RadiologyModality(models.Model):
    name = models.CharField(max_length=100)

class BodyAnatomicalRegion(models.Model):
    name = models.CharField(max_length=100)

class RadiologyDetails(models.Model):
    body_ana = models.ForeignKey(BodyAnatomicalRegion, on_delete=models.CASCADE)
    radio_mod = models.ForeignKey(RadiologyModality, on_delete=models.CASCADE)


def model_file_upload_path(instance, filename):
    """
    Files for one AIModel all go into: MEDIA_ROOT/models/{model_id}_{model_name}/
    """
    folder = f"models/{instance.model.id}_{instance.model.name}"
    return os.path.join(folder, filename)

class AIModel(models.Model):
    name          = models.CharField(max_length=100)
    description   = models.TextField(blank=True, null=True)
    radio_detail  = models.ForeignKey(RadiologyDetails, on_delete=models.CASCADE, related_name="ai_models")
    active_status = models.BooleanField(default=True)
    upload_date   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class AIModelFile(models.Model):
    model    = models.ForeignKey(AIModel, related_name='files', on_delete=models.CASCADE)
    file     = models.FileField(upload_to=model_file_upload_path)
    uploaded = models.DateTimeField(auto_now_add=True)


# def get_model_upload_to(instance, filename):
#     extension = filename.split('.')[-1]  # استخراج الامتداد من اسم الملف
#     # model_type_name = instance.model.model_type.type_name
#     return fr'models/{instance.name}_{instance.id}_.{extension}'
#
# class AIModel(models.Model):
#     name = models.CharField(max_length=100)
#     description = models.TextField(blank=True, null=True)
#     model_path = models.FileField(max_length=255, upload_to=r'uploaded_files/models/') #validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'png'])]
#     active_status = models.BooleanField(default=True)
#     upload_date = models.DateTimeField(auto_now_add=True)
#     #version = models.CharField(max_length=50) # كنسله
#     radio_detail = models.ForeignKey(RadiologyDetails, on_delete=models.CASCADE, related_name="ai_models")
#
#     def __str__(self):
#         return f"{self.name} (v{self.version})"
#





# class Model(models.Model):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=100)
#     model_type = models.ForeignKey(
#         ModelType,
#         on_delete=models.CASCADE,
#         related_name="models",
#     )
#     version = models.CharField(max_length=50)
#     description = models.TextField(blank=True, null=True)
#     upload_date = models.DateTimeField(auto_now_add=True)
#     active_status = models.BooleanField(default=True)
#
#     def __str__(self):
#         return f"{self.name} (v{self.version})"