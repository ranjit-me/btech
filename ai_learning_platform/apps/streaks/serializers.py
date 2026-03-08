from rest_framework import serializers
from .models import DSAProblem, StreakRecord


class DSAProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DSAProblem
        fields = ["id", "title", "problem_statement", "difficulty", "tags", "date"]


class StreakRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StreakRecord
        fields = ["id", "current_streak", "longest_streak", "last_solved_date", "updated_at"]
