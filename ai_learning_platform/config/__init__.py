# This makes Celery app be loaded whenever Django starts,
# so that shared_task decorators in all apps work correctly.
import pymysql

pymysql.version_info = (2, 2, 8, "final", 0)
pymysql.install_as_MySQLdb()

from .celery import app as celery_app

__all__ = ("celery_app",)
