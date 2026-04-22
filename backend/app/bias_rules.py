from app.llm_service import llm_bias_detection

import re

# Bias rules dictionary
jls_extract_var = r"never"
bias_rules = {
    "social_influence_bias": [
    r"everyone says",
    r"people say",
    r"most people think",
    r"others believe",
    r"experts say",
    r"researchers say",
    r"professionals say",
    r"according to experts",
    r"according to my teacher",
    r"my mentor said",
    r"my friends say",
    r"my parents say",
    r"my classmates chose",
    r"others are choosing",
    r"everyone is doing",
    r"most people are doing",
    r"this is trending",
    r"this is popular",
    r"this is the trend",
    r"i heard that",
    r"someone told me",
    r"i saw people saying",
    r"many people believe",
    r"a lot of people say",
    r"this is recommended by experts",
    r"since everyone is doing it",
    r"others are ahead",
    r"i will fall behind",
    r"i don't want to miss out",
    r"people prefer this"
    ],
    
    "overgeneralization_bias": [
    r"always",
    r"jls_extract_ear",
    r"everyone",
    r"no one",
    r"nothing works",
    r"everything fails",
    r"no future",
    r"completely useless",
    r"worst",
    r"best",
    r"i saw one person",
    r"i know someone who",
    r"this happened once",
    r"one time this happened",
    r"based on one example",
    r"this will replace everything",
    r"this is the future",
    r"this field is dying",
    r"everything will change",
    r"this always happens",
    r"this never works",
    r"only option",
    r"no other choice",
    r"what if it fails",
    r"this could go wrong",
    r"everything will go wrong",
    r"this applies everywhere",
    r"this happens all the time",
    r"nothing will work",
    r"this guarantees success"
    ],
    
    "confirmation_bias": [
    r"this proves",
    r"this confirms",
    r"i was right",
    r"i already believed",
    r"i always believed",
    r"i always thought",
    r"i knew it",
    r"as expected",
    r"obviously",
    r"clearly",
    r"this shows that",
    r"this means that",
    r"there is no doubt",
    r"i am sure",
    r"i know for sure",
    r"no need to consider",
    r"i don't care about",
    r"other options don't matter",
    r"this always works",
    r"this is always true",
    r"i feel this is right",
    r"that is wrong",
    r"that doesn't make sense",
    r"this supports my idea",
    r"this validates my thinking",
    r"i only need this",
    r"this is enough proof",
    r"nothing else matters",
    r"this is correct",
    r"this must be true"
    ],
    
    "anchoring_bias": [
    r"first i heard",
    r"initially i thought",
    r"from the beginning",
    r"my first impression",
    r"at first i thought",
    r"when i first learned",
    r"i initially believed",
    r"i still think",
    r"i still believe",
    r"i haven't changed my mind",
    r"i never changed my opinion",
    r"i decided early",
    r"since the start",
    r"from the start",
    r"i always stuck with this",
    r"nothing changed my mind",
    r"even now i think the same",
    r"i remember hearing",
    r"since long time",
    r"this is how it is",
    r"i believed this from the start",
    r"i went with my first idea",
    r"i trusted my first thought",
    r"my first idea was right",
    r"i didn't reconsider",
    r"i didn't rethink",
    r"i stayed with my first choice",
    r"i followed my initial thought",
    r"i didn't change my decision",
    r"i kept my original view"
    ]
}


def calculate_confidence(num_matches):
    base = 0.5
    return min(0.9, base + num_matches * 0.1)


def detect_bias(text):
    text = text.lower()
    results = []

    for bias_type, patterns in bias_rules.items():
        matches = []

        for pattern in patterns:
            found = re.findall(pattern, text)
            if found:
                matches.extend(found)

        if matches:
            results.append({
                "bias_type": bias_type,
                "trigger_text": matches,
                "confidence": calculate_confidence(len(matches))
            })

    return results


def overall_score(results):
    if not results:
        return 0
    return round(sum(r["confidence"] for r in results) / len(results), 2)


def analyze_text(text):
    bias_results = detect_bias(text)
    score = overall_score(bias_results)

    return {
        "bias_predictions": bias_results,
        "overall_bias_score": score
    }
def hybrid_bias_analysis(text):
    rule_based = analyze_text(text)
    llm_based = llm_bias_detection(text)

    return {
        "rule_based": rule_based,
        "llm_based": llm_based
    }