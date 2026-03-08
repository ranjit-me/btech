from django.contrib import admin
from .models import Assignment, Submission, EvaluationResult


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ["lecture", "user", "difficulty", "created_at"]
    list_filter = ["difficulty"]
    search_fields = ["user__username", "lecture__title"]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ["user", "assignment", "language", "submitted_at"]


@admin.register(EvaluationResult)
class EvaluationResultAdmin(admin.ModelAdmin):
    list_display = ["submission", "score", "verdict", "evaluated_at"]
    list_filter = ["verdict"]
