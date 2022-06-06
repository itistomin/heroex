from django.db.models import (
    CASCADE,
    CharField,
    DecimalField,
    ForeignKey,
    Model,
    PositiveIntegerField,
    SET_NULL,
)
from django.conf import settings


class GameWeek(Model):
    number = PositiveIntegerField(null=False)

    def __str__(self):
        return f'Week {self.number}'


class FootballerTeam(Model):
    name = CharField(max_length=255)

    def __str__(self):
        return self.name


class FootballerPosition(Model):
    name = CharField(max_length=255)

    def __str__(self):
        return self.name


class FootballerWeeksData(Model):
    week = ForeignKey(to='GameWeek', on_delete=CASCADE)
    footballer = ForeignKey(to='Footballer', on_delete=CASCADE)
    perfomance = PositiveIntegerField(null=False)
    hix = DecimalField(max_digits=10, decimal_places=2, null=False)

    @property
    def buy_price(self):
        return self.hix
    
    @property
    def sell_price(self):
        return float('%.2f' % (self.hix * settings.SELL_PRICE_MULTIPLIER))


class Footballer(Model):
    name = CharField(max_length=100)
    team = ForeignKey(to=FootballerTeam, on_delete=SET_NULL, null=True)
    position = ForeignKey(to=FootballerPosition, on_delete=SET_NULL, null=True)
    price_dynamic = DecimalField(max_digits=10, decimal_places=2, null=True)

    def reward_index(self, week):
        top_three = FootballerWeeksData.objects.filter(week=week).order_by('-perfomance')[:3]
        for index, footballer_data in enumerate(top_three):
            if footballer_data.footballer == self:
                return 0.5 - (index % 10)
        return 0

    def __str__(self):
        return self.name

class WeekIndexModel(Model):
    week = ForeignKey(to=GameWeek, on_delete=CASCADE)
    index = DecimalField(max_digits=10, decimal_places=2, null=False)
