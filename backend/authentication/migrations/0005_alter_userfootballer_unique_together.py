# Generated by Django 4.0.4 on 2022-05-24 05:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0002_footballerweeksdata_hix'),
        ('authentication', '0004_userfootballer_user_footballers_user_week_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='userfootballer',
            unique_together={('user', 'footballer')},
        ),
    ]
