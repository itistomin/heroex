from email.policy import default
from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, DecimalField, EmailField


class User(AbstractUser):
    email = EmailField(unique=True)
    username = CharField(max_length=150, null=True)
    balance = DecimalField(max_digits=50, decimal_places=2, default=500.00)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
