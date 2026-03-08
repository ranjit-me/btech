from django.urls import path
from .views import BadgeListView, MyBadgesView

urlpatterns = [
    path("badges/", BadgeListView.as_view(), name="badge-list"),
    path("badges/mine/", MyBadgesView.as_view(), name="my-badges"),
]
