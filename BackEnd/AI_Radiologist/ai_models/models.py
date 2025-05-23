from django.db import models
import os


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


