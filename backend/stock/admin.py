from django.contrib import admin

from stock.models import GameWeek, Footballer, FootballerWeeksData


@admin.register(GameWeek)
class GameWeekAdmin(admin.ModelAdmin):
    list_display = ('number',)


@admin.register(Footballer)
class FootballerAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_price',)


@admin.register(FootballerWeeksData)
class FootballerWeeksDataAdmin(admin.ModelAdmin):
    list_display = ('week', 'footballer', 'perfomance', 'hix',)
    list_filter = ('week', 'footballer',)
