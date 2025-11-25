from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ai_agent import ai_service

from weightlog.models import WeightLog
from mood.models import Mood
from fitnessRecord.models import FitnessRecord


# AI Chat
class AIChat(APIView):
    def post(self, request):
        user_input = request.data.get("message", "")
        if not user_input:
            return Response({"result": "Please provide a message"})
        result = ai_service(f"User said: {user_input}")
        return Response({"result": result})


# Weight
class AIWeight(APIView):
    def post(self, request):
        user_id = request.data.get("user_id") or request.query_params.get("user_id")
        qs = WeightLog.objects.all()
        if user_id:
            qs = qs.filter(user__user_id=user_id)
        logs = qs.order_by("-Date")[:7]
        if not logs or len(logs) < 1:
            return Response(
                {
                    "result": "More weight data is needed for analysis (at least 1 records)."
                },
                status=status.HTTP_200_OK,
            )
        weight_text_lines = []
        for w in logs:
            fat = getattr(w, "Fat", None)
            fat_str = f" Fat {fat}" if fat is not None else ""
            weight_text_lines.append(
                f"{w.Date.strftime('%Y-%m-%d')}: {w.WeightKg} kg{fat_str}"
            )
        weight_text = "\n".join(reversed(weight_text_lines))
        prompt = f"User's last {len(logs)} weight logs:\n{weight_text}\nPlease provide a short, friendly analysis in English, and 2 actionable suggestions."
        result = ai_service(prompt)
        return Response({"result": result})


# Mood
class AIMood(APIView):
    def post(self, request):
        user_id = request.data.get("user_id") or request.query_params.get("user_id")
        qs = Mood.objects.all()
        if user_id:
            qs = qs.filter(user__user_id=user_id)
        moods = qs.order_by("-timestamp")[:7]
        if not moods or len(moods) < 1:
            return Response(
                {
                    "result": "More mood data is needed for analysis (at least one record). "
                },
                status=status.HTTP_200_OK,
            )
        mood_lines = []
        for m in moods:
            tag = getattr(m, "mood_tag", None) or ""
            cause = getattr(m, "mood_cause", None) or ""
            time = getattr(m, "timestamp", None)
            date_str = time.strftime("%Y-%m-%d") if time else ""
            mood_lines.append(f"{date_str}: {tag} ({cause})")
        mood_text = "\n".join(reversed(mood_lines))
        prompt = f"User's last {len(moods)} mood entries:\n{mood_text}\nPlease summarize the recent mood trends in English and give 2 supportive suggestions."
        result = ai_service(prompt)
        return Response({"result": result})


class AIFitness(APIView):
    def post(self, request):
        user_id = request.data.get("user_id") or request.query_params.get("user_id")

        qs = FitnessRecord.objects.all()
        if user_id:
            qs = qs.filter(user__user_id=user_id)

        records = qs.order_by("-created_at")[:7]

        if not records:
            return Response(
                {"result": "More fitness data is needed (at least 1 record)."},
                status=200,
            )

        lines = []
        for r in records:
            date = r.created_at.strftime("%Y-%m-%d") if r.created_at else ""
            activity = r.activity_type or "Unknown"
            duration = r.duration_minutes or 0
            lines.append(f"{date}: {activity}, {duration} minutes")

        text = "\n".join(reversed(lines))

        prompt = (
            f"User's recent fitness activity:\n{text}\n"
            f"Give a friendly summary in English and suggest 2 improvements or next steps."
        )

        result = ai_service(prompt)
        return Response({"result": result})
