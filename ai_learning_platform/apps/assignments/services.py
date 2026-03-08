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
