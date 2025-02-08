from django.db.models.signals import pre_save
from django.dispatch import receiver
from reports.models import Report

@receiver(pre_save, sender=Report)
def set_default_report_title(sender, instance, **kwargs):
    if not instance.title:
        modality = instance.model.radio_detail.radio_mod.name
        bodyana = instance.model.radio_detail.body_ana.name
        instance.title = f"Report {instance.id} {modality} {bodyana}"