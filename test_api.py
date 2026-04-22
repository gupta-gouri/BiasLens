import os
# Set a dummy key to bypass the initialization check
os.environ["GEMINI_API_KEY"] = "mock_key_for_testing"

from fastapi.testclient import TestClient
from main import app
import main

# Mock the LLM call to avoid actual API request during this structure test
def mock_call_llm_agent(prompt: str) -> dict:
    if "You are 'The Neutral Judge' agent" in prompt:
        return {
            "balanced_decision": "While microservices offer scalability, the lack of DevOps capacity and data on current bottlenecks suggests a modular monolith might be a better interim step."
        }
    elif "You are 'The Statistician' agent" in prompt:
        return {
            "data_critiques": ["No metrics provided on current monolith bottlenecks.", "No data on expected traffic scale."]
        }
    elif "You are the 'Devil's Advocate' agent" in prompt:
        return {
            "counterpoints": ["DevOps capacity is currently low.", "Network latency is a known issue.", "Team is only used to monoliths."]
        }
    else:
        return {
            "main_claim": "We should rewrite into microservices.",
            "supporting_reason": "It scales better.",
            "hidden_assumptions": ["We have the devops capacity.", "Network latency won't be an issue.", "Team understands microservices."]
        }

# Override the actual function in main for testing
main.call_llm_agent = mock_call_llm_agent

client = TestClient(app)

def test_analyze_decision():
    print("Sending POST request to /analyze-decision...")
    response = client.post(
        "/analyze-decision",
        json={
            "user_id": "test_user_123",
            "decision_text": "We should rewrite our monolith into microservices because it scales better.",
            "domain": "software_engineering"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print("\n[SUCCESS] API Test successful! Received valid JSON response:")
        import json
        print(json.dumps(data, indent=2))
    else:
        print(f"\n[ERROR] Test failed with status code {response.status_code}.")
        print("Response details:", response.text)

if __name__ == "__main__":
    test_analyze_decision()
