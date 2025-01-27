from django.db import models
from users.models import User
from ai_models.models import Model
from django.utils import timezone

def get_upload_to(instance, filename):
    extension = filename.split('.')[-1]  # استخراج الامتداد من اسم الملف
    model_type_name = instance.model.model_type.type_name
    return fr'media/images_reports/{model_type_name}_{instance.id}_{timezone.now().strftime("%Y%m%d_%H%M%S")}.{extension}'

class Report(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    model = models.ForeignKey(Model, on_delete=models.CASCADE, related_name='reports')
    image_path = models.ImageField(upload_to=get_upload_to)
    report_details = models.TextField()
    report_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report {self.id} by {self.user.first_name} {self.user.last_name}"