from google import genai
from django.conf import settings

def ai_service(prompt):
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        res = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt]
        )

        print("Gemini response:", res.text)
        return res.text

    except Exception as e:
        print("Gemini Error:", e)
        return f"Error: {e}"
