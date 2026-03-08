from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Badge, UserBadge
from .serializers import BadgeSerializer, UserBadgeSerializer


class BadgeListView(APIView):
    def get(self, request):
        badges = Badge.objects.all()
        return Response({"status": "success", "data": BadgeSerializer(badges, many=True).data})


class MyBadgesView(APIView):
    def get(self, request):
        user_badges = UserBadge.objects.filter(user=request.user).select_related("badge")
        return Response({"status": "success", "data": UserBadgeSerializer(user_badges, many=True).data})
