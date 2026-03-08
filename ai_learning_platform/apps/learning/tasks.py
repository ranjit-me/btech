from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def refresh_learning_path_task(self, user_id: str):
    """Placeholder for async learning path refresh tasks."""
    try:
        logger.info(f"Learning path refresh triggered for user {user_id}")
    except Exception as exc:
        logger.error(f"Learning task failed: {exc}")
        raise self.retry(exc=exc)
