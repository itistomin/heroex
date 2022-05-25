from email.policy import default
from django.contrib.auth.models import AbstractUser
from django.db.models import (
    CASCADE,
    CharField,
    DecimalField,
    EmailField,
    ForeignKey,
    ManyToManyField,
    Model,
    PositiveIntegerField,
    SET_NULL
)

from stock.models import Footballer, GameWeek


class User(AbstractUser):
    email = EmailField(unique=True)
    username = CharField(max_length=150, null=True)
    
    balance = DecimalField(max_digits=50, decimal_places=2, default=500.00)
    footballers = ManyToManyField(to=Footballer, through='UserFootballer')
    week = ForeignKey(to=GameWeek, on_delete=SET_NULL, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username or self.email


class UserFootballer(Model):
    user = ForeignKey(to=User, on_delete=CASCADE)
    footballer = ForeignKey(to=Footballer, on_delete=CASCADE)
    amount = PositiveIntegerField(null=True, default=0)

    class Meta:
        unique_together = ('user', 'footballer',)

    def __str__(self):
        return f'{self.user} {self.footballer} {self.amount}'
