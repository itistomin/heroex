# Generated by Django 4.0.4 on 2022-06-04 06:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0011_usertradelog_reward'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameResultsLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_pnl', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('total_rewards', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('total_return', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]