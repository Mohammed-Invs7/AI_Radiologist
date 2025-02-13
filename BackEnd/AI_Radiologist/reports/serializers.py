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


# class UserReportsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Report
#         fields = '__all__'
#         # for exclude fields
#         # exclude = ('some_field',)



# class UserReportsSerializer(serializers.ModelSerializer):
#     owner = serializers.ReadOnlyField(source='owner.')
#     class Meta:
#         queryset = Report.objects.all()
#         model = Report
#         fields = '__all__'
