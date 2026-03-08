import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.users.models import CustomUser


@pytest.mark.django_db
class TestRegisterView:
    def setup_method(self):
        self.client = APIClient()

    def test_register_success(self):
        url = "/api/v1/auth/register/"
        data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!"
        }
        response = self.client.post(url, data, format="json")
        assert response.status_code == 201
        assert response.data["status"] == "success"
        assert "tokens" in response.data["data"]

    def test_register_password_mismatch(self):
        url = "/api/v1/auth/register/"
        data = {
            "email": "fail@example.com",
            "username": "failuser",
            "password": "StrongPass123!",
            "password_confirm": "WrongPass123!"
        }
        response = self.client.post(url, data, format="json")
        assert response.status_code == 400


@pytest.mark.django_db
class TestProfileView:
    def setup_method(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email="profile@test.com",
            username="profiletest",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

    def test_create_profile(self):
        url = "/api/v1/profile/"
        data = {
            "cgpa": "8.5",
            "interests": ["Python", "Data Science"],
            "skill_level": "INTERMEDIATE"
        }
        response = self.client.post(url, data, format="json")
        assert response.status_code == 201
        assert response.data["status"] == "success"
