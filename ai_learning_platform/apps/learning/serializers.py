from rest_framework import serializers
from .models import LearningPath, Module, Lecture, LectureCompletion


class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ["id", "title", "description", "youtube_url", "order", "duration_minutes"]


class ModuleSerializer(serializers.ModelSerializer):
    lectures = LectureSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "description", "order", "lectures"]


class LearningPathSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = LearningPath
        fields = ["id", "title", "description", "target_company", "status", "modules", "created_at"]
        read_only_fields = ["id", "created_at", "status"]


class LearningPathListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — no nested data."""
    class Meta:
        model = LearningPath
        fields = ["id", "title", "description", "target_company", "status", "created_at"]


class LectureCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LectureCompletion
        fields = ["id", "lecture", "completed_at"]
        read_only_fields = ["id", "completed_at"]
