from rest_framework import serializers
from .models import AIModel, AIModelFile, RadiologyDetails, RadiologyModality, BodyAnatomicalRegion

class RadiologyModalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = RadiologyModality
        fields = ['id','name']

class BodyAnatomicalRegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyAnatomicalRegion
        fields = ['id','name']

class RadiologyDetailsSerializer(serializers.ModelSerializer):
    radio_modality     = RadiologyModalitySerializer(source='radio_mod', read_only=True)
    anatomical_region  = BodyAnatomicalRegionSerializer(source='body_ana', read_only=True)

    radio_mod_id = serializers.PrimaryKeyRelatedField(
        source='radio_mod',
        queryset=RadiologyModality.objects.all(),
        write_only=True
    )
    body_ana_id  = serializers.PrimaryKeyRelatedField(
        source='body_ana',
        queryset=BodyAnatomicalRegion.objects.all(),
        write_only=True
    )

    class Meta:
        model  = RadiologyDetails
        fields = [
            'id',
            'radio_modality',    # nested read-only
            'anatomical_region', # nested read-only
            'radio_mod_id',      # write-only
            'body_ana_id',       # write-only
        ]

class AIModelFileRenameSerializer(serializers.Serializer):
    new_name = serializers.CharField(
        max_length=255,
        help_text="The desired new filename (with or without extension)."
    )

class AIModelFileSerializer(serializers.ModelSerializer):
    model = serializers.PrimaryKeyRelatedField(
        queryset=AIModel.objects.all(),
    )
    # Read-only name pulled off the related object
    model_name = serializers.CharField(
        source='model.name',
        read_only=True
    )

    class Meta:
        model  = AIModelFile
        fields = ['id', 'model', 'model_name', 'file', 'uploaded']

class AIModelSerializer(serializers.ModelSerializer):
    files        = AIModelFileSerializer(many=True, read_only=True)
    modalities   = RadiologyModalitySerializer(source='radio_detail.radio_mod', read_only=True)
    anatomies    = BodyAnatomicalRegionSerializer(source='radio_detail.body_ana', read_only=True)

    body_ana     = serializers.PrimaryKeyRelatedField(queryset=BodyAnatomicalRegion.objects.all(), write_only=True)
    radio_mod    = serializers.PrimaryKeyRelatedField(queryset=RadiologyModality.objects.all(), write_only=True)
    active_status= serializers.BooleanField(default=True)

    upload_files = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )

    class Meta:
        model = AIModel
        fields = [
            'id', 'name', 'description', 'active_status', 'upload_date',
            'body_ana', 'radio_mod', 'upload_files',
            'files', 'modalities', 'anatomies'
        ]

    def validate(self, data):
        """
        If the client submitted BOTH 'body_ana' AND 'radio_mod',
        look up (or create) the RadiologyDetails, pop those two keys,
        and replace them with the actual detail instance.
        Otherwise leave `data` alone.
        """
        # only run on create or when both are provided
        if 'body_ana' in data and 'radio_mod' in data:
            b = data.pop('body_ana')
            r = data.pop('radio_mod')
            detail, _ = RadiologyDetails.objects.get_or_create(
                body_ana=b,
                radio_mod=r
            )
            data['radio_detail'] = detail

        return data
    def create(self, validated):
        """
        On create:
        - Turn off any other active model for this detail
        - Save the AIModel
        - Create AIModelFile entries for each uploaded file
        """
        files = validated.pop('upload_files', [])
        detail = validated['radio_detail']

        # enforce single active per detail
        if validated.get('active_status'):
            detail.ai_models.filter(active_status=True).update(active_status=False)

        instance = super().create(validated)

        # save uploaded files
        for f in files:
            AIModelFile.objects.create(model=instance, file=f)

        return instance

    def update(self, instance, validated):
        """
        On update:
        - If toggling active_status on, turn others off
        - Save AIModel
        - Add any newly uploaded files
        """
        files = validated.pop('upload_files', [])
        # enforce single active per detail block
        if validated.get('active_status') and not instance.active_status:
            instance.radio_detail.ai_models.exclude(pk=instance.pk) \
                .update(active_status=False)

        instance = super().update(instance, validated)

        # save any new files
        for f in files:
            AIModelFile.objects.create(model=instance, file=f)

        return instance