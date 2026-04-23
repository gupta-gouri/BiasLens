import json
import os
import time
from typing import Any, Dict

from google import genai


class BiasDetectorLLM:
    """
    Gemini-based bias reasoning layer.

    Purpose:
    - Takes original text + preprocessing output + heuristic bias output
    - Verifies/refines detected biases
    - Produces structured JSON for frontend / downstream agents
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
                "is_biased": {"type": "boolean"},
                "primary_bias": {
                    "type": "string",
                    "enum": [
                        "confirmation_bias",
                        "anchoring_bias",
                        "social_influence_bias",
                        "availability_bias",
                        "none"
                    ]
                },
                "secondary_biases": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "confirmation_bias",
                            "anchoring_bias",
                            "social_influence_bias",
                            "availability_bias"
                        ]
                    }
                },
                "llm_confidence": {"type": "number"},
                "heuristic_agreement": {
                    "type": "string",
                    "enum": ["high", "partial", "low", "none"]
                },
                "explanation": {"type": "string"},
                "evidence_phrases": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "risky_assumptions": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "debiased_reframe": {"type": "string"}
            },
            "required": [
                "status",
                "is_biased",
                "primary_bias",
                "secondary_biases",
                "llm_confidence",
                "heuristic_agreement",
                "explanation",
                "evidence_phrases",
                "risky_assumptions",
                "debiased_reframe"
            ]
        }

    def _fallback_response(self, reason: str, raw_output: str = "") -> Dict[str, Any]:
        return {
            "status": "fallback",
            "is_biased": False,
            "primary_bias": "none",
            "secondary_biases": [],
            "llm_confidence": 0.0,
            "heuristic_agreement": "none",
            "explanation": f"Gemini output could not be parsed or generated properly. Reason: {reason}",
            "evidence_phrases": [],
            "risky_assumptions": [],
            "debiased_reframe": "",
            "raw_output": raw_output
        }

    def _normalize_success_response(self, parsed: Dict[str, Any]) -> Dict[str, Any]:
        allowed_primary = {
            "confirmation_bias",
            "anchoring_bias",
            "social_influence_bias",
            "availability_bias",
            "none",
        }
        allowed_secondary = {
            "confirmation_bias",
            "anchoring_bias",
            "social_influence_bias",
            "availability_bias",
        }
        allowed_agreement = {"high", "partial", "low", "none"}

        primary_bias = parsed.get("primary_bias", "none")
        if primary_bias not in allowed_primary:
            primary_bias = "none"

        secondary_biases = parsed.get("secondary_biases", [])
        if not isinstance(secondary_biases, list):
            secondary_biases = []
        secondary_biases = [b for b in secondary_biases if b in allowed_secondary and b != primary_bias]

        llm_confidence = parsed.get("llm_confidence", 0.0)
        try:
            llm_confidence = float(llm_confidence)
        except Exception:
            llm_confidence = 0.0
        llm_confidence = max(0.0, min(1.0, round(llm_confidence, 2)))

        heuristic_agreement = parsed.get("heuristic_agreement", "none")
        if heuristic_agreement not in allowed_agreement:
            heuristic_agreement = "none"

        is_biased = bool(parsed.get("is_biased", False))
        if primary_bias == "none":
            is_biased = False

        return {
            "status": "success",
            "is_biased": is_biased,
            "primary_bias": primary_bias,
            "secondary_biases": secondary_biases,
            "llm_confidence": llm_confidence,
            "heuristic_agreement": heuristic_agreement,
            "explanation": str(parsed.get("explanation", "")).strip(),
            "evidence_phrases": parsed.get("evidence_phrases", []) if isinstance(parsed.get("evidence_phrases", []), list) else [],
            "risky_assumptions": parsed.get("risky_assumptions", []) if isinstance(parsed.get("risky_assumptions", []), list) else [],
            "debiased_reframe": str(parsed.get("debiased_reframe", "")).strip(),
        }

    def _build_system_instruction(self) -> str:
        return """
You are an expert cognitive-bias analysis assistant for a decision-support system.

Your job:
1. Read the user decision text.
2. Use the preprocessing output and heuristic bias analysis as supporting evidence.
3. Verify, refine, or reject the rule-based predictions.
4. Identify the PRIMARY bias, optional SECONDARY biases, and explain them clearly.
5. Do not blindly trust the heuristic detector.
6. Use the heuristic detector as a weak signal, not final truth.
7. Only classify a bias if the text actually supports it.
8. If no strong bias is present, say so.
9. Be careful not to over-classify.
10. Return the result in the required JSON structure only.

Important anti-overclassification rules:
- A simple opinion or preference alone is NOT enough to label a bias.
- Personal interests, goals, aptitude, or fit are valid reasons and are NOT confirmation bias by default.
- Only classify confirmation_bias if there is evidence of pre-existing belief, selective validation, or certainty that supports a prior stance.
- Only classify availability_bias if the reasoning relies on anecdote, one example, vivid remembered cases, or a single incident.
- Only classify social_influence_bias if the choice is being shaped by popularity, peers, group behavior, or "others are doing it" logic.
- Only classify anchoring_bias if the text shows dependence on an initial impression or early information that still drives the judgment.
- If evidence is weak or ambiguous, return is_biased=false and primary_bias="none".
""".strip()

    def _build_user_prompt(
        self,
        original_text: str,
        preprocessing_output: Dict[str, Any],
        heuristic_output: Dict[str, Any]
    ) -> str:
        payload = {
            "original_text": original_text,
            "preprocessing_output": preprocessing_output,
            "heuristic_output": heuristic_output,
        }

        return f"""
Analyze this decision text for cognitive bias using the structured evidence below.

INPUT DATA:
{json.dumps(payload, indent=2)}

Guidelines:
- Decide whether the text is biased.
- If biased, identify the strongest primary bias.
- Add secondary biases only if there is meaningful support.
- Use the heuristic output as supporting evidence, not final truth.
- Keep the explanation concise but clear.
- The debiased_reframe should rewrite the decision more neutrally and rationally.
- If the text is merely a preference or a neutral decision statement, mark it as not biased.
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
        preprocessing_output: Dict[str, Any],
        heuristic_output: Dict[str, Any]
    ) -> Dict[str, Any]:
        try:
            prompt = self._build_user_prompt(
                original_text=original_text,
                preprocessing_output=preprocessing_output,
                heuristic_output=heuristic_output,
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


def run_bias_detection_llm(
    original_text: str,
    preprocessing_output: Dict[str, Any],
    heuristic_output: Dict[str, Any]
) -> Dict[str, Any]:
    detector = BiasDetectorLLM()
    return detector.analyze(
        original_text=original_text,
        preprocessing_output=preprocessing_output,
        heuristic_output=heuristic_output,
    )


if __name__ == "__main__":
    sample_text = "everyone says AI is best and full stack has no future"

    sample_preprocessing_output = {
        "normalized_text": "everyone says ai is best and full stack has no future",
        "domain": "career",
        "segments": [
            {
                "type": "decision_claim",
                "text": "everyone says ai is best and full stack has no future"
            }
        ],
        "certainty_markers": ["best", "no future"],
        "social_markers": ["everyone says"],
        "emotion_level": "medium",
        "certainty_score": 0.4,
    }

    sample_heuristic_output = {
        "bias_scores": {
            "confirmation_bias": 0.1,
            "anchoring_bias": 0.0,
            "social_influence_bias": 0.55,
            "availability_bias": 0.0,
        },
        "bias_predictions": [
            {
                "bias_type": "social_influence_bias",
                "score": 0.55,
                "triggers": [
                    "everyone says",
                    "absolute language + social signal",
                ],
            }
        ],
        "sentiment": {
            "neg": 0.143,
            "neu": 0.584,
            "pos": 0.273,
            "compound": 0.4588,
        },
        "meta_signals": {
            "absolute_language_score": 0.6,
            "balance_present": False,
            "certainty_present": False,
        },
    }

    result = run_bias_detection_llm(
        original_text=sample_text,
        preprocessing_output=sample_preprocessing_output,
        heuristic_output=sample_heuristic_output,
    )

    print(json.dumps(result, indent=2))