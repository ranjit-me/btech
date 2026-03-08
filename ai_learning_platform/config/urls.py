from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

api_v1_patterns = [
    path("", include("apps.users.urls")),
    path("", include("apps.learning.urls")),
    path("", include("apps.assignments.urls")),
    path("", include("apps.badges.urls")),
    path("", include("apps.streaks.urls")),
    path("", include("apps.internships.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
