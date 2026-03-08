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
