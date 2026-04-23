from fastapi import APIRouter
from services.preprocessing_service import run_preprocessing_pipeline
from services.bias_detector import run_bias_detection

router = APIRouter()

@router.post("/analyze-decision")
def analyze_decision(data: dict):

    decision_text = data.get("decision_text")

    if not decision_text:
        return {"error": "decision_text is required"}

    preprocessing_output = run_preprocessing_pipeline(decision_text)

    bias_output = run_bias_detection(preprocessing_output)

    print("\n--- Preprocessing ---")
    print(preprocessing_output)

    print("\n--- Bias Output ---")
    print(bias_output)

    return {
        "status": "success",
        "original_input": decision_text,
        "bias_analysis": bias_output
    }