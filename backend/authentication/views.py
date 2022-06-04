from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import exceptions
from rest_framework_simplejwt.settings import api_settings

from authentication.models import User
from stock.models import GameWeek


class GetTokenCreateUserView(TokenObtainPairView):
    
    def post(self, request, *args, **kwargs):
        try:
            User.objects.create_user(
                **{
                    'email': request.data.get('email'),
                    'password': request.data.get('password'),
                    'username': 'Random User',
                    'week': GameWeek.objects.get(number=0),
                    'is_active': True,
                }
            )
        except Exception as E:
            ...

        serializer = TokenObtainPairSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
