from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json
import os

# Load environment variables from a .env file if it exists
# This handles the API key automatically!
load_dotenv()
load_dotenv("backend/.env") # Also check the backend folder just in case

# Initialize FastAPI App
app = FastAPI(
    title="BiasLens API",
    description="AI-powered logic lab analyzing decisions for cognitive biases.",
    version="1.0.0"
)

# Configure the Gemini API (Google DeepMind)
# The genai.Client() automatically picks up the GEMINI_API_KEY from the environment.
try:
    client = genai.Client()
except Exception as e:
    client = None
    print(f"Warning: Could not initialize Gemini Client. Make sure GEMINI_API_KEY is set. Error: {e}")

# --- 1. Request Models ---

class DecisionRequest(BaseModel):
    user_id: str
    decision_text: str
    domain: str

# --- 2. Heuristic Function ---

def get_heuristic_biases(text: str) -> dict:
    """
    Placeholder function for heuristic bias scoring.
    To be filled in later by the heuristic team.
    """
    return {
        "confirmation_bias": 0.85,
        "anchoring_bias": 0.42,
        "availability_heuristic": 0.60,
        "sunk_cost_fallacy": 0.15
    }

# --- Utility Function for LLM Calls ---

def call_llm_agent(prompt: str) -> dict:
    """
    Helper function to call the Gemini API and enforce JSON output.
    """
    if not client:
        raise HTTPException(status_code=500, detail="Gemini client not initialized. Check GEMINI_API_KEY.")
        
    try:
        response = client.models.generate_content(
            model='gemini-1.5-pro',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        return json.loads(response.text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="LLM Agent failed to return valid JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Agent Error: {str(e)}")

# --- 3. The API Endpoint & Pipeline ---

@app.post("/analyze-decision")
async def analyze_decision(request: DecisionRequest):
    try:
        # Check API Key
        if not os.environ.get("GEMINI_API_KEY"):
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable is not set.")

        # Heuristic Scores
        heuristic_scores = get_heuristic_biases(request.decision_text)

        # --- Step A: The Argument Miner ---
        prompt_A = f"""
        You are the 'Argument Miner' agent for BiasLens.
        Analyze the following user decision text and extract the core argument structure.
        
        Decision Text: "{request.decision_text}"
        
        Respond ONLY with a valid JSON object matching this exact schema:
        {{
            "main_claim": "string",
            "supporting_reason": "string",
            "hidden_assumptions": ["string", "string", "string"]
        }}
        Provide exactly 3 hidden assumptions.
        """
        step_a_output = call_llm_agent(prompt_A)

        # --- Step B: The Devil's Advocate ---
        prompt_B = f"""
        You are the 'Devil's Advocate' agent for BiasLens.
        Aggressively challenge the hidden assumptions provided by the Argument Miner.
        
        Decision Text: "{request.decision_text}"
        Argument Miner Output: {json.dumps(step_a_output)}
        
        Respond ONLY with a valid JSON object matching this exact schema:
        {{
            "counterpoints": ["string", "string", "string"]
        }}
        Provide exactly 3 counterpoints.
        """
        step_b_output = call_llm_agent(prompt_B)

        # --- Step C: The Statistician ---
        prompt_C = f"""
        You are 'The Statistician' agent for BiasLens.
        Critique the lack of data and evidence in the decision text, focusing on the extracted argument.
        
        Decision Text: "{request.decision_text}"
        Argument Miner Output: {json.dumps(step_a_output)}
        
        Respond ONLY with a valid JSON object matching this exact schema:
        {{
            "data_critiques": ["string", "string"]
        }}
        Provide exactly 2 data critiques.
        """
        step_c_output = call_llm_agent(prompt_C)

        # --- Step D: The Neutral Judge ---
        prompt_D = f"""
        You are 'The Neutral Judge' agent for BiasLens.
        Synthesize a balanced final decision considering the original text, the Devil's Advocate's counterpoints, and the Statistician's data critiques.
        
        Decision Text: "{request.decision_text}"
        Devil's Advocate Output: {json.dumps(step_b_output)}
        Statistician Output: {json.dumps(step_c_output)}
        
        Respond ONLY with a valid JSON object matching this exact schema:
        {{
            "balanced_decision": "string"
        }}
        """
        step_d_output = call_llm_agent(prompt_D)

        # --- 4. The Final Output ---
        return {
            "status": "success",
            "metadata": {
                "user_id": request.user_id,
                "domain": request.domain
            },
            "heuristic_scores": heuristic_scores,
            "analysis": {
                "step_A_argument_miner": step_a_output,
                "step_B_devils_advocate": step_b_output,
                "step_C_statistician": step_c_output,
                "step_D_neutral_judge": step_d_output
            }
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during analysis: {str(e)}")
