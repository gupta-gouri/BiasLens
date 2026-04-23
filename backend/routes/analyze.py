from fastapi import APIRouter, HTTPException
from services.preprocessing_service import run_preprocessing_pipeline
from services.bias_detector import run_bias_detection
from services.bias_detector_llm import run_bias_detection_llm
from services.argument_extraction import run_argument_extraction
from services.cognitive_firewall_service import run_cognitive_firewall

router = APIRouter()


@router.post("/analyze-decision")
def analyze_decision(data: dict):
    decision_text = data.get("decision_text")

    if not decision_text:
        raise HTTPException(status_code=400, detail="decision_text is required")

    try:
        preprocessing_output = run_preprocessing_pipeline(decision_text)

        heuristic_output = run_bias_detection(preprocessing_output)

        llm_output = run_bias_detection_llm(
            original_text=decision_text,
            preprocessing_output=preprocessing_output,
            heuristic_output=heuristic_output
        )

        argument_extraction = run_argument_extraction(
            original_text=decision_text,
            preprocessing_output=preprocessing_output,
            heuristic_output=heuristic_output,
            llm_bias_output=llm_output
        )

        agent_input = {
            "decision_text": decision_text,
            "preprocessing_output": preprocessing_output,
            "heuristic_bias_analysis": heuristic_output,
            "llm_bias_analysis": llm_output,
            "argument_extraction": argument_extraction
        }

        cognitive_firewall_output = run_cognitive_firewall(agent_input)

        print("\n--- Preprocessing ---")
        print(preprocessing_output)

        print("\n--- Heuristic Bias ---")
        print(heuristic_output)

        print("\n--- LLM Bias ---")
        print(llm_output)

        print("\n--- Argument Extraction ---")
        print(argument_extraction)

        print("\n--- Cognitive Firewall ---")
        print(cognitive_firewall_output)

        return {
            "status": "success",
            "original_input": decision_text,
            "preprocessing": preprocessing_output,
            "heuristic_bias_analysis": heuristic_output,
            "llm_bias_analysis": llm_output,
            "argument_extraction": argument_extraction,
            "cognitive_firewall": cognitive_firewall_output
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))