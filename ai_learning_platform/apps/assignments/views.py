from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Assignment
from .serializers import AssignmentSerializer, SubmissionCreateSerializer, EvaluationResultSerializer
from .services import EvaluationService
from core.pagination import StandardPagination


class AssignmentListView(APIView):
    def get(self, request):
        qs = Assignment.objects.filter(user=request.user).select_related("lecture")
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        return paginator.get_paginated_response(AssignmentSerializer(page, many=True).data)


class AssignmentDetailView(APIView):
    def get(self, request, pk):
        try:
            assignment = Assignment.objects.get(id=pk, user=request.user)
        except Assignment.DoesNotExist:
            return Response({"status": "error", "message": "Not found."}, status=404)
        return Response({"status": "success", "data": AssignmentSerializer(assignment).data})


class SubmitAssignmentView(APIView):
    def post(self, request, pk):
        serializer = SubmissionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = EvaluationService.evaluate(
            user=request.user,
            assignment_id=str(pk),
            solution_code=serializer.validated_data["solution_code"],
            language=serializer.validated_data["language"],
        )
        return Response({
            "status": "success",
            "message": "Submission evaluated.",
            "data": EvaluationResultSerializer(result).data,
        }, status=201)
