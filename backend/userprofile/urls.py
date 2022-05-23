from django.urls import path

from userprofile.views import (
    CreateUserView,
    DetailsUserView,
)


urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create_user'),
    path('details/', DetailsUserView.as_view(), name='details_user'),
]
