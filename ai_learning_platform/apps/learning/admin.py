from django.contrib import admin
from .models import LearningPath, Module, Lecture, LectureCompletion


@admin.register(LearningPath)
class LearningPathAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "status", "target_company", "created_at"]
    list_filter = ["status"]
    search_fields = ["title", "user__username"]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ["title", "learning_path", "order"]


@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ["title", "module", "order", "duration_minutes"]


@admin.register(LectureCompletion)
class LectureCompletionAdmin(admin.ModelAdmin):
    list_display = ["user", "lecture", "completed_at"]
