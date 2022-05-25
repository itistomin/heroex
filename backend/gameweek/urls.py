from django.urls import path, include

from gameweek.views import (
    NextWeekView,
    ResetWeekView,
)


urlpatterns = [
    path('next/', NextWeekView.as_view(), name="next_week"),
    path('reset/', ResetWeekView.as_view(), name="next_week"),
]
