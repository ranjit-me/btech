import pytest
from apps.users.models import CustomUser, UserProfile


@pytest.mark.django_db
class TestCustomUser:
    def test_create_user(self):
        user = CustomUser.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="securepassword123"
        )
        assert user.email == "test@example.com"
        assert user.username == "testuser"
        assert user.is_active is True
        assert user.is_staff is False
        assert str(user) == "testuser <test@example.com>"

    def test_create_superuser(self):
        user = CustomUser.objects.create_superuser(
            email="admin@example.com",
            username="admin",
            password="adminpass123"
        )
        assert user.is_staff is True
        assert user.is_superuser is True

    def test_user_requires_email(self):
        with pytest.raises(ValueError):
            CustomUser.objects.create_user(
                email="",
                username="noname",
                password="pass"
            )


@pytest.mark.django_db
class TestUserProfile:
    def test_profile_str(self):
        user = CustomUser.objects.create_user(
            email="profile@example.com",
            username="profileuser",
            password="test1234"
        )
        profile = UserProfile.objects.create(
            user=user,
            cgpa=8.5,
            interests=["Python", "Machine Learning"],
            skill_level="INTERMEDIATE"
        )
        assert str(profile) == "Profile of profileuser"
