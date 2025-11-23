from google import genai
import os

def simple_test():
    try:
        client = genai.Client()
        res = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Hello from Django!"
        )
        print("Gemini response:", res.text)
        return res.text
    except Exception as e:
        print("Gemini Error:", e)
        return f"Error: {e}"
