from django.urls import path
from .views import TodayProblemView, MarkSolvedView, StreakStatusView

urlpatterns = [
    path("streak/today/", TodayProblemView.as_view(), name="streak-today"),
    path("streak/solve/", MarkSolvedView.as_view(), name="streak-solve"),
    path("streak/status/", StreakStatusView.as_view(), name="streak-status"),
]
