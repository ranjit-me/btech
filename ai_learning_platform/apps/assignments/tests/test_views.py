import pytest
from rest_framework.test import APIClient
from apps.users.models import CustomUser, UserProfile


@pytest.mark.django_db
class TestAssignmentViews:
    def setup_method(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email="assign@test.com",
            username="assigntest",
            password="testpass123"
        )
        UserProfile.objects.create(
            user=self.user,
            cgpa=7.5,
            interests=["Python"],
            skill_level="BEGINNER"
        )
        self.client.force_authenticate(user=self.user)

    def test_list_assignments_empty(self):
        url = "/api/v1/assignments/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data["data"]["count"] == 0
