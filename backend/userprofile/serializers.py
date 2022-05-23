from rest_framework.serializers import ModelSerializer

from authentication.models import User


class CreateUserSerializer(ModelSerializer):
    
    class Meta:
        model = User
        fields = ('email', 'password',)


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'username',)
