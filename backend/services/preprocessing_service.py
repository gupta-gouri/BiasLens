import re


# -------------------------
# TEXT CLEANING FUNCTION
# -------------------------

def clean_text(text):

    text = text.strip()

    text = re.sub(r"\s+", " ", text)

    text = text.lower()

    text = re.sub(r"[!]{2,}", "!", text)

    return text


# -------------------------
# SENTENCE SEGMENTATION
# -------------------------

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


# -------------------------
# DOMAIN DETECTION
# -------------------------

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

            if word in text:

                return domain

    return "general"


# -------------------------
# CERTAINTY MARKER DETECTION
# -------------------------

CERTAINTY_MARKERS = [
    "always",
    "never",
    "everyone",
    "no future",
    "best",
    "worst",
    "definitely",
    "useless"
]


def detect_certainty_markers(text):

    markers = []

    for marker in CERTAINTY_MARKERS:

        if marker in text:

            markers.append(marker)

    return markers


# -------------------------
# SOCIAL MARKER DETECTION
# -------------------------

SOCIAL_MARKERS = [
    "everyone says",
    "my senior told me",
    "friends suggested",
    "people recommend",
    "most students choose"
]


def detect_social_markers(text):

    markers = []

    for marker in SOCIAL_MARKERS:

        if marker in text:

            markers.append(marker)

    return markers


# -------------------------
# EMOTION LEVEL DETECTION
# -------------------------

def detect_emotion_level(text):

    strong_words = [
        "never",
        "worst",
        "useless",
        "no future"
    ]

    medium_words = [
        "better",
        "good",
        "should"
    ]

    for word in strong_words:

        if word in text:

            return "high"

    for word in medium_words:

        if word in text:

            return "medium"

    return "low"


# -------------------------
# CERTAINTY SCORE
# -------------------------

def calculate_certainty_score(certainty_markers):

    return min(len(certainty_markers) * 0.2, 1.0)


# -------------------------
# MAIN PIPELINE FUNCTION
# -------------------------

def run_preprocessing_pipeline(text):

    cleaned = clean_text(text)

    segments = segment_text(cleaned)

    domain = detect_domain(cleaned)

    certainty = detect_certainty_markers(cleaned)

    social = detect_social_markers(cleaned)

    emotion = detect_emotion_level(cleaned)

    certainty_score = calculate_certainty_score(certainty)

    return {

        "normalized_text": cleaned,

        "domain": domain,

        "segments": segments,

        "certainty_markers": certainty,

        "social_markers": social,

        "emotion_level": emotion,

        "certainty_score": certainty_score
    }
