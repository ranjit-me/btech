"""
Local development settings — uses SQLite so no PostgreSQL server is needed.
Run with: DJANGO_SETTINGS_MODULE=config.settings.local python manage.py runserver
"""
from .base import *

DEBUG = True
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True

# Override SECRET_KEY for local dev (safe — never use in production)
SECRET_KEY = "local-dev-secret-key-do-not-use-in-production-ever-change-me"

# MySQL — using credentials from .env
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
    }
}

# Disable throttling during local dev
REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = []

# Celery — run tasks synchronously (no Redis needed locally)
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# AI — reads from .env file
AI_PROVIDER = env("AI_PROVIDER", default="openai")
OPENAI_API_KEY = env("OPENAI_API_KEY", default="")
OPENAI_MODEL = env("OPENAI_MODEL", default="gpt-4o")
