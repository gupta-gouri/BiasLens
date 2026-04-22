import os
import json
import time  
import traceback
import google.generativeai as genai
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

# --- SETUP ---
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
app = FastAPI()
model = genai.GenerativeModel('gemini-2.5-flash')

class DecisionInput(BaseModel):
    user_id: str
    decision_text: str
    domain: str

# --- HELPER FUNCTION: THE JSON CLEANER ---
def clean_and_parse_json(text_response):
    """Strips Markdown backticks if Gemini accidentally includes them."""
    cleaned = text_response.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return json.loads(cleaned.strip())

# --- THE HEURISTIC ---
def get_heuristic_biases(text: str):
    return {
        "confirmation_bias": 0.74,
        "anchoring_bias": 0.62,
        "social_influence_bias": 0.85,
        "availability_bias": 0.50
    }

# --- THE PROMPTS ---
ARGUMENT_MINER_PROMPT = """
You are the Argument Mining Engine for BiasLens. 
Analyze the user's decision and deconstruct their logic.
Return a JSON object with EXACTLY these keys:
- "main_claim" (string)
- "supporting_reason" (string)
- "hidden_assumptions" (a list of 3 strings)
User Decision: {decision_text}
"""

DEVILS_ADVOCATE_PROMPT = """
You are the Devil's Advocate for BiasLens. 
Aggressively challenge their hidden assumptions.
Return a JSON object with one key "counterpoints" containing a list of 3 strings.
User Decision: {decision_text}
Logical Structure: {argument_structure}
"""

STATISTICIAN_PROMPT = """
You are the Statistician for BiasLens. 
Analyze solely based on data, evidence, and statistical probability.
Return a JSON object with one key "data_critique" containing a list of 2 strings.
User Decision: {decision_text}
Logical Structure: {argument_structure}
"""

NEUTRAL_JUDGE_PROMPT = """
You are the Neutral Judge for BiasLens. 
Synthesize a final, balanced, and evidence-aware version of their decision.
Return a JSON object with one key "balanced_decision" containing a single string.
User Decision: {decision_text}
Devil's Advocate said: {devils_output}
Statistician said: {stat_output}
"""

# --- THE API PIPELINE ---
@app.post("/analyze-decision")
async def analyze_decision(data: DecisionInput):
    user_text = data.decision_text
    
    try:
        bias_scores = get_heuristic_biases(user_text)
        
        print("1. Running Argument Miner...")
        miner_response = model.generate_content(
            ARGUMENT_MINER_PROMPT.format(decision_text=user_text),
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        miner_data = clean_and_parse_json(miner_response.text)
        miner_string = json.dumps(miner_data)

        time.sleep(2) # Speed limit pause

        print("2. Running Devil's Advocate...")
        devils_response = model.generate_content(
            DEVILS_ADVOCATE_PROMPT.format(decision_text=user_text, argument_structure=miner_string),
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        devils_data = clean_and_parse_json(devils_response.text)
        
        time.sleep(2) # Speed limit pause
        
        print("3. Running Statistician...")
        stat_response = model.generate_content(
            STATISTICIAN_PROMPT.format(decision_text=user_text, argument_structure=miner_string),
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        stat_data = clean_and_parse_json(stat_response.text)
        
        time.sleep(2) # Speed limit pause
        
        print("4. Running Neutral Judge...")
        judge_response = model.generate_content(
            NEUTRAL_JUDGE_PROMPT.format(
                decision_text=user_text,
                devils_output=json.dumps(devils_data),
                stat_output=json.dumps(stat_data)
            ),
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        judge_data = clean_and_parse_json(judge_response.text)
        
        print("SUCCESS! Sending data to UI...")
        return {
            "status": "success",
            "original_text": user_text,
            "heuristic_bias_scores": bias_scores,
            "argument_breakdown": miner_data,
            "agents": {
                "devils_advocate": devils_data["counterpoints"],
                "statistician": stat_data["data_critique"],
                "neutral_judge": judge_data["balanced_decision"]
            }
        }
        
    except Exception as e:
        print("\n=== API ERROR CAUGHT ===")
        print(traceback.format_exc()) 
        return {"status": "error", "message": "An error occurred. Check the backend terminal."}