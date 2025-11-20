# Create your views here.
import os
import json
from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import IntegrityError

from .models import WeightLog
from .serializers import WeightLogSerializer


# -------------------------------------------------------------------
# 工具函数：读取同级目录 JSON 文件
# -------------------------------------------------------------------
def load_weight_json():
    json_path = os.path.join(os.path.dirname(__file__), "weightLogInfo.cleaned.json")

    if not os.path.exists(json_path):
        return None

    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


# -------------------------------------------------------------------
# GET /weight/<id>/   → 返回所有记录（JSON 文件）
# -------------------------------------------------------------------
class WeightLogListById(APIView):
    def get(self, request, id):
        data = load_weight_json()
        if data is None:
            return Response({"detail": "JSON file not found."}, status=500)

        # 过滤 Id
        records = [r for r in data if r.get("Id") == id]

        # 解析日期
        def parse_date(date_str):
            for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
                try:
                    return datetime.strptime(date_str, fmt)
                except:
                    continue
            return None

        # 排序
        records.sort(key=lambda r: parse_date(r["Date"]) or datetime.min)

        return Response(records, status=200)


# -------------------------------------------------------------------
# GET /weight/<id>/daily/   → 返回格式化后的每日数据
# -------------------------------------------------------------------
class DailyWeightByIdView(APIView):
    def get(self, request, id):
        data = load_weight_json()
        if data is None:
            return Response({"detail": "JSON file not found."}, status=500)

        # 过滤 Id
        records = [r for r in data if r.get("Id") == id]

        # 解析日期
        def parse_date(date_str):
            for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
                try:
                    return datetime.strptime(date_str, fmt)
                except:
                    continue
            return None

        # 排序
        records.sort(key=lambda r: parse_date(r["Date"]) or datetime.min)

        # 减少字段，只保留图表需要的数据
        result = [
            {
                "date": parse_date(r["Date"]).strftime("%Y-%m-%d")
                if parse_date(r["Date"])
                else r["Date"],
                "WeightKg": r.get("WeightKg"),
                "WeightPounds": r.get("WeightPounds"),
                "Fat": r.get("Fat"),
                "BMI": r.get("BMI"),
            }
            for r in records
        ]

        return Response(result, status=200)


# -------------------------------------------------------------------
# POST /weight/add/    → 写入数据库（不写 JSON）
# -------------------------------------------------------------------
class WeightLogCreateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = WeightLogSerializer(data=request.data)

        if serializer.is_valid():
            db_saved = True
            record = None
            try:
                record = serializer.save()
            except IntegrityError:
                # DB schema/migration mismatch in dev can raise IntegrityError (e.g. missing NOT NULL columns).
                # For dev convenience, don't fail the entire request — we'll still append to the cleaned JSON file
                db_saved = False

            # Also append to cleaned JSON for dev/testing convenience
            try:
                json_path = os.path.join(os.path.dirname(__file__), "weightLogInfo.cleaned.json")
                obj = {
                    "Id": int(request.data.get("Id")) if request.data.get("Id") is not None else None,
                    "Date": None,
                    "WeightKg": float(request.data.get("WeightKg")) if request.data.get("WeightKg") is not None else None,
                    "WeightPounds": float(request.data.get("WeightPounds")) if request.data.get("WeightPounds") is not None else None,
                    "Fat": (float(request.data.get("Fat")) if request.data.get("Fat") not in (None, "") else None),
                    "BMI": (float(request.data.get("BMI")) if request.data.get("BMI") not in (None, "") else None),
                }
                # normalize date to 'YYYY-MM-DD HH:MM:SS' when possible
                date_str = request.data.get("Date")
                if date_str:
                    try:
                        # handle ISO dates with Z
                        ds = date_str.replace("Z", "")
                        dt = datetime.fromisoformat(ds)
                        obj["Date"] = dt.strftime("%Y-%m-%d %H:%M:%S")
                    except Exception:
                        try:
                            dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
                            obj["Date"] = dt.strftime("%Y-%m-%d %H:%M:%S")
                        except Exception:
                            obj["Date"] = date_str

                # read existing json, append, write back
                if os.path.exists(json_path):
                    with open(json_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                else:
                    data = []
                data.append(obj)
                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                json_ok = True
            except Exception:
                json_ok = False

            # Build response payload. If DB save failed, fall back to request data to return a sensible payload.
            if db_saved and record is not None:
                resp = WeightLogSerializer(record).data
                resp.update({"db_saved": True})
            else:
                # Use posted data as best-effort response shape
                resp = {
                    "Id": int(request.data.get("Id")) if request.data.get("Id") is not None else None,
                    "Date": request.data.get("Date"),
                    "WeightKg": float(request.data.get("WeightKg")) if request.data.get("WeightKg") is not None else None,
                    "WeightPounds": float(request.data.get("WeightPounds")) if request.data.get("WeightPounds") is not None else None,
                    "Fat": (float(request.data.get("Fat")) if request.data.get("Fat") not in (None, "") else None),
                    "BMI": (float(request.data.get("BMI")) if request.data.get("BMI") not in (None, "") else None),
                    "db_saved": False,
                }

            resp["json_appended"] = json_ok
            return Response(resp, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
