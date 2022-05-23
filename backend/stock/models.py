from django.db.models import (
    CASCADE,
    CharField,
    DecimalField,
    ForeignKey,
    Model,
    PositiveIntegerField,
)


class GameWeek(Model):
    number = PositiveIntegerField(null=False)


class Footballer(Model):
    name = CharField(max_length=100)
    start_price = DecimalField(max_digits=10, decimal_places=2, null=False)


class FootballerWeeksData(Model):
    week = ForeignKey(to='GameWeek', on_delete=CASCADE)
    footballer = ForeignKey(to='Footballer', on_delete=CASCADE)
    perfomance = PositiveIntegerField(null=False)
