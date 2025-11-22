from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="SleepLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("device_user_id", models.BigIntegerField(blank=True, null=True)),
                ("sleep_day", models.DateField()),
                ("total_sleep_records", models.PositiveSmallIntegerField(default=1)),
                ("total_minutes_asleep", models.PositiveIntegerField()),
                ("total_time_in_bed", models.PositiveIntegerField()),
                ("reported_hours", models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ("was_interrupted", models.BooleanField(default=False)),
                ("interruptions", models.PositiveSmallIntegerField(default=0)),
                ("interruption_minutes", models.PositiveIntegerField(default=0)),
                ("notes", models.CharField(blank=True, max_length=255)),
                ("source", models.CharField(choices=[("device", "Device"), ("manual", "Manual")], default="device", max_length=10)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="sleep_logs", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ["-sleep_day", "-created_at"],
                "unique_together": {("user", "sleep_day", "source")},
            },
        ),
    ]
