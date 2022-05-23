from django.contrib.auth.hashers import make_password
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated

from userprofile.serializers import (
    CreateUserSerializer,
    UserSerializer,
)


VIEWS_TAG = 'User'


@extend_schema(tags=[VIEWS_TAG])
class CreateUserView(APIView):
    authentication_classes = tuple()

    @extend_schema(request=CreateUserSerializer)
    def post(self, request):
        data = {
            **request.data,
            'password': make_password(request.data.get('password'))
        }
        new_user = CreateUserSerializer(data=data)
        if new_user.is_valid():
            new_user.save()
            return Response({'detail': 'User created successfully'}, 201)

        return Response({'detail': new_user.errors}, 422)


@extend_schema(tags=[VIEWS_TAG])
class DetailsUserView(APIView):
    permission_classes = (IsAuthenticated,)
    
    @extend_schema(responses={
        200: UserSerializer,
    })
    def get(self, request):
        return Response(
            UserSerializer(instance=request.user).data,
            200,
        )    
