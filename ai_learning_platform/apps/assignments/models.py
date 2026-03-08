import uuid
from django.db import models
from apps.users.models import CustomUser
from apps.learning.models import Lecture


class Difficulty(models.TextChoices):
    EASY = "EASY", "Easy"
    MEDIUM = "MEDIUM", "Medium"
    HARD = "HARD", "Hard"


class Assignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name="assignments")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="assignments")
    problem_statement = models.TextField()
    requirements = models.JSONField(default=list)
    bonus_challenge = models.TextField(blank=True)
    evaluation_criteria = models.JSONField(default=dict)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices)
    estimated_time_minutes = models.PositiveIntegerField(null=True, blank=True)
    sample_input = models.TextField(blank=True)
    sample_output = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "assignments_assignment"
        unique_together = [("user", "lecture")]
        ordering = ["-created_at"]

    def __str__(self):
        return f"Assignment for {self.lecture.title} ({self.user.username})"


class Submission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="submissions")
    solution_code = models.TextField()
    language = models.CharField(max_length=30)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "assignments_submission"

    def __str__(self):
        return f"Submission by {self.user.username}"


class Verdict(models.TextChoices):
    PASS = "PASS", "Pass"
    FAIL = "FAIL", "Fail"


class EvaluationResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.OneToOneField(Submission, on_delete=models.CASCADE, related_name="result")
    score = models.PositiveIntegerField()
    feedback = models.TextField()
    verdict = models.CharField(max_length=10, choices=Verdict.choices)
    criteria_scores = models.JSONField(default=dict)
    strengths = models.JSONField(default=list)
    improvements = models.JSONField(default=list)
    bonus_attempted = models.BooleanField(default=False)
    raw_ai_response = models.JSONField(null=True, blank=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "assignments_evaluationresult"

    def __str__(self):
        return f"{self.verdict} ({self.score}/100)"
