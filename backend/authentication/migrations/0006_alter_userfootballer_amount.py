# Generated by Django 4.0.4 on 2022-05-24 05:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_alter_userfootballer_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userfootballer',
            name='amount',
            field=models.PositiveIntegerField(null=True),
        ),
    ]