import json
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from sleep.models import SleepLog


class Command(BaseCommand):
    help = "Import sleep data from a JSON file matching the sleepDay_merged format."

    def add_arguments(self, parser):
        parser.add_argument("--path", type=str, required=True, help="Path to the JSON file.")
        parser.add_argument(
            "--username",
            type=str,
            required=True,
            help="Username to associate the imported sleep entries with.",
        )

    def handle(self, *args, **options):
        path = Path(options["path"])
        username = options["username"]
        if not path.exists():
            raise CommandError(f"File not found: {path}")

        User = get_user_model()
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist as exc:
            raise CommandError(f"User '{username}' not found") from exc

        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)

        created = 0
        updated = 0
        for row in data:
            day = datetime.strptime(row["SleepDay"], "%m/%d/%Y %I:%M:%S %p").date()
            obj, was_created = SleepLog.objects.update_or_create(
                user=user,
                sleep_day=day,
                source=SleepLog.SOURCE_DEVICE,
                defaults={
                    "total_sleep_records": row["TotalSleepRecords"],
                    "total_minutes_asleep": row["TotalMinutesAsleep"],
                    "total_time_in_bed": row["TotalTimeInBed"],
                    "device_user_id": row.get("Id"),
                },
            )
            created += 1 if was_created else 0
            updated += 0 if was_created else 1

        self.stdout.write(self.style.SUCCESS(f"Imported {created} new rows, updated {updated} rows for {username}."))
