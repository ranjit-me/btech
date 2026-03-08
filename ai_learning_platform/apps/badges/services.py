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
