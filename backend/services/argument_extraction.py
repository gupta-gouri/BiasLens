import json
import os
import time
from typing import Any, Dict

from google import genai


class ArgumentExtractionLLM:
    """
    Gemini-based argument extraction layer.

    Purpose:
    - Takes original text + optional upstream analysis
    - Breaks the decision into facts, assumptions, and conclusion
    - Returns structured JSON for downstream reasoning
    """

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not set in environment variables.")

        self.client = genai.Client(api_key=self.api_key)

        self.response_schema = {
            "type": "object",
            "properties": {
                "status": {"type": "string", "enum": ["success"]},
                "facts": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "assumptions": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "conclusion": {
                    "type": "string"
                },
                "reasoning_summary": {
                    "type": "string"
                }
            },
            "required": [
                "status",
                "facts",
                "assumptions",
                "conclusion",
                "reasoning_summary"
            ]
        }

    def _fallback_response(self, reason: str, raw_output: str = "") -> Dict[str, Any]:
        return {
            "status": "fallback",
            "facts": [],
            "assumptions": [],
            "conclusion": "",
            "reasoning_summary": f"Gemini output could not be parsed or generated properly. Reason: {reason}",
            "raw_output": raw_output
        }

    def _normalize_success_response(self, parsed: Dict[str, Any]) -> Dict[str, Any]:
        facts = parsed.get("facts", [])
        assumptions = parsed.get("assumptions", [])

        if not isinstance(facts, list):
            facts = []
        if not isinstance(assumptions, list):
            assumptions = []

        facts = [str(x).strip() for x in facts if str(x).strip()]
        assumptions = [str(x).strip() for x in assumptions if str(x).strip()]

        conclusion = str(parsed.get("conclusion", "")).strip()
        reasoning_summary = str(parsed.get("reasoning_summary", "")).strip()

        return {
            "status": "success",
            "facts": facts,
            "assumptions": assumptions,
            "conclusion": conclusion,
            "reasoning_summary": reasoning_summary,
        }

    def _build_system_instruction(self) -> str:
        return """
You are an expert reasoning-structure extraction assistant.

Your job:
1. Read the user's decision text.
2. Break the reasoning into:
   - facts
   - assumptions
   - conclusion
3. Facts should only include:
   - directly stated observable events
   - self-reports about what the speaker heard, saw, or was told
   - explicitly stated decision actions
4. Assumptions should include:
   - unsupported beliefs
   - hidden premises
   - overgeneralizations
   - claims presented as true without evidence
5. Conclusion should be the final decision, judgment, or takeaway the user is reaching.
6. If a statement is an opinion or generalized claim without evidence, put it in assumptions, not facts.
7. Do not rewrite unsupported claims as facts.
8. Return only the required JSON structure.

Important:
- Be conservative with facts.
- Phrases like "AI is the best", "X has no future", "this is the only option" are usually assumptions unless clearly supported.
- Phrases like "everyone says...", "my friend told me...", "I heard..." can be facts only as reported speech, not as proof that the claim itself is true.
- Stay close to the user's wording.
""".strip()

    def _build_user_prompt(
        self,
        original_text: str,
        preprocessing_output: Dict[str, Any] | None = None,
        heuristic_output: Dict[str, Any] | None = None,
        llm_bias_output: Dict[str, Any] | None = None,
    ) -> str:
        payload = {
            "original_text": original_text,
            "preprocessing_output": preprocessing_output or {},
            "heuristic_output": heuristic_output or {},
            "llm_bias_output": llm_bias_output or {},
        }

        return f"""
Extract reasoning structure from the input.

Treat reported speech as a fact only in the form "the speaker says/heard/was told X", not as proof that X is true.

INPUT DATA:
{json.dumps(payload, indent=2)}

Guidelines:
- facts = only reported speech or explicitly stated observable events
- assumptions = unsupported premises, hidden beliefs, generalizations, or claims treated as true without evidence
- conclusion = the final decision or takeaway
- reasoning_summary = one short summary of how the reasoning flows
- Do not split a single reported statement into multiple facts unnecessarily
- If a statement is clearly an opinion without support, put it in assumptions
""".strip()

    def _call_gemini_with_retry(self, prompt: str):
        last_error = None

        for attempt in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config={
                        "system_instruction": self._build_system_instruction(),
                        "response_mime_type": "application/json",
                        "response_schema": self.response_schema,
                        "temperature": 0.1,
                    },
                )
                return response
            except Exception as e:
                last_error = e
                message = str(e)
                is_retryable = "503" in message or "UNAVAILABLE" in message or "429" in message
                if attempt < 2 and is_retryable:
                    time.sleep(1.5 * (attempt + 1))
                    continue
                raise last_error

    def analyze(
        self,
        original_text: str,
        preprocessing_output: Dict[str, Any] | None = None,
        heuristic_output: Dict[str, Any] | None = None,
        llm_bias_output: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:
        try:
            prompt = self._build_user_prompt(
                original_text=original_text,
                preprocessing_output=preprocessing_output,
                heuristic_output=heuristic_output,
                llm_bias_output=llm_bias_output,
            )

            response = self._call_gemini_with_retry(prompt)

            if not response or not getattr(response, "text", None):
                return self._fallback_response("Empty Gemini response")

            try:
                parsed = json.loads(response.text)
                return self._normalize_success_response(parsed)
            except json.JSONDecodeError:
                return self._fallback_response("Failed to parse Gemini JSON response", response.text)

        except Exception as e:
            return self._fallback_response(str(e))


def run_argument_extraction(
    original_text: str,
    preprocessing_output: Dict[str, Any] | None = None,
    heuristic_output: Dict[str, Any] | None = None,
    llm_bias_output: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    detector = ArgumentExtractionLLM()
    return detector.analyze(
        original_text=original_text,
        preprocessing_output=preprocessing_output,
        heuristic_output=heuristic_output,
        llm_bias_output=llm_bias_output,
    )


if __name__ == "__main__":
    sample_text = "Everyone says AI is the best and full stack has no future, so I am definitely choosing AI"

    result = run_argument_extraction(sample_text)

    print(json.dumps(result, indent=2))