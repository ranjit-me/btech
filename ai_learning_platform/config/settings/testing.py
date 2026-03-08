"""
Test settings — uses SQLite in-memory so tests run without a PostgreSQL server.
"""
from .base import *

DEBUG = True

# Use a long key for testing to avoid InsecureKeyLengthWarning from PyJWT
SECRET_KEY = "test-secret-key-that-is-long-enough-for-hmac-sha256-minimum-32-bytes"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# Disable throttling during tests
REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = []
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {}

# Speed up password hashing in tests
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# Don't need Celery during tests
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
