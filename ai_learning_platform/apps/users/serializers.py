from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["email", "username", "password", "password_confirm"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        return CustomUser.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "cgpa", "interests", "favorite_company", "skill_level", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_cgpa(self, value):
        if not (0.0 <= float(value) <= 10.0):
            raise serializers.ValidationError("CGPA must be between 0.0 and 10.0.")
        return value

    def validate_interests(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError("Interests must be a non-empty list.")
        return value


class CurrentUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "username", "date_joined", "profile"]
