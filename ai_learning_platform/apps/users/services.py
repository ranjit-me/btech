from .models import UserProfile, CustomUser
from rest_framework.exceptions import ValidationError, NotFound


class UserProfileService:

    @staticmethod
    def get_profile(user: CustomUser) -> UserProfile:
        try:
            return UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise NotFound("User profile not found. Please create a profile first.")

    @staticmethod
    def create_profile(user: CustomUser, validated_data: dict) -> UserProfile:
        if UserProfile.objects.filter(user=user).exists():
            raise ValidationError("Profile already exists. Use PATCH to update.")
        return UserProfile.objects.create(user=user, **validated_data)

    @staticmethod
    def update_profile(user: CustomUser, validated_data: dict) -> UserProfile:
        profile = UserProfileService.get_profile(user)
        for field, value in validated_data.items():
            setattr(profile, field, value)
        profile.save()
        return profile
