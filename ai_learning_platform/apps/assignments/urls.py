from django.urls import path
from .views import AssignmentListView, AssignmentDetailView, SubmitAssignmentView

urlpatterns = [
    path("assignments/", AssignmentListView.as_view(), name="assignment-list"),
    path("assignments/<uuid:pk>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("assignments/<uuid:pk>/submit/", SubmitAssignmentView.as_view(), name="assignment-submit"),
]
