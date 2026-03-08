from django.urls import path
from .views import GenerateLearningPathView, LearningPathListView, LearningPathDetailView, CompleteLectureView

urlpatterns = [
    path("learning/generate/", GenerateLearningPathView.as_view(), name="learning-generate"),
    path("learning/paths/", LearningPathListView.as_view(), name="learning-path-list"),
    path("learning/paths/<uuid:pk>/", LearningPathDetailView.as_view(), name="learning-path-detail"),
    path("learning/lectures/<uuid:lecture_id>/complete/", CompleteLectureView.as_view(), name="lecture-complete"),
]
