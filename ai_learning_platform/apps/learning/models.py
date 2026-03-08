import uuid
from django.db import models
from apps.users.models import CustomUser


class LearningPath(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        COMPLETED = "COMPLETED", "Completed"
        ARCHIVED = "ARCHIVED", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="learning_paths")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    target_company = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    raw_ai_response = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "learning_learningpath"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.user.username})"


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    learning_path = models.ForeignKey(LearningPath, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "learning_module"
        ordering = ["order"]

    def __str__(self):
        return f"Module {self.order}: {self.title}"


class Lecture(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lectures")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    youtube_url = models.URLField(max_length=500)
    order = models.PositiveIntegerField()
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "learning_lecture"
        ordering = ["order"]

    def __str__(self):
        return f"Lecture {self.order}: {self.title}"


class LectureCompletion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="completions")
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name="completions")
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "learning_lecturecompletion"
        unique_together = [("user", "lecture")]

    def __str__(self):
        return f"{self.user.username} completed {self.lecture.title}"
