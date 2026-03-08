from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import LearningPath
from .serializers import LearningPathSerializer, LearningPathListSerializer, LectureCompletionSerializer
from .services import LearningPathService
from core.pagination import StandardPagination


class GenerateLearningPathView(APIView):
    def post(self, request):
        path = LearningPathService.generate_for_user(request.user)
        return Response({"status": "success", "data": LearningPathSerializer(path).data}, status=201)


class LearningPathListView(APIView):
    def get(self, request):
        paths = LearningPath.objects.filter(user=request.user)
        paginator = StandardPagination()
        page = paginator.paginate_queryset(paths, request)
        return paginator.get_paginated_response(LearningPathListSerializer(page, many=True).data)


class LearningPathDetailView(APIView):
    def get(self, request, pk):
        try:
            path = LearningPath.objects.prefetch_related("modules__lectures").get(id=pk, user=request.user)
        except LearningPath.DoesNotExist:
            return Response({"status": "error", "message": "Not found."}, status=404)
        return Response({"status": "success", "data": LearningPathSerializer(path).data})


class CompleteLectureView(APIView):
    def post(self, request, lecture_id):
        completion = LearningPathService.complete_lecture(request.user, lecture_id)
        from apps.assignments.tasks import generate_assignment_task
        generate_assignment_task.delay(str(request.user.id), str(lecture_id))
        return Response({
            "status": "success",
            "message": "Lecture completed. Assignment generation triggered.",
            "data": LectureCompletionSerializer(completion).data,
        }, status=201)
