import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def clean_json(text):
    try:
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])
    except:
        return {"bias_predictions": []}


def llm_bias_detection(text):
    prompt = f"""
    Analyze the following decision statement and detect cognitive biases.

    Only choose from:
    - confirmation_bias
    - anchoring_bias
    - social_influence_bias
    - overgeneralization_bias

    Return JSON format:
    {{
      "bias_predictions": [
        {{
          "bias_type": "...",
          "score": 0-1,
          "reason": "..."
        }}
      ]
    }}

    Statement:
    "{text}"
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",   # ✅ updated model
        contents=prompt
    )

    return clean_json(response.text)