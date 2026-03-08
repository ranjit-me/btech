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
