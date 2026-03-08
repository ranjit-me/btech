import uuid
from django.db import models
from apps.users.models import CustomUser


class DSAProblem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    problem_statement = models.TextField()
    difficulty = models.CharField(
        max_length=10,
        choices=[("EASY", "Easy"), ("MEDIUM", "Medium"), ("HARD", "Hard")]
    )
    tags = models.JSONField(default=list)
    date = models.DateField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "streaks_dsaproblem"
        ordering = ["-date"]

    def __str__(self):
        return f"{self.date}: {self.title}"


class StreakRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="streak")
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_solved_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "streaks_streakrecord"

    def __str__(self):
        return f"{self.user.username} — streak: {self.current_streak}"
