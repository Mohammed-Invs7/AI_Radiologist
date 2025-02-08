from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from users.models import User, UserType
from datetime import date

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
    # Override or add fields
    gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')])
    age = serializers.SerializerMethodField(read_only=True)
    # Mark these fields as read-only (they will be available in the output but not editable)
    date_of_birth = serializers.DateField(read_only=True)
    # phone_number = serializers.CharField(max_length=15, read_only=True)
    # user_type = serializers.PrimaryKeyRelatedField(queryset=UserType.objects.all(), read_only=True)
    join_date = serializers.DateTimeField(read_only=True)

    def get_age(self, obj):
        return obj.age

    class Meta(UserDetailsSerializer.Meta):
        # Only include first_name, last_name, and gender as editable fields.
        # The rest are read-only.
        fields = UserDetailsSerializer.Meta.fields + (
            'first_name',
            'last_name',
            'gender',
            'age',
            'date_of_birth',
            'join_date',
            # 'phone_number',
            # 'user_type',
        )

# class CustomRegisterSerializer(serializers.Serializer):
#     email = serializers.EmailField(required=True)
#     password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
#     password_confirm = serializers.CharField(write_only=True, required=True)
#     first_name = serializers.CharField(max_length=30, required=True)
#     last_name = serializers.CharField(max_length=30, required=True)
#     gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=True)
#     date_of_birth = serializers.DateField(required=True)
#     # phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)
#     # user_type = serializers.PrimaryKeyRelatedField(queryset=UserType.objects.all(), required=False)
#
#     def validate(self, attrs):
#         # Ensure passwords match
#         if attrs['password'] != attrs['password_confirm']:
#             raise ValidationError({"password_confirm": "Passwords do not match."})
#
#         # Validate date_of_birth (already covered by model validator, but can add custom checks if needed)
#         if attrs['date_of_birth'] > date.today():
#             raise ValidationError({"date_of_birth": "Date of birth cannot be in the future."})
#
#         return attrs
#
#     def create(self, validated_data):
#         # Remove password confirmation before creating the user
#         validated_data.pop('password_confirm')
#         user_type, _ = UserType.objects.get_or_create(name='user')
#         # Create the user with custom fields
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             password=validated_data['password'],
#             first_name=validated_data['first_name'],
#             last_name=validated_data['last_name'],
#             gender=validated_data['gender'],
#             date_of_birth=validated_data['date_of_birth'],
#             #phone_number=validated_data.get('phone_number', ''),
#             user_type = user_type
#         )
#
#         return user


# class CustomRegisterSerializer(RegisterSerializer):
#     username = None
#     first_name = serializers.CharField(max_length=30, required=True)
#     last_name = serializers.CharField(max_length=30, required=True)
#     gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=True)
#     date_of_birth = serializers.DateField(required=True)
#     #phone_number = serializers.CharField(max_length=15, required=False)
#     #user_type = serializers.PrimaryKeyRelatedField(queryset=UserType.objects.all(), required=False)
#
#     def get_cleaned_data(self):
#         # Collect cleaned data for creating the user
#         data = super().get_cleaned_data()
#         data['first_name'] = self.validated_data.get('first_name', '')
#         data['last_name'] = self.validated_data.get('last_name', '')
#         data['gender'] = self.validated_data.get('gender', '')
#         data['date_of_birth'] = self.validated_data.get('date_of_birth')
#         #data['phone_number'] = self.validated_data.get('phone_number', '')
#         #data['user_type'] = self.validated_data.get('user_type')
#         return data
#
#     def save(self, request):
#         # Save the user with custom fields
#         user = super().save(request)
#         user.first_name = self.cleaned_data['first_name']
#         user.last_name = self.cleaned_data['last_name']
#         user.gender = self.cleaned_data['gender']
#         print('5' * 500000)
#         user.date_of_birth = date.today() # self.cleaned_data['date_of_birth']
#         #user.phone_number = self.cleaned_data.get('phone_number', '')
#         user.user_type, _ = UserType.objects.get_or_create(name='user')
#
#         user.save()
#         return user
#
#     def validate_date_of_birth(self, value):
#         # Ensure date_of_birth is not in the future
#         if value > date.today():
#             raise serializers.ValidationError("Date of birth cannot be in the future.")
#         return value
#

# class CustomRegisterSerializer(RegisterSerializer):
#     username = None
#     first_name = serializers.CharField(max_length=30, required=True)
#     last_name = serializers.CharField(max_length=30, required=True)
#     gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=True)
#     date_of_birth = serializers.DateField(required=True)
#
#     def custom_signup(self, request, user):
#         # Fetch validated data safely
#         validated_data = self.validated_data
#
#         # Assign the custom fields to the user instance
#         user.first_name = validated_data.get('first_name', '')
#         user.last_name = validated_data.get('last_name', '')
#         user.gender = validated_data.get('gender', '')
#
#         # Safely get date_of_birth and set a fallback if missing (optional)
#         user.date_of_birth = validated_data.get('date_of_birth')
#         if not user.date_of_birth:
#             raise serializers.ValidationError({"date_of_birth": "This field is required."})
#
#         # Assign default user_type
#         user.user_type, _ = UserType.objects.get_or_create(name='user')
#
#         # Save the user
#         user.save()
#
#     def validate_date_of_birth(self, value):
#         # Ensure date_of_birth is not in the future
#         if value > date.today():
#             raise serializers.ValidationError("Date of birth cannot be in the future.")
#         return value
#
# from rest_framework import serializers
# from .models import User, UserType
# from datetime import date


# class CustomRegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
#     #user_type = serializers.PrimaryKeyRelatedField(queryset=UserType.objects.all(), required=False)
#
#     class Meta:
#         model = User
#         fields = ['email', 'password', 'first_name', 'last_name', 'gender', 'date_of_birth']
#
#     def validate_date_of_birth(self, value):
#         """
#         Ensure the date_of_birth is valid (not in the future).
#         """
#         if value > date.today():
#             raise serializers.ValidationError("Date of birth cannot be in the future.")
#         return value
#
#     def create(self, validated_data):
#         """
#         Custom create method to handle password hashing and user type assignment.
#         """
#         # Pop password from validated_data
#         password = validated_data.pop('password')
#
#         # Assign default user type if not provided
#         user_type = UserType.objects.get_or_create(name='user')[0]
#         validated_data['user_type'] = user_type
#
#         # Create user instance
#         user = User(**validated_data)
#
#         # Set hashed password
#         user.set_password(password)
#
#         # Save user instance
#         user.save()
#
#         return user
#
#     def save(self, **kwargs):
#         """
#         Save the serializer data and return the created user instance.
#         """
#         return super().save(**kwargs)

# class CustomRegisterSerializer(RegisterSerializer):
#     username = None  # Exclude username field
#     first_name = serializers.CharField(max_length=30, required=True)
#     last_name = serializers.CharField(max_length=30, required=True)
#     gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=True)
#     date_of_birth = serializers.DateField(required=True)
#
#     def get_cleaned_data(self):
#         """
#         Extend the cleaned data to include custom fields.
#         """
#         # Call the parent method to get default fields (e.g., email, password)
#         cleaned_data = super(CustomRegisterSerializer, self).get_cleaned_data()
#
#         # Add the custom fields to the cleaned data
#         cleaned_data.update({
#             'first_name': self.validated_data.get('first_name', ''),
#             'last_name': self.validated_data.get('last_name', ''),
#             'gender': self.validated_data.get('gender', ''),
#             'date_of_birth': self.validated_data.get('date_of_birth'),
#         })
#
#         return cleaned_data


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = '__all__'


