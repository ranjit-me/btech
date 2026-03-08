from rest_framework import serializers
from .models import Assignment, Submission, EvaluationResult


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = [
            "id", "lecture", "problem_statement", "requirements",
            "bonus_challenge", "evaluation_criteria", "difficulty",
            "estimated_time_minutes", "sample_input", "sample_output", "created_at"
        ]
        read_only_fields = [
            "id", "lecture", "problem_statement", "requirements",
            "bonus_challenge", "evaluation_criteria", "difficulty",
            "estimated_time_minutes", "sample_input", "sample_output", "created_at"
        ]


class SubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["solution_code", "language"]

    def validate_language(self, value):
        allowed = ["Python", "JavaScript", "Java", "C++", "Go"]
        if value not in allowed:
            raise serializers.ValidationError(f"Language must be one of: {', '.join(allowed)}")
        return value

    def validate_solution_code(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Submission too short to be valid code.")
        return value


class EvaluationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationResult
        fields = [
            "id", "score", "verdict", "feedback", "criteria_scores",
            "strengths", "improvements", "bonus_attempted", "evaluated_at"
        ]
