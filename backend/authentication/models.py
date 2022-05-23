from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, EmailField


class User(AbstractUser):
    email = EmailField(unique=True)
    username = CharField(max_length=150, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
