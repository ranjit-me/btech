import uuid
from django.db import models


class Internship(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=150)
    role_title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    is_remote = models.BooleanField(default=False)
    stipend = models.PositiveIntegerField(null=True, blank=True)
    application_url = models.URLField(max_length=500, blank=True)
    deadline = models.DateField(null=True, blank=True)
    required_skills = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "internships_internship"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.role_title} at {self.company_name}"
