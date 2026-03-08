from django.contrib import admin
from .models import DSAProblem, StreakRecord


@admin.register(DSAProblem)
class DSAProblemAdmin(admin.ModelAdmin):
    list_display = ["title", "date", "difficulty"]
    list_filter = ["difficulty"]
    ordering = ["-date"]


@admin.register(StreakRecord)
class StreakRecordAdmin(admin.ModelAdmin):
    list_display = ["user", "current_streak", "longest_streak", "last_solved_date"]
