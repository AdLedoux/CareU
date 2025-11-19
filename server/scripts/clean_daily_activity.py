#!/usr/bin/env python3
"""
Clean daily activity JSON to keep only fields required by Activity model and inject username
Usage:
  python scripts/clean_daily_activity.py --input ../activity/dailyActivity_merged.json --output ../activity/dailyActivity.cleaned.json --default import_user --preview 5
"""
import argparse
import json
from datetime import datetime
from pathlib import Path


def parse_date(s):
    if not s:
        return None
    # try known formats: m/d/YYYY or mm/dd/YYYY or YYYY-MM-DD
    for fmt in ("%m/%d/%Y", "%m/%d/%y", "%Y-%m-%d"):
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except Exception:
            continue
    # try to coerce numbers (some files have day/month without zero padding)
    parts = s.split('/')
    if len(parts) == 3:
        m, d, y = parts
        try:
            m = int(m); d = int(d); y = int(y)
            if y < 100: y += 2000
            return datetime(y, m, d).date().isoformat()
        except Exception:
            return None
    return None


def clean_record(rec, default_username):
    # Extract fields, tolerate various key names
    Id = rec.get('Id') or rec.get('id') or None
    raw_date = rec.get('ActivityDate') or rec.get('Date') or rec.get('activityDate') or rec.get('date')
    ActivityDate = parse_date(raw_date)
    TotalSteps = rec.get('TotalSteps') if rec.get('TotalSteps') is not None else rec.get('steps') if rec.get('steps') is not None else 0
    try:
        TotalSteps = int(TotalSteps or 0)
    except Exception:
        TotalSteps = 0
    TotalDistance = rec.get('TotalDistance') if rec.get('TotalDistance') is not None else rec.get('Distance') if rec.get('Distance') is not None else 0.0
    try:
        TotalDistance = float(TotalDistance or 0.0)
    except Exception:
        TotalDistance = 0.0
    Calories = rec.get('Calories') if rec.get('Calories') is not None else rec.get('calories') if rec.get('calories') is not None else 0
    try:
        Calories = int(Calories or 0)
    except Exception:
        Calories = 0

    username = rec.get('username') or rec.get('user') or rec.get('userName') or default_username

    cleaned = {
        # only include Id if present to avoid collisions; the import command can use update_or_create logic
        **({'Id': Id} if Id is not None else {}),
        'ActivityDate': ActivityDate,
        'TotalSteps': TotalSteps,
        'TotalDistance': TotalDistance,
        'Calories': Calories,
        'username': username,
    }
    return cleaned


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', '-i', required=True, help='Path to input JSON file')
    parser.add_argument('--output', '-o', required=True, help='Path to output cleaned JSON file')
    parser.add_argument('--default', '-d', default='import_user', help='Default username to inject when missing')
    parser.add_argument('--preview', type=int, default=0, help='Number of records to preview')
    args = parser.parse_args()

    in_path = Path(args.input)
    out_path = Path(args.output)

    if not in_path.exists():
        print(f"Input file not found: {in_path}")
        return

    data = json.loads(in_path.read_text(encoding='utf-8'))
    cleaned = []
    for rec in data:
        c = clean_record(rec, args.default)
        # Only keep records with valid date
        if c['ActivityDate'] is None:
            # skip records with unparsable date
            continue
        cleaned.append(c)

    out_path.write_text(json.dumps(cleaned, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"Wrote {len(cleaned)} cleaned records to {out_path}")
    if args.preview and len(cleaned) > 0:
        print('\nPreview:')
        for r in cleaned[:args.preview]:
            print(r)


if __name__ == '__main__':
    main()
