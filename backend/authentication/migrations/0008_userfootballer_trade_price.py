# Generated by Django 4.0.4 on 2022-05-27 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0007_alter_userfootballer_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfootballer',
            name='trade_price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10, null=True),
        ),
    ]
