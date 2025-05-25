from rest_framework import serializers

from ai_models.models import RadiologyModality, BodyAnatomicalRegion, RadiologyDetails
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



class UserReportCreateSerializer(serializers.ModelSerializer):
    radio_modality = serializers.PrimaryKeyRelatedField(
        queryset=RadiologyModality.objects.all(),
        write_only=True,
        source='radio_detail.radio_mod'
    )
    body_ana = serializers.PrimaryKeyRelatedField(
        queryset=BodyAnatomicalRegion.objects.all(),
        write_only=True,
        source='radio_detail.body_ana'
    )
    image_path     = serializers.ImageField()
    report_details = serializers.CharField(read_only=True)
    model_description = serializers.ReadOnlyField(source='model.description')

    class Meta:
        model  = Report
        fields = ['id', 'radio_modality','body_ana','image_path','report_details', 'model_description',]

    def validate(self, data):
        """
        Instead of creating a new RadiologyDetails, only accept an existing one.
        If there's no matching active model for the chosen combo, raise an error.
        """
        b = data['radio_detail']['body_ana']
        r = data['radio_detail']['radio_mod']

        try:
            detail = RadiologyDetails.objects.get(body_ana=b, radio_mod=r)
        except RadiologyDetails.DoesNotExist:
            raise serializers.ValidationError({
                "non_field_errors":
                  "No RadiologyDetails exists for that modality & region."
            })

        data['radio_detail'] = detail
        return data



# Admin

class AdminReportListSerializer(serializers.ModelSerializer):
    radiology_modality = serializers.CharField(source='model.radio_detail.radio_mod.name', read_only=True)
    body_anatomical_region = serializers.CharField(source='model.radio_detail.body_ana.name', read_only=True)
    user_full_name = serializers.SerializerMethodField(read_only=True)
    model = serializers.CharField(source='model.name', read_only=True)
    
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
    model = serializers.CharField(source='model.name', read_only=True)
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
