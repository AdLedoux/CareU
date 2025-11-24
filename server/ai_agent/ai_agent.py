from django.conf import settings

try:
    import google.generativeai as genai
except ImportError as exc:  # Allow project to start without the optional Gemini client installed
    genai = None
    _genai_import_error = exc

def ai_service(prompt):
    if genai is None:
        return f"Error: google-generativeai not installed ({_genai_import_error})."
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
