import uuid
from django.db import models
from apps.users.models import CustomUser
from apps.learning.models import Module


class Badge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon_url = models.URLField(max_length=500, blank=True)
    module = models.OneToOneField(Module, on_delete=models.SET_NULL, null=True, blank=True, related_name="badge")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "badges_badge"

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="badges")
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name="holders")
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "badges_userbadge"
        unique_together = [("user", "badge")]

    def __str__(self):
        return f"{self.user.username} earned {self.badge.name}"
