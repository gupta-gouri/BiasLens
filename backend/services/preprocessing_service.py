import re

def contains_phrase(text, phrase):
    pattern = r"\b" + re.escape(phrase) + r"\b"
    return re.search(pattern, text) is not None

def normalize_repeated_chars(text):
    # safer than collapsing to one
    return re.sub(r'([a-z])\1{2,}', r'\1\1', text)

def clean_text(text):
    text = text.strip()
    text = text.lower()
    text = re.sub(r"\s+", " ", text)

    text = re.sub(r"!{2,}", "!", text)
    text = re.sub(r"\?{2,}", "?", text)
    text = re.sub(r"\.{2,}", ".", text)

    text = normalize_repeated_chars(text)
    return text

def segment_text(text):
    segments = []

    if "because" in text:
        parts = text.split("because", 1)
        segments.append({
            "type": "decision_claim",
            "text": parts[0].strip()
        })
        segments.append({
            "type": "supporting_reason",
            "text": parts[1].strip()
        })
    else:
        segments.append({
            "type": "decision_claim",
            "text": text
        })

    return segments

DOMAIN_MAP = {
    "career": ["job", "career", "salary", "industry", "placement", "internship"],
    "education": ["study", "college", "degree", "branch", "course"],
    "health": ["diet", "exercise", "sleep", "doctor"],
    "money": ["investment", "loan", "saving", "stock"],
    "relationships": ["friend", "partner", "family", "relationship"]
}

def detect_domain(text):
    for domain, keywords in DOMAIN_MAP.items():
        for word in keywords:
            if contains_phrase(text, word):
                return domain
    return "general"

CERTAINTY_MARKERS = [
    "always", "never", "everyone", "no future",
    "best", "worst", "definitely", "useless"
]

def detect_certainty_markers(text):
    return [m for m in CERTAINTY_MARKERS if contains_phrase(text, m)]

SOCIAL_MARKERS = [
    "everyone says", "my senior told me",
    "friends suggested", "people recommend",
    "most students choose"
]

def detect_social_markers(text):
    return [m for m in SOCIAL_MARKERS if contains_phrase(text, m)]

def detect_emotion_level(text):
    strong = ["never", "worst", "useless", "no future"]
    medium = ["better", "good", "should"]

    for w in strong:
        if contains_phrase(text, w):
            return "high"
    for w in medium:
        if contains_phrase(text, w):
            return "medium"
    return "low"

def calculate_certainty_score(markers):
    return min(len(markers) * 0.2, 1.0)

def run_preprocessing_pipeline(text):
    cleaned = clean_text(text)
    segments = segment_text(cleaned)
    domain = detect_domain(cleaned)
    certainty = detect_certainty_markers(cleaned)
    social = detect_social_markers(cleaned)
    emotion = detect_emotion_level(cleaned)
    score = calculate_certainty_score(certainty)

    return {
        "normalized_text": cleaned,
        "domain": domain,
        "segments": segments,
        "certainty_markers": certainty,
        "social_markers": social,
        "emotion_level": emotion,
        "certainty_score": score
    }