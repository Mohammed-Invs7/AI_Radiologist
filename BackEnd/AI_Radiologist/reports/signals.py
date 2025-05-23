import os
from django.db.models.signals import pre_save
from django.dispatch import receiver
from reports.models import Report


@receiver(pre_save, sender=Report)
def set_default_report_title(sender, instance, **kwargs):
    if not instance.title and instance.image_path:
        base_name = os.path.basename(instance.image_path.name)
        name_without_ext = os.path.splitext(base_name)[0]

        instance.title = name_without_ext[:20]