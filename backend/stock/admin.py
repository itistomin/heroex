from django.contrib import admin

from stock.models import (
    GameWeek,
    Footballer,
    FootballerTeam,
    FootballerPosition,
    FootballerWeeksData,
    WeekIndexModel,
)


@admin.register(GameWeek)
class GameWeekAdmin(admin.ModelAdmin):
    list_display = ('number',)


@admin.register(Footballer)
class FootballerAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'position', 'price_dynamic',)


@admin.register(FootballerWeeksData)
class FootballerWeeksDataAdmin(admin.ModelAdmin):
    list_display = ('week', 'footballer', 'perfomance', 'buy_price', 'sell_price',)
    list_filter = ('week', 'footballer',)


@admin.register(FootballerPosition)
class FootballerPositionAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(FootballerTeam)
class FootballerTeamAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(WeekIndexModel,)
class WIA(admin.ModelAdmin):
    list_display = ('week', 'index',)