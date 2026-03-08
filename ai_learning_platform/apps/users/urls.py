from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import RegisterView, MeView, UserProfileView, PerformanceStatsView

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="auth-login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("auth/logout/", TokenBlacklistView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("performance/stats/", PerformanceStatsView.as_view(), name="performance-stats"),
]
