import pytest
from rest_framework.test import APIClient
from apps.users.models import CustomUser, UserProfile
from apps.learning.models import LearningPath


@pytest.mark.django_db
class TestLearningPathViews:
    def setup_method(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email="learning@test.com",
            username="learningtest",
            password="testpass123"
        )
        UserProfile.objects.create(
            user=self.user,
            cgpa=8.0,
            interests=["Python", "Machine Learning"],
            skill_level="INTERMEDIATE",
            favorite_company="Google"
        )
        self.client.force_authenticate(user=self.user)

    def test_list_learning_paths_empty(self):
        url = "/api/v1/learning/paths/"
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data["data"]["count"] == 0
