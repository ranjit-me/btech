from rest_framework import serializers
from .models import Internship


class InternshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship
        fields = [
            "id", "company_name", "role_title", "description", "location",
            "is_remote", "stipend", "application_url", "deadline", "required_skills", "created_at"
        ]
