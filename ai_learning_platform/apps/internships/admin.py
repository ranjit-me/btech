from django.contrib import admin
from .models import Internship


@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ["role_title", "company_name", "location", "is_remote", "stipend", "deadline"]
    list_filter = ["is_remote"]
    search_fields = ["company_name", "role_title"]
