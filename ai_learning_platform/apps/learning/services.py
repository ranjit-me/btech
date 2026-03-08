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
    @transaction.atomic
    def complete_lecture(user: CustomUser, lecture_id: str) -> LectureCompletion:
        try:
            lecture = Lecture.objects.get(id=lecture_id)
        except Lecture.DoesNotExist:
            raise NotFound("Lecture not found.")
        
        if LectureCompletion.objects.filter(user=user, lecture=lecture).exists():
            return LectureCompletion.objects.get(user=user, lecture=lecture)
        
        completion = LectureCompletion.objects.create(user=user, lecture=lecture)
        
        # Check if entire module is complete
        module = lecture.module
        total_lectures = module.lectures.count()
        completed_lectures = LectureCompletion.objects.filter(
            user=user, lecture__module=module
        ).count()
        
        if total_lectures > 0 and completed_lectures == total_lectures:
            # Award module badge
            LearningPathService._award_badge(user, f"{module.title} Specialist", f"Completed module: {module.title}", "https://cdn-icons-png.flaticon.com/512/3112/3112946.png")
            
            # Check if entire path is complete
            path = module.learning_path
            all_modules_complete = True
            for m in path.modules.all():
                if LectureCompletion.objects.filter(user=user, lecture__module=m).count() < m.lectures.count():
                    all_modules_complete = False
                    break
            
            if all_modules_complete:
                path.status = LearningPath.Status.COMPLETED
                path.save()
                LearningPathService._award_badge(user, f"{path.title} Master", f"Completed the entire '{path.title}' roadmap!", "https://cdn-icons-png.flaticon.com/512/1087/1087840.png")
                
        return completion

    @staticmethod
    def _award_badge(user, name, description, icon):
        from apps.badges.models import Badge, UserBadge
        badge, _ = Badge.objects.get_or_create(
            name=name,
            defaults={"description": description, "icon_url": icon}
        )
        UserBadge.objects.get_or_create(user=user, badge=badge)
    
