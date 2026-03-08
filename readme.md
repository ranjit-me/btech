# AI-Based Personalized Learning & Career Guidance Platform — Backend

> **This README is written as a code generation guide for AI coding assistants (Ollama, GitHub Copilot, Cursor, etc.)**
> Every section is written as a precise instruction. Follow each section in order to generate the complete backend.

---

## SYSTEM CONTEXT FOR AI ASSISTANT

You are generating a **production-grade Django REST Framework backend** for an AI-powered personalized learning and career guidance platform.

**Rules you must follow at all times:**
- Use Python 3.11
- Use Django 4.2 LTS
- Use Django REST Framework 3.14+
- Use PostgreSQL with UUID primary keys on all models
- Use JWT authentication via `djangorestframework-simplejwt`
- Every model must have `created_at` and `updated_at` auto fields
- Every API response must use a uniform envelope: `{"status": "success"|"error", "data": {}, "message": ""}`
- All business logic goes in a `services.py` file — never in views or models
- Views must be thin — they only call serializers and services
- All AI calls go through `core/ai_client.py` — never call OpenAI or Ollama directly from a view or service
- Never use `class Meta: abstract = True` unless explicitly told to
- All serializers live in `serializers.py` of their respective app
- Write explicit `__str__` methods on every model

---

## SECTION 1 — FOLDER STRUCTURE

Generate this exact folder and file structure. Create every file listed, even if empty.

```
ai_learning_platform/
│
├── manage.py
├── requirements.txt
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── pytest.ini
│
├── config/
│   ├── __init__.py
│   ├── urls.py
│   ├── wsgi.py
│   ├── asgi.py
│   └── settings/
│       ├── __init__.py
│       ├── base.py
│       ├── development.py
│       └── production.py
│
├── core/
│   ├── __init__.py
│   ├── ai_client.py          <- AI abstraction layer
│   ├── exceptions.py         <- Custom DRF exception handler
│   ├── pagination.py         <- Standard pagination class
│   ├── permissions.py        <- Shared permission classes
│   └── renderers.py          <- Uniform JSON response renderer
│
└── apps/
    ├── users/
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── serializers.py
    │   ├── services.py
    │   ├── views.py
    │   ├── urls.py
    │   └── tests/
    │       ├── __init__.py
    │       ├── test_models.py
    │       └── test_views.py
    │
    ├── learning/
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── serializers.py
    │   ├── services.py
    │   ├── views.py
    │   ├── urls.py
    │   ├── tasks.py
    │   └── tests/
    │       ├── __init__.py
    │       └── test_views.py
    │
    ├── assignments/
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── serializers.py
    │   ├── services.py
    │   ├── views.py
    │   ├── urls.py
    │   ├── tasks.py
    │   └── tests/
    │       ├── __init__.py
    │       └── test_views.py
    │
    ├── badges/
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── models.py
    │   ├── serializers.py
    │   ├── services.py
    │   ├── views.py
    │   └── urls.py
    │
    ├── streaks/
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── models.py
    │   ├── serializers.py
    │   ├── services.py
    │   ├── views.py
    │   ├── urls.py
    │   └── tasks.py
    │
    └── internships/
        ├── __init__.py
        ├── admin.py
        ├── models.py
        ├── serializers.py
        ├── services.py
        ├── views.py
        └── urls.py
```

---

## SECTION 2 — REQUIREMENTS

Generate `requirements.txt` with exactly these packages:

```
Django==4.2.13
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-environ==0.11.2
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
celery==5.3.6
redis==5.0.1
django-celery-beat==2.5.0
openai==1.30.1
drf-spectacular==0.27.1
pytest==7.4.4
pytest-django==4.7.0
factory-boy==3.3.0
Faker==24.0.0
coverage==7.4.1
gunicorn==21.2.0
structlog==24.1.0
```

---

## SECTION 3 — SETTINGS

### `config/settings/base.py`

Generate this file with the following exact content:

```python
import os
from pathlib import Path
from datetime import timedelta
import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", default=False)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "drf_spectacular",
    "django_celery_beat",
]

LOCAL_APPS = [
    "apps.users",
    "apps.learning",
    "apps.assignments",
    "apps.badges",
    "apps.streaks",
    "apps.internships",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
AUTH_USER_MODEL = "users.CustomUser"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST", default="localhost"),
        "PORT": env("DB_PORT", default="5432"),
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "core.pagination.StandardPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "20/hour",
        "user": "200/hour",
    },
    "EXCEPTION_HANDLER": "core.exceptions.custom_exception_handler",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

CELERY_BROKER_URL = env("CELERY_BROKER_URL", default="redis://localhost:6379/1")
CELERY_RESULT_BACKEND = env("CELERY_RESULT_BACKEND", default="redis://localhost:6379/2")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"

AI_PROVIDER = env("AI_PROVIDER", default="openai")
OPENAI_API_KEY = env("OPENAI_API_KEY", default="")
OPENAI_MODEL = env("OPENAI_MODEL", default="gpt-4o")
OLLAMA_BASE_URL = env("OLLAMA_BASE_URL", default="http://localhost:11434")
OLLAMA_MODEL = env("OLLAMA_MODEL", default="llama3")

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=["http://localhost:3000"])

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
```

---

## SECTION 4 — CORE UTILITIES

### `core/renderers.py`

Generate a custom DRF renderer that wraps all responses in `{"status": "success", "data": ...}`:

```python
from rest_framework.renderers import JSONRenderer


class UniformJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response") if renderer_context else None
        status_code = response.status_code if response else 200
        is_error = status_code >= 400

        wrapped = {
            "status": "error" if is_error else "success",
            "data": data if not is_error else {},
            "message": data.get("detail", "") if is_error and isinstance(data, dict) else "",
        }
        if is_error:
            wrapped["errors"] = data

        return super().render(wrapped, accepted_media_type, renderer_context)
```

### `core/exceptions.py`

```python
from rest_framework.views import exception_handler
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            "status": "error",
            "message": "An error occurred.",
            "errors": response.data,
            "data": {},
        }
        if isinstance(response.data, dict) and "detail" in response.data:
            error_data["message"] = str(response.data["detail"])

        response.data = error_data
        logger.error(f"API Error: {exc.__class__.__name__} - {exc}")

    return response
```

### `core/pagination.py`

```python
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            "status": "success",
            "data": {
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        })
```

### `core/ai_client.py`

Generate the full AI client abstraction. This is the ONLY place AI calls are made:

```python
import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class AIClient:
    """
    Abstraction layer for AI providers.
    Supports: OpenAI API, Ollama (local).
    Always returns parsed JSON dict or raises AIResponseError.
    """

    def __init__(self):
        self.provider = settings.AI_PROVIDER  # "openai" or "ollama"

    def generate(self, system_prompt: str, user_prompt: str, retries: int = 3) -> dict:
        for attempt in range(1, retries + 1):
            try:
                if self.provider == "openai":
                    raw = self._call_openai(system_prompt, user_prompt)
                elif self.provider == "ollama":
                    raw = self._call_ollama(system_prompt, user_prompt)
                else:
                    raise ValueError(f"Unknown AI provider: {self.provider}")
                return self._parse_json(raw)
            except Exception as e:
                logger.warning(f"AI call attempt {attempt} failed: {e}")
                if attempt == retries:
                    raise AIResponseError(f"AI generation failed after {retries} attempts: {e}")

    def _call_openai(self, system_prompt: str, user_prompt: str) -> str:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content

    def _call_ollama(self, system_prompt: str, user_prompt: str) -> str:
        import requests
        payload = {
            "model": settings.OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "stream": False,
            "format": "json",
        }
        response = requests.post(
            f"{settings.OLLAMA_BASE_URL}/api/chat",
            json=payload,
            timeout=120,
        )
        response.raise_for_status()
        return response.json()["message"]["content"]

    def _parse_json(self, raw: str) -> dict:
        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            raise AIResponseError(f"AI returned invalid JSON: {e}\nRaw: {raw[:300]}")


class AIResponseError(Exception):
    pass


# Singleton — import this everywhere
ai_client = AIClient()
```

---

## SECTION 5 — USERS APP

### `apps/users/models.py`

```python
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, username, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    objects = CustomUserManager()

    class Meta:
        db_table = "users_customuser"

    def __str__(self):
        return f"{self.username} <{self.email}>"


class SkillLevel(models.TextChoices):
    BEGINNER = "BEGINNER", "Beginner"
    INTERMEDIATE = "INTERMEDIATE", "Intermediate"
    ADVANCED = "ADVANCED", "Advanced"


class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="profile")
    cgpa = models.DecimalField(max_digits=4, decimal_places=2)
    interests = models.JSONField(default=list)
    favorite_company = models.CharField(max_length=100, blank=True, null=True)
    skill_level = models.CharField(max_length=20, choices=SkillLevel.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_userprofile"

    def __str__(self):
        return f"Profile of {self.user.username}"
```

### `apps/users/serializers.py`

```python
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["email", "username", "password", "password_confirm"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        return CustomUser.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "cgpa", "interests", "favorite_company", "skill_level", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_cgpa(self, value):
        if not (0.0 <= float(value) <= 10.0):
            raise serializers.ValidationError("CGPA must be between 0.0 and 10.0.")
        return value

    def validate_interests(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError("Interests must be a non-empty list.")
        return value


class CurrentUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "username", "date_joined", "profile"]
```

### `apps/users/services.py`

```python
from .models import UserProfile, CustomUser
from rest_framework.exceptions import ValidationError, NotFound


class UserProfileService:

    @staticmethod
    def get_profile(user: CustomUser) -> UserProfile:
        try:
            return UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise NotFound("User profile not found. Please create a profile first.")

    @staticmethod
    def create_profile(user: CustomUser, validated_data: dict) -> UserProfile:
        if UserProfile.objects.filter(user=user).exists():
            raise ValidationError("Profile already exists. Use PATCH to update.")
        return UserProfile.objects.create(user=user, **validated_data)

    @staticmethod
    def update_profile(user: CustomUser, validated_data: dict) -> UserProfile:
        profile = UserProfileService.get_profile(user)
        for field, value in validated_data.items():
            setattr(profile, field, value)
        profile.save()
        return profile
```

### `apps/users/views.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserProfileSerializer, CurrentUserSerializer
from .services import UserProfileService


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "status": "success",
            "message": "Account created successfully.",
            "data": {
                "user_id": str(user.id),
                "email": user.email,
                "username": user.username,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            }
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response({"status": "success", "data": serializer.data})


class UserProfileView(APIView):

    def get(self, request):
        profile = UserProfileService.get_profile(request.user)
        return Response({"status": "success", "data": UserProfileSerializer(profile).data})

    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = UserProfileService.create_profile(request.user, serializer.validated_data)
        return Response({"status": "success", "data": UserProfileSerializer(profile).data}, status=201)

    def patch(self, request):
        serializer = UserProfileSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        profile = UserProfileService.update_profile(request.user, serializer.validated_data)
        return Response({"status": "success", "data": UserProfileSerializer(profile).data})
```

### `apps/users/urls.py`

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import RegisterView, MeView, UserProfileView

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="auth-login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("auth/logout/", TokenBlacklistView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
]
```

---

## SECTION 6 — LEARNING APP

### `apps/learning/models.py`

```python
import uuid
from django.db import models
from apps.users.models import CustomUser


class LearningPath(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        COMPLETED = "COMPLETED", "Completed"
        ARCHIVED = "ARCHIVED", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="learning_paths")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    target_company = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    raw_ai_response = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "learning_learningpath"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.user.username})"


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    learning_path = models.ForeignKey(LearningPath, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "learning_module"
        ordering = ["order"]

    def __str__(self):
        return f"Module {self.order}: {self.title}"


class Lecture(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lectures")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    youtube_url = models.URLField(max_length=500)
    order = models.PositiveIntegerField()
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "learning_lecture"
        ordering = ["order"]

    def __str__(self):
        return f"Lecture {self.order}: {self.title}"


class LectureCompletion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="completions")
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name="completions")
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "learning_lecturecompletion"
        unique_together = [("user", "lecture")]

    def __str__(self):
        return f"{self.user.username} completed {self.lecture.title}"
```

### `apps/learning/serializers.py`

```python
from rest_framework import serializers
from .models import LearningPath, Module, Lecture, LectureCompletion


class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ["id", "title", "description", "youtube_url", "order", "duration_minutes"]


class ModuleSerializer(serializers.ModelSerializer):
    lectures = LectureSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "description", "order", "lectures"]


class LearningPathSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = LearningPath
        fields = ["id", "title", "description", "target_company", "status", "modules", "created_at"]
        read_only_fields = ["id", "created_at", "status"]


class LearningPathListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — no nested data."""
    class Meta:
        model = LearningPath
        fields = ["id", "title", "description", "target_company", "status", "created_at"]


class LectureCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LectureCompletion
        fields = ["id", "lecture", "completed_at"]
        read_only_fields = ["id", "completed_at"]
```

### `apps/learning/services.py`

```python
import logging
from django.db import transaction
from core.ai_client import ai_client, AIResponseError
from apps.users.services import UserProfileService
from apps.users.models import CustomUser
from .models import LearningPath, Module, Lecture, LectureCompletion
from rest_framework.exceptions import ValidationError, NotFound

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_LEARNING_PATH = """
You are an expert computer science curriculum designer and career coach.
Generate a personalized structured learning roadmap for an engineering student.
Return ONLY valid JSON. No explanation, no markdown, no text outside the JSON.

Schema:
{
  "title": "string",
  "description": "string",
  "estimated_weeks": number,
  "modules": [
    {
      "title": "string",
      "description": "string",
      "order": number,
      "lectures": [
        {
          "title": "string",
          "description": "string",
          "youtube_url": "string",
          "duration_minutes": number,
          "order": number
        }
      ]
    }
  ]
}
Modules: 4 to 6. Lectures per module: 3 to 5. All youtube_url values must be real YouTube links.
"""


class LearningPathService:

    @staticmethod
    def generate_for_user(user: CustomUser) -> LearningPath:
        profile = UserProfileService.get_profile(user)
        user_prompt = f"""
Generate a personalized learning roadmap for:
- CGPA: {profile.cgpa}
- Interests: {', '.join(profile.interests)}
- Target Company: {profile.favorite_company or 'Any top tech company'}
- Skill Level: {profile.skill_level}

Return only the JSON object.
"""
        try:
            ai_data = ai_client.generate(SYSTEM_PROMPT_LEARNING_PATH, user_prompt)
        except AIResponseError as e:
            logger.error(f"AI learning path generation failed for user {user.id}: {e}")
            raise ValidationError("AI service failed. Please try again.")

        return LearningPathService._save_from_ai_response(user, ai_data, profile)

    @staticmethod
    @transaction.atomic
    def _save_from_ai_response(user, ai_data: dict, profile) -> LearningPath:
        path = LearningPath.objects.create(
            user=user,
            title=ai_data.get("title", "My Learning Path"),
            description=ai_data.get("description", ""),
            target_company=profile.favorite_company or "",
            raw_ai_response=ai_data,
        )
        for mod_data in ai_data.get("modules", []):
            module = Module.objects.create(
                learning_path=path,
                title=mod_data["title"],
                description=mod_data.get("description", ""),
                order=mod_data["order"],
            )
            for lec_data in mod_data.get("lectures", []):
                Lecture.objects.create(
                    module=module,
                    title=lec_data["title"],
                    description=lec_data.get("description", ""),
                    youtube_url=lec_data.get("youtube_url", ""),
                    order=lec_data["order"],
                    duration_minutes=lec_data.get("duration_minutes"),
                )
        logger.info(f"Learning path {path.id} created for user {user.id}")
        return path

    @staticmethod
    def complete_lecture(user: CustomUser, lecture_id: str) -> LectureCompletion:
        try:
            lecture = Lecture.objects.get(id=lecture_id)
        except Lecture.DoesNotExist:
            raise NotFound("Lecture not found.")
        if LectureCompletion.objects.filter(user=user, lecture=lecture).exists():
            raise ValidationError("Lecture already completed.")
        return LectureCompletion.objects.create(user=user, lecture=lecture)
```

### `apps/learning/views.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import LearningPath
from .serializers import LearningPathSerializer, LearningPathListSerializer, LectureCompletionSerializer
from .services import LearningPathService
from core.pagination import StandardPagination


class GenerateLearningPathView(APIView):
    def post(self, request):
        path = LearningPathService.generate_for_user(request.user)
        return Response({"status": "success", "data": LearningPathSerializer(path).data}, status=201)


class LearningPathListView(APIView):
    def get(self, request):
        paths = LearningPath.objects.filter(user=request.user)
        paginator = StandardPagination()
        page = paginator.paginate_queryset(paths, request)
        return paginator.get_paginated_response(LearningPathListSerializer(page, many=True).data)


class LearningPathDetailView(APIView):
    def get(self, request, pk):
        try:
            path = LearningPath.objects.prefetch_related("modules__lectures").get(id=pk, user=request.user)
        except LearningPath.DoesNotExist:
            return Response({"status": "error", "message": "Not found."}, status=404)
        return Response({"status": "success", "data": LearningPathSerializer(path).data})


class CompleteLectureView(APIView):
    def post(self, request, lecture_id):
        completion = LearningPathService.complete_lecture(request.user, lecture_id)
        from apps.assignments.tasks import generate_assignment_task
        generate_assignment_task.delay(str(request.user.id), str(lecture_id))
        return Response({
            "status": "success",
            "message": "Lecture completed. Assignment generation triggered.",
            "data": LectureCompletionSerializer(completion).data,
        }, status=201)
```

### `apps/learning/urls.py`

```python
from django.urls import path
from .views import GenerateLearningPathView, LearningPathListView, LearningPathDetailView, CompleteLectureView

urlpatterns = [
    path("learning/generate/", GenerateLearningPathView.as_view(), name="learning-generate"),
    path("learning/paths/", LearningPathListView.as_view(), name="learning-path-list"),
    path("learning/paths/<uuid:pk>/", LearningPathDetailView.as_view(), name="learning-path-detail"),
    path("learning/lectures/<uuid:lecture_id>/complete/", CompleteLectureView.as_view(), name="lecture-complete"),
]
```

---

## SECTION 7 — ASSIGNMENTS APP

### `apps/assignments/models.py`

```python
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
```

### `apps/assignments/serializers.py`

```python
from rest_framework import serializers
from .models import Assignment, Submission, EvaluationResult


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = [
            "id", "lecture", "problem_statement", "requirements",
            "bonus_challenge", "evaluation_criteria", "difficulty",
            "estimated_time_minutes", "sample_input", "sample_output", "created_at"
        ]
        read_only_fields = fields


class SubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["solution_code", "language"]

    def validate_language(self, value):
        allowed = ["Python", "JavaScript", "Java", "C++", "Go"]
        if value not in allowed:
            raise serializers.ValidationError(f"Language must be one of: {', '.join(allowed)}")
        return value

    def validate_solution_code(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Submission too short to be valid code.")
        return value


class EvaluationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationResult
        fields = [
            "id", "score", "verdict", "feedback", "criteria_scores",
            "strengths", "improvements", "bonus_attempted", "evaluated_at"
        ]
```

### `apps/assignments/services.py`

```python
import logging
from django.db import transaction
from core.ai_client import ai_client, AIResponseError
from apps.users.models import CustomUser
from apps.learning.models import Lecture
from .models import Assignment, Submission, EvaluationResult, Verdict
from rest_framework.exceptions import ValidationError, NotFound

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_ASSIGNMENT = """
You are a senior software engineering instructor. Create a unique practical coding assignment.
Return ONLY valid JSON. No text outside the JSON.

Schema:
{
  "problem_statement": "string",
  "requirements": ["string"],
  "bonus_challenge": "string",
  "evaluation_criteria": { "correctness": number, "code_quality": number, "efficiency": number, "edge_cases": number },
  "difficulty": "EASY|MEDIUM|HARD",
  "estimated_time_minutes": number,
  "sample_input": "string",
  "sample_output": "string"
}
evaluation_criteria values must sum to 100.
"""

SYSTEM_PROMPT_EVALUATION = """
You are a strict but fair code reviewer. Evaluate the submitted code against the assignment.
Return ONLY valid JSON. No text outside the JSON.

Schema:
{
  "score": number (0-100),
  "verdict": "PASS|FAIL",
  "feedback": "string",
  "criteria_scores": { "correctness": number, "code_quality": number, "efficiency": number, "edge_cases": number },
  "strengths": ["string"],
  "improvements": ["string"],
  "bonus_attempted": boolean
}
PASS if score >= 60. FAIL if score < 60.
"""


class AssignmentService:

    @staticmethod
    def generate_for_lecture(user: CustomUser, lecture_id: str) -> Assignment:
        try:
            lecture = Lecture.objects.select_related("module__learning_path").get(id=lecture_id)
        except Lecture.DoesNotExist:
            raise NotFound("Lecture not found.")

        if Assignment.objects.filter(user=user, lecture=lecture).exists():
            return Assignment.objects.get(user=user, lecture=lecture)

        profile = user.profile
        user_prompt = f"""
Create a coding assignment for:
- Lecture Title: {lecture.title}
- Module: {lecture.module.title}
- Skill Level: {profile.skill_level}

Return only the JSON object.
"""
        try:
            ai_data = ai_client.generate(SYSTEM_PROMPT_ASSIGNMENT, user_prompt)
        except AIResponseError as e:
            raise ValidationError(f"Assignment generation failed: {e}")

        return Assignment.objects.create(
            user=user,
            lecture=lecture,
            problem_statement=ai_data.get("problem_statement", ""),
            requirements=ai_data.get("requirements", []),
            bonus_challenge=ai_data.get("bonus_challenge", ""),
            evaluation_criteria=ai_data.get("evaluation_criteria", {}),
            difficulty=ai_data.get("difficulty", "MEDIUM"),
            estimated_time_minutes=ai_data.get("estimated_time_minutes"),
            sample_input=ai_data.get("sample_input", ""),
            sample_output=ai_data.get("sample_output", ""),
        )


class EvaluationService:

    @staticmethod
    def evaluate(user: CustomUser, assignment_id: str, solution_code: str, language: str) -> EvaluationResult:
        try:
            assignment = Assignment.objects.get(id=assignment_id, user=user)
        except Assignment.DoesNotExist:
            raise NotFound("Assignment not found.")

        submission = Submission.objects.create(
            assignment=assignment, user=user, solution_code=solution_code, language=language
        )

        user_prompt = f"""
--- ASSIGNMENT ---
Problem: {assignment.problem_statement}
Requirements: {assignment.requirements}
Criteria: {assignment.evaluation_criteria}
Difficulty: {assignment.difficulty}

--- SUBMISSION ---
Language: {language}
Code:
{solution_code}

Evaluate and return only the JSON object.
"""
        try:
            ai_data = ai_client.generate(SYSTEM_PROMPT_EVALUATION, user_prompt)
        except AIResponseError as e:
            raise ValidationError(f"Evaluation failed: {e}")

        result = EvaluationResult.objects.create(
            submission=submission,
            score=ai_data.get("score", 0),
            feedback=ai_data.get("feedback", ""),
            verdict=ai_data.get("verdict", Verdict.FAIL),
            criteria_scores=ai_data.get("criteria_scores", {}),
            strengths=ai_data.get("strengths", []),
            improvements=ai_data.get("improvements", []),
            bonus_attempted=ai_data.get("bonus_attempted", False),
            raw_ai_response=ai_data,
        )

        if result.verdict == Verdict.PASS:
            from apps.badges.services import BadgeService
            BadgeService.check_and_award(user, assignment.lecture.module)

        logger.info(f"Evaluation: {result.verdict} ({result.score}/100) user={user.id}")
        return result
```

### `apps/assignments/tasks.py`

```python
from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def generate_assignment_task(self, user_id: str, lecture_id: str):
    try:
        from apps.users.models import CustomUser
        from .services import AssignmentService
        user = CustomUser.objects.get(id=user_id)
        AssignmentService.generate_for_lecture(user, lecture_id)
    except Exception as exc:
        logger.error(f"Assignment task failed: {exc}")
        raise self.retry(exc=exc)
```

### `apps/assignments/views.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Assignment
from .serializers import AssignmentSerializer, SubmissionCreateSerializer, EvaluationResultSerializer
from .services import EvaluationService
from core.pagination import StandardPagination


class AssignmentListView(APIView):
    def get(self, request):
        qs = Assignment.objects.filter(user=request.user).select_related("lecture")
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        return paginator.get_paginated_response(AssignmentSerializer(page, many=True).data)


class AssignmentDetailView(APIView):
    def get(self, request, pk):
        try:
            assignment = Assignment.objects.get(id=pk, user=request.user)
        except Assignment.DoesNotExist:
            return Response({"status": "error", "message": "Not found."}, status=404)
        return Response({"status": "success", "data": AssignmentSerializer(assignment).data})


class SubmitAssignmentView(APIView):
    def post(self, request, pk):
        serializer = SubmissionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = EvaluationService.evaluate(
            user=request.user,
            assignment_id=str(pk),
            solution_code=serializer.validated_data["solution_code"],
            language=serializer.validated_data["language"],
        )
        return Response({
            "status": "success",
            "message": "Submission evaluated.",
            "data": EvaluationResultSerializer(result).data,
        }, status=201)
```

### `apps/assignments/urls.py`

```python
from django.urls import path
from .views import AssignmentListView, AssignmentDetailView, SubmitAssignmentView

urlpatterns = [
    path("assignments/", AssignmentListView.as_view(), name="assignment-list"),
    path("assignments/<uuid:pk>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("assignments/<uuid:pk>/submit/", SubmitAssignmentView.as_view(), name="assignment-submit"),
]
```

---

## SECTION 8 — BADGES APP

### `apps/badges/models.py`

```python
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
```

### `apps/badges/services.py`

```python
import logging
from apps.users.models import CustomUser
from apps.learning.models import Module, Lecture
from apps.assignments.models import EvaluationResult, Verdict
from .models import Badge, UserBadge

logger = logging.getLogger(__name__)


class BadgeService:

    @staticmethod
    def check_and_award(user: CustomUser, module: Module):
        total_lectures = Lecture.objects.filter(module=module).count()
        if total_lectures == 0:
            return

        passed_count = EvaluationResult.objects.filter(
            submission__user=user,
            submission__assignment__lecture__module=module,
            verdict=Verdict.PASS,
        ).count()

        if passed_count >= total_lectures:
            badge, _ = Badge.objects.get_or_create(
                module=module,
                defaults={
                    "name": f"{module.title} Badge",
                    "description": f"Completed all assignments in {module.title}"
                }
            )
            user_badge, created = UserBadge.objects.get_or_create(user=user, badge=badge)
            if created:
                logger.info(f"Badge '{badge.name}' awarded to user {user.id}")
```

---

## SECTION 9 — STREAKS APP

### `apps/streaks/models.py`

```python
import uuid
from django.db import models
from apps.users.models import CustomUser


class DSAProblem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    problem_statement = models.TextField()
    difficulty = models.CharField(
        max_length=10,
        choices=[("EASY", "Easy"), ("MEDIUM", "Medium"), ("HARD", "Hard")]
    )
    tags = models.JSONField(default=list)
    date = models.DateField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "streaks_dsaproblem"
        ordering = ["-date"]

    def __str__(self):
        return f"{self.date}: {self.title}"


class StreakRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="streak")
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_solved_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "streaks_streakrecord"

    def __str__(self):
        return f"{self.user.username} — streak: {self.current_streak}"
```

### `apps/streaks/services.py`

```python
from datetime import timedelta
from django.utils import timezone
from apps.users.models import CustomUser
from .models import DSAProblem, StreakRecord
from rest_framework.exceptions import ValidationError, NotFound
import logging

logger = logging.getLogger(__name__)


class StreakService:

    @staticmethod
    def get_today_problem() -> DSAProblem:
        today = timezone.now().date()
        try:
            return DSAProblem.objects.get(date=today)
        except DSAProblem.DoesNotExist:
            raise NotFound("No DSA problem scheduled for today.")

    @staticmethod
    def mark_solved(user: CustomUser) -> StreakRecord:
        today = timezone.now().date()
        record, _ = StreakRecord.objects.get_or_create(user=user)

        if record.last_solved_date == today:
            raise ValidationError("Today's problem already solved.")

        yesterday = today - timedelta(days=1)
        record.current_streak = (record.current_streak + 1) if record.last_solved_date == yesterday else 1
        record.last_solved_date = today
        record.longest_streak = max(record.longest_streak, record.current_streak)
        record.save()

        logger.info(f"User {user.id} streak: {record.current_streak} days")
        return record
```

---

## SECTION 10 — INTERNSHIPS APP

### `apps/internships/models.py`

```python
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
```

### `apps/internships/services.py`

```python
from apps.users.services import UserProfileService
from apps.users.models import CustomUser
from .models import Internship
import logging

logger = logging.getLogger(__name__)


class InternshipMatchingService:

    @staticmethod
    def get_recommendations(user: CustomUser) -> list:
        profile = UserProfileService.get_profile(user)
        user_skills = set(s.lower() for s in profile.interests)

        scored = []
        for internship in Internship.objects.all():
            required = set(s.lower() for s in internship.required_skills)
            if not required:
                continue
            matched = user_skills & required
            score = round((len(matched) / len(required)) * 100)
            scored.append({
                "id": str(internship.id),
                "company_name": internship.company_name,
                "role_title": internship.role_title,
                "location": internship.location,
                "is_remote": internship.is_remote,
                "stipend": internship.stipend,
                "deadline": str(internship.deadline) if internship.deadline else None,
                "application_url": internship.application_url,
                "match_score": score,
                "matched_skills": list(matched),
                "missing_skills": list(required - user_skills),
            })

        scored.sort(key=lambda x: x["match_score"], reverse=True)
        return scored
```

---

## SECTION 11 — ROOT URL CONFIGURATION

### `config/urls.py`

```python
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

api_v1_patterns = [
    path("", include("apps.users.urls")),
    path("", include("apps.learning.urls")),
    path("", include("apps.assignments.urls")),
    path("", include("apps.badges.urls")),
    path("", include("apps.streaks.urls")),
    path("", include("apps.internships.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
```

---

## SECTION 12 — AI PROMPT REFERENCE (Copy-Paste Ready)

### Prompt 1: Learning Path

```
SYSTEM:
You are an expert curriculum designer. Return ONLY valid JSON. No markdown.
Schema: { title, description, estimated_weeks, modules: [ { title, description, order, lectures: [ { title, description, youtube_url, duration_minutes, order } ] } ] }
Modules: 4-6. Lectures per module: 3-5.

USER:
CGPA: {cgpa} | Interests: {interests} | Target: {company} | Level: {skill_level}
Return only the JSON object.
```

### Prompt 2: Assignment

```
SYSTEM:
You are a senior instructor. Create a unique coding assignment. Return ONLY valid JSON. No markdown.
Schema: { problem_statement, requirements: [str], bonus_challenge, evaluation_criteria: { correctness, code_quality, efficiency, edge_cases } (sum=100), difficulty (EASY|MEDIUM|HARD), estimated_time_minutes, sample_input, sample_output }

USER:
Lecture: {title} | Module: {module} | Level: {skill_level}
Return only the JSON object.
```

### Prompt 3: Evaluation

```
SYSTEM:
You are a code reviewer. Evaluate the code. Return ONLY valid JSON. No markdown.
PASS if score >= 60. Schema: { score, verdict (PASS|FAIL), feedback, criteria_scores: { correctness, code_quality, efficiency, edge_cases }, strengths: [str], improvements: [str], bonus_attempted: bool }

USER:
Problem: {problem_statement}
Requirements: {requirements}
Language: {language}
Code: {solution_code}
Return only the JSON object.
```

---

## SECTION 13 — COMPLETE API REFERENCE

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register/` | No | Register new user |
| POST | `/api/v1/auth/login/` | No | Get JWT tokens |
| POST | `/api/v1/auth/token/refresh/` | No | Refresh access token |
| POST | `/api/v1/auth/logout/` | Yes | Blacklist refresh token |
| GET | `/api/v1/auth/me/` | Yes | Current user info |
| GET/POST | `/api/v1/profile/` | Yes | Get or create profile |
| PATCH | `/api/v1/profile/` | Yes | Partial update profile |
| POST | `/api/v1/learning/generate/` | Yes | Generate AI learning path |
| GET | `/api/v1/learning/paths/` | Yes | List user's paths (paginated) |
| GET | `/api/v1/learning/paths/{id}/` | Yes | Path with modules + lectures |
| POST | `/api/v1/learning/lectures/{id}/complete/` | Yes | Mark lecture complete + trigger assignment |
| GET | `/api/v1/assignments/` | Yes | List assignments (paginated) |
| GET | `/api/v1/assignments/{id}/` | Yes | Assignment detail |
| POST | `/api/v1/assignments/{id}/submit/` | Yes | Submit solution + get AI evaluation |
| GET | `/api/v1/badges/` | Yes | All available badges |
| GET | `/api/v1/badges/mine/` | Yes | Earned badges |
| GET | `/api/v1/streak/today/` | Yes | Today's DSA problem |
| POST | `/api/v1/streak/solve/` | Yes | Mark today solved + update streak |
| GET | `/api/v1/streak/status/` | Yes | Current + longest streak |
| GET | `/api/v1/internships/` | Yes | All internships (paginated) |
| GET | `/api/v1/internships/recommended/` | Yes | Skill-matched ranked list |

---

## SECTION 14 — ENVIRONMENT VARIABLES

`.env.example`:

```dotenv
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=ai_learning_db
DB_USER=db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## SECTION 15 — DOCKER

### `docker-compose.yml`

```yaml
version: "3.9"
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 5s
      retries: 5

  redis:
    image: redis:7-alpine

  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  celery:
    build: .
    command: celery -A config worker -l INFO
    volumes:
      - .:/app
    env_file: .env
    depends_on: [db, redis]

volumes:
  postgres_data:
```

---

## SECTION 16 — CODE GENERATION ORDER FOR AI ASSISTANT

When generating this project from scratch, follow this exact sequence:

```
Step 1  →  requirements.txt
Step 2  →  config/settings/base.py
Step 3  →  config/settings/development.py  (DEBUG=True, extends base)
Step 4  →  config/urls.py
Step 5  →  core/ai_client.py
Step 6  →  core/exceptions.py
Step 7  →  core/pagination.py
Step 8  →  core/renderers.py
Step 9  →  apps/users/models.py
Step 10 →  apps/users/serializers.py
Step 11 →  apps/users/services.py
Step 12 →  apps/users/views.py
Step 13 →  apps/users/urls.py
Step 14 →  [RUN] python manage.py makemigrations users && python manage.py migrate
Step 15 →  apps/learning/models.py → serializers.py → services.py → views.py → urls.py
Step 16 →  apps/assignments/models.py → serializers.py → services.py → views.py → urls.py → tasks.py
Step 17 →  apps/badges/models.py → services.py → views.py → urls.py
Step 18 →  apps/streaks/models.py → services.py → views.py → urls.py
Step 19 →  apps/internships/models.py → serializers.py → services.py → views.py → urls.py
Step 20 →  [RUN] python manage.py makemigrations && python manage.py migrate
Step 21 →  docker-compose.yml + Dockerfile
Step 22 →  pytest.ini + tests/ for each app
```

---

*This README is the single source of truth for backend code generation. All snippets are complete and production-ready.*
