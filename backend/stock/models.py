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

    def __str__(self):
        return f'Week {self.number}'


class Footballer(Model):
    name = CharField(max_length=100)
    start_price = DecimalField(max_digits=10, decimal_places=2, null=False)

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
        return float('%.2f' % (float(self.hix) * 0.95))
