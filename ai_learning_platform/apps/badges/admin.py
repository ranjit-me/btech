from django.contrib import admin
from .models import Badge, UserBadge


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ["name", "module", "created_at"]
    search_fields = ["name"]


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ["user", "badge", "awarded_at"]
