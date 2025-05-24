from rest_framework import serializers
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer, PasswordResetSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from users.models import User, UserType
from datetime import date
from django.core.validators import FileExtensionValidator


class CustomPasswordResetSerializer(PasswordResetSerializer):

    def get_email_options(self):
        return {
            'email_template_name': 'password_reset_email.html',
            'subject_template_name': 'password_reset_subject.txt',
        }

class CustomLoginSerializer(LoginSerializer):
    username = None


class CustomRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=30, required=True)
    gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=True)
    date_of_birth = serializers.DateField(required=True)
    # phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)
    user_type, _ = UserType.objects.get_or_create(name='user')

    def validate(self, attrs):
        # Ensure passwords match
        if attrs['password'] != attrs['password_confirm']:
            raise ValidationError({"password_confirm": "Passwords do not match."})

        # Validate date_of_birth
        if attrs['date_of_birth'] > date.today():
            raise ValidationError({"date_of_birth": "Date of birth cannot be in the future."})

        return attrs

    def save(self, *args, **kwargs):
        # Remove password confirmation before creating the user
        validated_data = self.validated_data
        validated_data.pop('password_confirm')

        # Create the user with custom fields
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            gender=validated_data['gender'],
            date_of_birth=validated_data['date_of_birth'],
            # phone_number=validated_data.get('phone_number', ''),
            user_type=self.user_type,
        )

        return user

class CustomUserDetailsSerializer(UserDetailsSerializer):
    # kill the inherited `username` field:
    username = None

    # your extra and overridden fields
    email         = serializers.EmailField(read_only=False)
    first_name    = serializers.CharField(required=False)
    last_name     = serializers.CharField(required=False)
    gender        = serializers.ChoiceField(choices=[('M','Male'),('F','Female')])
    profile_image = serializers.ImageField(
                       validators=[FileExtensionValidator(['jpg','jpeg','png'])],
                       required=False,
                       allow_null=True
                    )
    age           = serializers.SerializerMethodField()
    date_of_birth = serializers.DateField(read_only=True)
    join_date     = serializers.DateTimeField(read_only=True)
    user_type     = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_age(self, obj):
        return obj.age

    class Meta:
        model  = User
        # now explicitly list exactly the fields you want — no `username`
        fields = [
            'pk',
            'email',
            'first_name',
            'last_name',
            'gender',
            'age',
            'date_of_birth',
            'join_date',
            'profile_image',
            'user_type',
        ]
        read_only_fields = ['email', 'date_of_birth', 'join_date', 'age', 'user_type']

# class CustomUserDetailsSerializer(UserDetailsSerializer):
#     # Override or add fields
#     gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')])
#     age = serializers.SerializerMethodField(read_only=True)
#     # Mark these fields as read-only (they will be available in the output but not editable)
#     date_of_birth = serializers.DateField(read_only=True)
#     # phone_number = serializers.CharField(max_length=15, read_only=True)
#     user_type = serializers.PrimaryKeyRelatedField(read_only=True)
#     profile_image = serializers.ImageField(validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],allow_empty_file=True)
#     join_date = serializers.DateTimeField(read_only=True)
#
#
#     def get_age(self, obj):
#         return obj.age
#
#     class Meta(UserDetailsSerializer.Meta):
#         # Only include first_name, last_name, and gender as editable fields.
#         # The rest are read-only.
#         fields = UserDetailsSerializer.Meta.fields + (
#             'first_name',
#             'last_name',
#             'gender',
#             'age',
#             'date_of_birth',
#             'join_date',
#             'profile_image',
#             'user_type',
#             # 'phone_number',
#         )


class UserTypeIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserType
        fields = ['id']


class EmailExistsSerializer(serializers.Serializer):
    email = serializers.EmailField()
    exists = serializers.BooleanField()

# Admin Serializers

class AdminUserDetailsSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    user_type = serializers.SlugRelatedField(
        slug_field='name',
        queryset=UserType.objects.all()
    )

    class Meta:
        model = User
        fields = [
            'id','email', 'first_name', 'last_name', 'gender', 'age',
            'date_of_birth', 'join_date', 'user_type', 'is_active'
        ] #'phone_number'
        read_only_fields = ['join_date', 'age']


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'email', 'first_name', 'last_name', 'gender',
            'date_of_birth', 'phone_number', 'password1', 'password2', 'user_type'
        )

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

