import re
from typing import Dict, List, Tuple
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

sentiment_analyzer = SentimentIntensityAnalyzer()


class BiasHeuristicDetector:
    """
    Rule-based heuristic detector for early-stage bias signal extraction.

    This is not a final cognitive-bias classifier.
    It produces explainable heuristic signals that can later be passed to:
    1. rule-book logic
    2. LLM verification / refinement
    """

    def __init__(self):
        # ---------------- PATTERN GROUPS ---------------- #

        # Social influence / herd language
        self.social_patterns = {
            r"\beveryone\s+(says|is saying|thinks)\b": 0.35,
            r"\bpeople\s+(say|are saying|think|believe)\b": 0.30,
            r"\bmost people\b": 0.25,
            r"\bmany people\b": 0.20,
            r"\bi have heard\b": 0.20,
            r"\bi've heard\b": 0.20,
            r"\bi heard\b": 0.15,
            r"\baccording to (experts|people|my teacher|friends)\b": 0.30,
            r"\bmy senior told me\b": 0.35,
            r"\bfriends suggested\b": 0.25,
            r"\bpeople recommend\b": 0.20,
            r"\bmost students (choose|are choosing|chose)\b": 0.35,
            r"\beveryone around me\b": 0.35,
            r"\bpeople around me\b": 0.25,
            r"\ball my friends\b": 0.25,
            r"\bothers are choosing\b": 0.20,
            r"\beveryone is choosing\b": 0.35,
        }

        # Confirmation bias / selective certainty / already-decided language
        self.confirmation_patterns = {
            r"\bthis proves\b": 0.35,
            r"\bthis confirms\b": 0.35,
            r"\bi was right\b": 0.30,
            r"\bi already believed\b": 0.35,
            r"\bi already knew\b": 0.30,
            r"\bobviously\b": 0.20,
            r"\bclearly\b": 0.20,
            r"\bi am sure\b": 0.25,
            r"\bi know for sure\b": 0.30,
            r"\bdefinitely\b": 0.20,
            r"\bthis shows i was right\b": 0.35,
        }

        # Anchoring bias / first-impression persistence
        self.anchoring_patterns = {
            r"\bfirst (i heard|i thought|impression)\b": 0.35,
            r"\bmy first impression\b": 0.35,
            r"\binitially\b": 0.20,
            r"\bfrom the beginning\b": 0.25,
            r"\bat first\b": 0.25,
            r"\bstill think\b": 0.25,
            r"\bhaven't changed\b": 0.30,
            r"\bsince the beginning\b": 0.25,
            r"\bsince day one\b": 0.30,
            r"\bi still believe what i first thought\b": 0.40,
        }

        # Availability bias / anecdotal, vivid, one-example reasoning
        self.availability_patterns = {
            r"\bi saw\b": 0.20,
            r"\bi know someone\b": 0.30,
            r"\bi heard about\b": 0.20,
            r"\bonce i\b": 0.25,
            r"\bthis happened once\b": 0.35,
            r"\bmy friend\b": 0.20,
            r"\bbased on one\b": 0.35,
            r"\bone example\b": 0.35,
            r"\bone case\b": 0.30,
            r"\bi had one experience\b": 0.30,
            r"\bmy friend failed\b": 0.30,
            r"\bonce so i think\b": 0.30,
            r"\bso i think it is a bad field\b": 0.20,
        }

        # Absolutist / black-and-white / exaggerated certainty signals
        # These are NOT directly treated as availability bias.
        # They act as amplifiers / supporting evidence.
        self.absolute_patterns = {
            r"\balways\b": 0.15,
            r"\bnever\b": 0.20,
            r"\bno future\b": 0.30,
            r"\beveryone\b": 0.15,
            r"\bnothing works\b": 0.30,
            r"\beverything fails\b": 0.30,
            r"\bbest\b": 0.15,
            r"\bworst\b": 0.20,
            r"\bonly option\b": 0.25,
            r"\bno other choice\b": 0.30,
            r"\bthe right choice\b": 0.15,
        }

        # Balance / nuance markers
        # IMPORTANT: "maybe" removed because it often means uncertainty, not balance.
        self.balance_markers = [
            "but",
            "however",
            "although",
            "on the other hand",
            "at the same time",
            "it depends",
        ]

        # Extra certainty markers
        self.certainty_markers = [
            "definitely",
            "clearly",
            "for sure",
            "certainly",
            "obviously",
            "i am sure",
            "i know for sure",
        ]

        # Soft social decision phrases
        self.social_action_markers = [
            "should also go for it",
            "should too",
            "so i should",
            "i should also",
            "i should go for it",
        ]

    # ---------------- UTILS ---------------- #

    def match_weighted_patterns(
        self, pattern_dict: Dict[str, float], text: str
    ) -> Tuple[List[str], float]:
        hits = []
        total_score = 0.0

        for pattern, weight in pattern_dict.items():
            if re.search(pattern, text, flags=re.IGNORECASE):
                hits.append(pattern)
                total_score += weight

        return hits, total_score

    def has_any_phrase(self, phrases: List[str], text: str) -> bool:
        text_lower = text.lower()
        return any(p in text_lower for p in phrases)

    def clamp_scores(self, scores: Dict[str, float]) -> Dict[str, float]:
        for key in scores:
            scores[key] = max(0.0, min(1.0, round(scores[key], 2)))
        return scores

    # ---------------- MAIN ANALYSIS ---------------- #

    def analyze(self, text: str) -> Dict:
        if not text or not text.strip():
            return {
                "bias_scores": {
                    "confirmation_bias": 0.0,
                    "anchoring_bias": 0.0,
                    "social_influence_bias": 0.0,
                    "availability_bias": 0.0,
                },
                "bias_predictions": [],
                "sentiment": sentiment_analyzer.polarity_scores(""),
                "meta_signals": {
                    "absolute_language_score": 0.0,
                    "balance_present": False,
                    "certainty_present": False,
                },
            }

        text_lower = text.lower().strip()

        scores = {
            "confirmation_bias": 0.0,
            "anchoring_bias": 0.0,
            "social_influence_bias": 0.0,
            "availability_bias": 0.0,
        }

        triggers = {
            "confirmation_bias": [],
            "anchoring_bias": [],
            "social_influence_bias": [],
            "availability_bias": [],
        }

        # ---------------- PATTERN MATCHES ---------------- #

        social_hits, social_score = self.match_weighted_patterns(self.social_patterns, text_lower)
        confirm_hits, confirm_score = self.match_weighted_patterns(self.confirmation_patterns, text_lower)
        anchor_hits, anchor_score = self.match_weighted_patterns(self.anchoring_patterns, text_lower)
        avail_hits, avail_score = self.match_weighted_patterns(self.availability_patterns, text_lower)
        absolute_hits, absolute_score = self.match_weighted_patterns(self.absolute_patterns, text_lower)

        # Base scoring
        scores["social_influence_bias"] += social_score
        scores["confirmation_bias"] += confirm_score
        scores["anchoring_bias"] += anchor_score
        scores["availability_bias"] += avail_score

        triggers["social_influence_bias"].extend(social_hits)
        triggers["confirmation_bias"].extend(confirm_hits)
        triggers["anchoring_bias"].extend(anchor_hits)
        triggers["availability_bias"].extend(avail_hits)

        # ---------------- STRUCTURAL RULES ---------------- #

        # "because" only supports bias if paired with other evidence
        if "because" in text_lower:
            if confirm_hits or absolute_hits:
                scores["confirmation_bias"] += 0.08
                triggers["confirmation_bias"].append("because + certainty/absolute framing")

            if social_hits:
                scores["social_influence_bias"] += 0.05
                triggers["social_influence_bias"].append("because + social justification")

        # Strong anchoring structure
        if "first" in text_lower and "still" in text_lower:
            scores["anchoring_bias"] += 0.20
            triggers["anchoring_bias"].append("first + still")

        if ("initially" in text_lower or "at first" in text_lower) and (
            "still" in text_lower or "haven't changed" in text_lower
        ):
            scores["anchoring_bias"] += 0.20
            triggers["anchoring_bias"].append("initial position retained")

        # ---------------- SOCIAL DECISION LOGIC ---------------- #

        if self.has_any_phrase(self.social_action_markers, text_lower):
            if social_hits:
                scores["social_influence_bias"] += 0.22
                triggers["social_influence_bias"].append("social signal + follow-the-group decision")
            else:
                scores["social_influence_bias"] += 0.15
                triggers["social_influence_bias"].append("follow-the-group decision language")

        # ---------------- ABSOLUTE LANGUAGE AS AMPLIFIER ---------------- #

        if absolute_hits:
            if social_hits:
                scores["social_influence_bias"] += min(0.25, absolute_score * 0.5)
                triggers["social_influence_bias"].append("absolute language + social signal")

            if confirm_hits:
                scores["confirmation_bias"] += min(0.20, absolute_score * 0.4)
                triggers["confirmation_bias"].append("absolute language + confirmation signal")

            if avail_hits:
                scores["availability_bias"] += min(0.15, absolute_score * 0.3)
                triggers["availability_bias"].append("absolute language + anecdotal signal")

            # Keep this weak so unsupported strong opinions do not become false confirmation too easily
            if not (social_hits or confirm_hits or anchor_hits or avail_hits):
                scores["confirmation_bias"] += min(0.10, absolute_score * 0.25)
                triggers["confirmation_bias"].append("absolute language only")

        # ---------------- SOCIAL COMBINATION RULES ---------------- #

        total_social_context = len(social_hits)
        if "should" in text_lower:
            total_social_context += 1

        if total_social_context >= 2:
            scores["social_influence_bias"] += 0.15
            triggers["social_influence_bias"].append("multiple social signals")

        # ---------------- SENTIMENT ---------------- #

        sentiment = sentiment_analyzer.polarity_scores(text)

        # Only boost already meaningful evidence, not tiny noise
        if abs(sentiment["compound"]) > 0.6:
            for bias in scores:
                if scores[bias] >= 0.25:
                    scores[bias] += 0.06
                    triggers[bias].append("strong sentiment")

        # ---------------- CERTAINTY BOOST ---------------- #

        certainty_present = self.has_any_phrase(self.certainty_markers, text_lower)
        if certainty_present:
            for bias in scores:
                if scores[bias] >= 0.20:
                    scores[bias] += 0.08
                    triggers[bias].append("certainty language")

        # ---------------- BALANCE REDUCTION ---------------- #

        balance_present = self.has_any_phrase(self.balance_markers, text_lower)
        if balance_present:
            for bias in scores:
                if scores[bias] > 0:
                    scores[bias] -= 0.10
                    triggers[bias].append("balance / nuance marker")

        # ---------------- NORMALIZATION ---------------- #

        scores = self.clamp_scores(scores)

        # ---------------- OUTPUT ---------------- #

        predictions = []
        threshold = 0.20

        for bias, score in scores.items():
            if score >= threshold:
                related_triggers = sorted(set(triggers[bias]))
                predictions.append(
                    {
                        "bias_type": bias,
                        "score": score,
                        "triggers": related_triggers,
                    }
                )

        predictions.sort(key=lambda x: x["score"], reverse=True)

        return {
            "bias_scores": scores,
            "bias_predictions": predictions,
            "sentiment": sentiment,
            "meta_signals": {
                "absolute_language_score": round(min(absolute_score, 1.0), 2),
                "balance_present": balance_present,
                "certainty_present": certainty_present,
            },
        }


def run_bias_detection(preprocessing_output):
    detector = BiasHeuristicDetector()
    normalized_text = preprocessing_output.get("normalized_text", "")
    return detector.analyze(normalized_text)


if __name__ == "__main__":
    detector = BiasHeuristicDetector()

    samples = [
        "everyone says AI is best and full stack has no future",
        "my senior told me data science is the only option",
        "at first I thought AI was better and I still think so",
        "my friend failed once so this proves the field is useless",
        "I chose this because it fits my interests and placement data looks good",
        "Most students are choosing AI so I should also go for it",
        "I feel like everyone around me is choosing AI so maybe I should too",
        "People say AI is good, but I will still decide based on my interests",
    ]

    for text in samples:
        print("\nINPUT:", text)
        result = detector.analyze(text)
        print(result)