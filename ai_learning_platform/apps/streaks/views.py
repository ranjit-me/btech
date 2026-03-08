from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import DSAProblemSerializer, StreakRecordSerializer
from .services import StreakService
from .models import StreakRecord


class TodayProblemView(APIView):
    def get(self, request):
        problem = StreakService.get_today_problem()
        return Response({"status": "success", "data": DSAProblemSerializer(problem).data})


class MarkSolvedView(APIView):
    def post(self, request):
        record = StreakService.mark_solved(request.user)
        return Response({
            "status": "success",
            "message": "Problem marked as solved.",
            "data": StreakRecordSerializer(record).data,
        })


class StreakStatusView(APIView):
    def get(self, request):
        record, _ = StreakRecord.objects.get_or_create(user=request.user)
        return Response({"status": "success", "data": StreakRecordSerializer(record).data})
