from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ["email", "username", "is_active", "is_staff", "date_joined"]
    search_fields = ["email", "username"]
    ordering = ["-date_joined"]
    
    # UserAdmin needs these to render correctly
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("username",)}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password", "password_confirm"),
        }),
    )
    filter_horizontal = ("groups", "user_permissions")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "cgpa", "skill_level", "favorite_company"]
    search_fields = ["user__username", "user__email"]
