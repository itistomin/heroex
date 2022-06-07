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

from stock.models import Footballer, GameWeek, FootballerWeeksData


class User(AbstractUser):
    email = EmailField(unique=True)
    username = CharField(max_length=150, null=True)
    
    balance = DecimalField(max_digits=50, decimal_places=2, default=500.00)
    footballers = ManyToManyField(to=Footballer, through='UserFootballer')
    week = ForeignKey(to=GameWeek, on_delete=SET_NULL, null=True)
    game_number = PositiveIntegerField(null=False, default=1)
    reward = DecimalField(max_digits=10, decimal_places=2, null=True, default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class UserFootballer(Model):
    user = ForeignKey(to=User, on_delete=CASCADE)
    footballer = ForeignKey(to=Footballer, on_delete=CASCADE)
    amount = PositiveIntegerField(null=True, default=0)
    trade_price = DecimalField(max_digits=10, decimal_places=2, null=True, default=0)

    class Meta:
        unique_together = ('user', 'footballer',)

    @property
    def reward(self):
        return self.footballer.reward_index(self.user.week) * self.amount

    @property
    def pnl(self):
        return self.value - self.cost

    @property
    def cost(self):
        return self.trade_price * self.amount

    def __str__(self):
        return f'{self.user} {self.footballer} {self.amount}'


class UserTradeLog(Model):
    user = ForeignKey(to=User, on_delete=CASCADE)
    footballer = ForeignKey(to=Footballer, on_delete=CASCADE)
    week = ForeignKey(to=GameWeek, on_delete=CASCADE)

    amount = PositiveIntegerField(default=0)
    buy_price = DecimalField(max_digits=10, decimal_places=2, null=True, default=0)
    reward = DecimalField(max_digits=10, decimal_places=2, null=True, default=0)

    class Meta:
        unique_together = ('user', 'footballer', 'week')


class GameResultsLog(Model):
    user = ForeignKey(to='User', on_delete=CASCADE)
    game_number = PositiveIntegerField(null=False)
    total_pnl = DecimalField(max_digits=10, decimal_places=2, null=True)
    total_rewards = DecimalField(max_digits=10, decimal_places=2, null=True)
    total_return = DecimalField(max_digits=10, decimal_places=2, null=True)

    def str(self):
        return f'{self.user} | {self.total_return}'
