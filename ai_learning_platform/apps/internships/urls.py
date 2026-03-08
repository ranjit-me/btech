from django.urls import path
from .views import InternshipListView, RecommendedInternshipsView

urlpatterns = [
    path("internships/", InternshipListView.as_view(), name="internship-list"),
    path("internships/recommended/", RecommendedInternshipsView.as_view(), name="internship-recommended"),
]
