# Generated by Django 4.0.4 on 2022-05-30 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0009_usertradelog'),
    ]

    operations = [
        migrations.AddField(
            model_name='usertradelog',
            name='amount',
            field=models.PositiveIntegerField(default=0),
        ),
    ]