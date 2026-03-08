from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserProfileSerializer, CurrentUserSerializer
from .services import UserProfileService


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "status": "success",
            "message": "Account created successfully.",
            "data": {
                "user_id": str(user.id),
                "email": user.email,
                "username": user.username,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            }
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response({"status": "success", "data": serializer.data})


class UserProfileView(APIView):

    def get(self, request):
        profile = UserProfileService.get_profile(request.user)
        return Response({"status": "success", "data": UserProfileSerializer(profile).data})

    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = UserProfileService.create_profile(request.user, serializer.validated_data)
        return Response({"status": "success", "data": UserProfileSerializer(profile).data}, status=201)

    def patch(self, request):
        serializer = UserProfileSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        profile = UserProfileService.update_profile(request.user, serializer.validated_data)
        return Response({"status": "success", "data": UserProfileSerializer(profile).data})


class PerformanceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.learning.models import Module, LectureCompletion, LearningPath
        from datetime import datetime, timedelta
        
        # 1. Subject-wise performance (from your most recent roadmap)
        latest_path = LearningPath.objects.filter(user=request.user).first()
        subject_scores = []
        if latest_path:
            modules = latest_path.modules.all()
            for mod in modules:
                total_lectures = mod.lectures.count()
                completed = LectureCompletion.objects.filter(user=request.user, lecture__module=mod).count()
                score = (completed / total_lectures * 100) if total_lectures > 0 else 0
                subject_scores.append({
                    "subject": mod.title[:20] + "..." if len(mod.title) > 20 else mod.title,
                    "score": round(score)
                })
        else:
            # Fallback
            subject_scores = [{"subject": "No Roadmap Yet", "score": 0}]

        # 2. Predicted/Current Growth
        # Count completions per month for the last 5 months
        growth = []
        today = datetime.now()
        for i in range(4, -1, -1):
            date = today - timedelta(days=i*30)
            month_name = date.strftime("%b")
            count = LectureCompletion.objects.filter(
                user=request.user,
                completed_at__year=date.year,
                completed_at__month=date.month
            ).count()
            growth.append({"month": month_name, "score": count * 10 + 50}) # scale it for visualization

        # 3. Strength / Weakness (Radar)
        # Placeholder based on interests if available
        skill_radar = [
            {"skill": "Problem Solving", "level": 85},
            {"skill": "Communication", "level": 70},
            {"skill": "Teamwork", "level": 78},
            {"skill": "Tech Adaptability", "level": 88},
        ]

        return Response({
            "status": "success",
            "data": {
                "subject_scores": subject_scores,
                "predicted_growth": growth,
                "skill_radar": skill_radar
            }
        })
