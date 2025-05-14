from rest_framework import serializers

class UserTypeCountSerializer(serializers.Serializer):
    name  = serializers.CharField(help_text="UserType name")
    count = serializers.IntegerField(help_text="Number of users of this type")

class ReportModalityCountSerializer(serializers.Serializer):
    name  = serializers.CharField(source="model__radio_detail__radio_mod__name",
                                   help_text="Modality name")
    count = serializers.IntegerField(help_text="Number of reports for this modality")

class DashboardSummarySerializer(serializers.Serializer):
    total_users            = serializers.IntegerField(help_text="Total number of users")
    active_users           = serializers.IntegerField(help_text="Number of active users")
    inactive_users         = serializers.IntegerField(help_text="Number of inactive users")
    users_by_type          = UserTypeCountSerializer(many=True,
                                        help_text="Breakdown of users by UserType")
    total_reports          = serializers.IntegerField(help_text="Total number of reports")
    reports_today          = serializers.IntegerField(help_text="Reports created today")
    reports_by_modality    = ReportModalityCountSerializer(many=True,
                                        help_text="Report counts grouped by modality")
    total_models           = serializers.IntegerField(help_text="Total AI models")
    active_models          = serializers.IntegerField(help_text="AI models with active_status=True")

class TrendSerializer(serializers.Serializer):
    labels = serializers.ListField(
        child=serializers.DateField(),
        help_text="List of dates (ISO format)"
    )
    data = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Counts corresponding to each date"
    )

class RecentUserSerializer(serializers.Serializer):
    id         = serializers.IntegerField(help_text="User primary key")
    email      = serializers.EmailField(help_text="User email")
    first_name = serializers.CharField(help_text="User first name")
    last_name  = serializers.CharField(help_text="User last name")
    join_date  = serializers.DateTimeField(help_text="When the user joined")
    user_type  = serializers.CharField(help_text="Name of the UserType")

class RecentReportSerializer(serializers.Serializer):
    id       = serializers.IntegerField(help_text="Report primary key")
    user     = serializers.EmailField(help_text="Email of the report’s owner")
    full_name = serializers.CharField(help_text="Owner’s full name")
    modality = serializers.CharField(help_text="Radiology modality name")
    date     = serializers.DateTimeField(help_text="When the report was created")

class ModelUsageSerializer(serializers.Serializer):
    id            = serializers.IntegerField(help_text="AIModel primary key")
    name          = serializers.CharField(help_text="AIModel name")
    active_status = serializers.BooleanField(help_text="Is this model active?")
    usage_count   = serializers.IntegerField(help_text="How many reports use this model")
