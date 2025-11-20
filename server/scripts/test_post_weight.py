import json
import urllib.request
import urllib.error

url = 'http://127.0.0.1:8000/api/weightlog/weight/add/'
payload = {
    'Id': 8877689391,
    'Date': '2016-04-13 00:00:00',
    'WeightKg': 70.5,
    'WeightPounds': 70.5 * 2.20462,
    'Fat': 20.1,
    'BMI': 24.5,
}
req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    r = urllib.request.urlopen(req, timeout=5)
    print('STATUS', r.getcode())
    print(r.read().decode())
except urllib.error.HTTPError as e:
    print('HTTPERROR', e.code)
    try:
        print(e.read().decode())
    except Exception:
        pass
except Exception as e:
    print('ERROR', e)
