from rest_framework import serializers
from reports.models import Report




class UserReportListSerializer(serializers.ModelSerializer):
    radiology_modality = serializers.CharField(source='model.radio_detail.radio_mod.name', read_only=True)
    body_anatomical_region = serializers.CharField(source='model.radio_detail.body_ana.name', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'title', 'radiology_modality', 'body_anatomical_region', 'report_date', 'image_path',] # 'user', 'model',

class UserReportDetailSerializer(serializers.ModelSerializer):
    radiology_modality = serializers.CharField(source='model.radio_detail.radio_mod.name', read_only=True)
    body_anatomical_region = serializers.CharField(source='model.radio_detail.body_ana.name', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'title', 'radiology_modality', 'body_anatomical_region', 'report_date', 'image_path', 'report_details',]

        read_only_fields = ['id', 'radiology_modality', 'body_anatomical_region', 'image_path',  'report_date', 'report_details',]

    def update(self, instance, validated_data):
        # Allow updating only the 'title' field
        instance.title = validated_data.get('title', instance.title)
        instance.save()
        return instance

# Admin

class AdminReportListSerializer(serializers.ModelSerializer):
    radiology_modality = serializers.CharField(source='model.radio_detail.radio_mod.name', read_only=True)
    body_anatomical_region = serializers.CharField(source='model.radio_detail.body_ana.name', read_only=True)
    user_full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Report
        fields = [
            'id',
            'title',
            'user',
            'user_full_name',
            'model',
            'radiology_modality',
            'body_anatomical_region',
            'report_date'
        ]
        read_only_fields = ['id', 'user', 'title', 'report_date', 'model', 'radiology_modality', 'body_anatomical_region']

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


from rest_framework import serializers
from .models import Report

class AdminReportDetailSerializer(serializers.ModelSerializer):
    radiology_modality = serializers.CharField(source='model.radio_detail.radio_mod.name', read_only=True)
    body_anatomical_region = serializers.CharField(source='model.radio_detail.body_ana.name', read_only=True)
    user_full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Report
        fields = [
            'id',
            'title',
            'user',
            'user_full_name',
            'model',
            'radiology_modality',
            'body_anatomical_region',
            'image_path',
            'report_details',
            'report_date'
        ]
        read_only_fields = [
            'id',
            'title',
            'user',
            'user_full_name',
            'model',
            'radiology_modality',
            'body_anatomical_region',
            'image_path',
            'report_details',
            'report_date'
        ]

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
