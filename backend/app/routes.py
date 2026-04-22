from fastapi import APIRouter
from app.bias_rules import hybrid_bias_analysis

router = APIRouter()

@router.post("/analyze")
def analyze(data: dict):
    text = data.get("decision_text", "")
    
    return hybrid_bias_analysis(text)