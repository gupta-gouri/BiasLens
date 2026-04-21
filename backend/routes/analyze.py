from fastapi import APIRouter
from services.preprocessing_service import run_preprocessing_pipeline


router = APIRouter()


@router.post("/analyze-decision")
def analyze_decision(data: dict):

    # Step 1: Extract decision text from request
    decision_text = data.get("decision_text")

    if not decision_text:
        return {
            "error": "decision_text is required"
        }

    # Step 2: Run preprocessing layer
    preprocessing_output = run_preprocessing_pipeline(decision_text)

    # Step 3: Return preprocessing results (temporary response)
    # Later this will pass into Bias Detection Engine
    return {
        "status": "success",
        "preprocessing_output": preprocessing_output
    }
