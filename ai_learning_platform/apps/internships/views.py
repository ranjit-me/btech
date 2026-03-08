from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Internship
from .serializers import InternshipSerializer
from .services import InternshipMatchingService
from core.pagination import StandardPagination


class InternshipListView(APIView):
    def get(self, request):
        internships = Internship.objects.all()
        paginator = StandardPagination()
        page = paginator.paginate_queryset(internships, request)
        return paginator.get_paginated_response(InternshipSerializer(page, many=True).data)


class RecommendedInternshipsView(APIView):
    def get(self, request):
        recommendations = InternshipMatchingService.get_recommendations(request.user)
        return Response({"status": "success", "data": recommendations})
