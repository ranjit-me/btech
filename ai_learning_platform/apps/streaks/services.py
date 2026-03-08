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
