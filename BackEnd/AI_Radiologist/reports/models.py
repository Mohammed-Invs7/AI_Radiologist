from django.db import models
from users.models import User
from ai_models.models import AIModel
from django.utils import timezone

def get_report_image_upload_to(instance, filename):
    extension = filename.split('.')[-1]
    radio_detail = instance.model.radio_detail
    return fr'images_reports/{radio_detail.radio_mod.name}_{radio_detail.body_ana.name}_{instance.id}_{timezone.now().strftime("%Y%m%d_%H%M%S")}.{extension}'

class Report(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=20, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    model = models.ForeignKey(AIModel, on_delete=models.CASCADE, related_name='reports')
    image_path = models.ImageField(upload_to=get_report_image_upload_to)
    report_details = models.TextField()
    report_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report {self.id} by {self.user.first_name} {self.user.last_name}"

