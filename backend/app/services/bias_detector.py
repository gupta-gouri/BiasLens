# # ---------------- INSTALL (run once) ----------------
# # !pip install vaderSentiment
# # !python -m spacy download en_core_web_sm


# # ---------------- IMPORTS ----------------
# import spacy
# from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


# # ---------------- LOAD MODELS ----------------
# nlp = spacy.load("en_core_web_sm")
# sentiment_analyzer = SentimentIntensityAnalyzer()


# # ---------------- DETECTOR CLASS ----------------
# class BiasHeuristicDetector:

#     def __init__(self):

#         self.social_patterns = [
#             "everyone says",
#     "people say",
#     "most people think",
#     "others believe",
#     "experts say",
#     "researchers say",
#     "professionals say",
#     "according to experts",
#     "according to my teacher",
#     "my mentor said",
#     "my friends say",
#     "my parents say",
#     "my classmates chose",
#     "others are choosing",
#     "everyone is doing",
#     "most people are doing",
#     "this is trending",
#     "this is popular",
#     "this is the trend",
#     "i heard that",
#     "someone told me",
#     "i saw people saying",
#     "many people believe",
#     "a lot of people say",
#     "this is recommended by experts",
#     "since everyone is doing it",
#     "others are ahead",
#     "i will fall behind",
#     "i don't want to miss out",
#     "people prefer this","people like this",
#     "this is the best choice according to many", 
#     "I heard this is the best choice", 
#     "I have heard this is the most popular", 
#     "this is the most popular choice",
#     "this is what everyone is doing",
#     "I have heard"
#         ]

#         self.confirmation_patterns = [
#             "this proves",
#     "this confirms",
#     "i was right",
#     "i already believed",
#     "i always believed",
#     "i always thought",
#     "i knew it",
#     "as expected",
#     "obviously",
#     "clearly",
#     "this shows that",
#     "this means that",
#     "there is no doubt",
#     "i am sure",
#     "i know for sure",
#     "no need to consider",
#     "i don't care about",
#     "other options don't matter",
#     "this always works",
#     "this is always true",
#     "i feel this is right",
#     "that is wrong",
#     "that doesn't make sense",
#     "this supports my idea",
#     "this validates my thinking",
#     "i only need this",
#     "this is enough proof",
#     "nothing else matters",
#     "this is correct",
#     "this must be true"
#         ]

#         self.anchoring_patterns = [
#            "first i heard",
#     "initially i thought",
#     "from the beginning",
#     "my first impression",
#     "at first i thought",
#     "when i first learned",
#     "i initially believed",
#     "i still think",
#     "i still believe",
#     "i haven't changed my mind",
#     "i never changed my opinion",
#     "i decided early",
#     "since the start",
#     "from the start",
#     "i always stuck with this",
#     "nothing changed my mind",
#     "even now i think the same",
#     "i remember hearing",
#     "since long time",
#     "this is how it is",
#     "i believed this from the start",
#     "i went with my first idea",
#     "i trusted my first thought",
#     "my first idea was right",
#     "i didn't reconsider",
#     "i didn't rethink",
#     "i stayed with my first choice",
#     "i followed my initial thought",
#     "i didn't change my decision",
#     "i kept my original view"
#         ]

#         self.absolute_patterns = [
#            "always",
#     "never",
#     "everyone",
#     "no one",
#     "nothing works",
#     "everything fails",
#     "no future",
#     "completely useless",
#     "worst",
#     "best",
#     "i saw one person",
#     "i know someone who",
#     "this happened once",
#     "one time this happened",
#     "based on one example",
#     "this will replace everything",
#     "this is the future",
#     "this field is dying",
#     "everything will change",
#     "this always happens",
#     "this never works",
#     "only option",
#     "no other choice",
#     "what if it fails",
#     "this could go wrong",
#     "everything will go wrong",
#     "this applies everywhere",
#     "this happens all the time",
#     "nothing will work",
#     "this guarantees success"
#         ]

#         self.anecdotal_patterns = [
#             "i saw one", "i saw someone", "i saw this happen",
#     "i know someone", "i know a person", "i know a guy",
#     "this happened once", "this happened to me",
#     "once i experienced", "i experienced this",
#     "i heard about someone", "i heard a story",
#     "my friend faced this", "my friend told me",
#     "my cousin experienced", "someone i know",
#     "one example is", "there was this one case",
#     "i remember one time", "i recall one situation",
#     "i read one post", "i saw one video",
#     "i watched a video", "i saw on youtube",
#     "i read online", "i saw a tweet",
#     "based on one experience", "from my experience",
#     "in my case", "personally i saw"
#         ]

#         self.balance_markers = ["but", "however", "although"]
#         self.certainty_markers = ["definitely", "clearly", "for sure"]

#     # ---------------- MAIN FUNCTION ----------------
#     def analyze(self, text):

#         text_lower = text.lower()

#         scores = {
#             "confirmation_bias": 0.0,
#             "anchoring_bias": 0.0,
#             "social_influence_bias": 0.0,
#             "availability_bias": 0.0
#         }

#         triggers = []

#         # -------- BASIC PATTERNS --------
#         for p in self.social_patterns:
#             if p in text_lower:
#                 scores["social_influence_bias"] += 0.4
#                 triggers.append(("social_influence_bias", p))

#         for p in self.confirmation_patterns:
#             if p in text_lower:
#                 scores["confirmation_bias"] += 0.4
#                 triggers.append(("confirmation_bias", p))

#         for p in self.anchoring_patterns:
#             if p in text_lower:
#                 scores["anchoring_bias"] += 0.4
#                 triggers.append(("anchoring_bias", p))

#         for p in self.absolute_patterns:
#             if p in text_lower:
#                 scores["availability_bias"] += 0.5
#                 triggers.append(("availability_bias", p))

#         for p in self.anecdotal_patterns:
#             if p in text_lower:
#                 scores["availability_bias"] += 0.4
#                 triggers.append(("availability_bias", p))

#         # -------- STRUCTURAL RULES --------
#         if "because" in text_lower and not any(w in text_lower for w in self.balance_markers):
#             scores["confirmation_bias"] += 0.3
#             triggers.append(("confirmation_bias", "one-sided reasoning"))

#         if "first" in text_lower and "still" in text_lower:
#             scores["anchoring_bias"] += 0.5
#             triggers.append(("anchoring_bias", "first belief persistence"))

#         if "because" in text_lower and any(a in text_lower for a in self.absolute_patterns):
#             scores["availability_bias"] += 0.3
#             triggers.append(("availability_bias", "cause-effect exaggeration"))

#         # -------- COMBINATION RULES --------
#         if any(s in text_lower for s in self.social_patterns) and any(a in text_lower for a in self.absolute_patterns):
#             scores["social_influence_bias"] += 0.3
#             scores["availability_bias"] += 0.3
#             triggers.append(("social_influence_bias", "social + absolute"))
#             triggers.append(("availability_bias", "social + absolute"))

#         if any(s in text_lower for s in self.social_patterns) and "should" in text_lower:
#             scores["social_influence_bias"] += 0.3
#             triggers.append(("social_influence_bias", "social + decision language"))

#         if any(w in text_lower for w in ["i saw", "i heard"]) and any(a in text_lower for a in self.absolute_patterns):
#             scores["availability_bias"] += 0.4
#             triggers.append(("availability_bias", "weak evidence + strong claim"))
            
#         social_count = sum(1 for s in self.social_patterns if s in text_lower)

#         if social_count >= 2:
#             scores["social_influence_bias"] += 0.3
#             triggers.append(("social_influence_bias", f"{social_count} social signals"))

#         confirmation_count = sum(1 for c in self.confirmation_patterns if c in text_lower)
#         if confirmation_count >= 2:
#             scores["confirmation_bias"] += 0.3
            
#         availability_count = sum(1 for a in self.absolute_patterns if a in text_lower)
#         if availability_count >= 2:
#             scores["availability_bias"] += 0.3
            
#         anchoring_count = sum(1 for a in self.anchoring_patterns if a in text_lower)
#         if anchoring_count >= 2:
#                 scores["anchoring_bias"] += 0.3
        
#         # -------- SENTIMENT --------
#         sentiment = sentiment_analyzer.polarity_scores(text)

#         if abs(sentiment["compound"]) > 0.6:
#             for k in scores:
#                 scores[k] += 0.1

#         # -------- CERTAINTY --------
#         if any(w in text_lower for w in self.certainty_markers):
#             for k in scores:
#                 scores[k] += 0.1

#         # -------- BALANCE REDUCTION --------
#         if any(w in text_lower for w in self.balance_markers):
#             for k in scores:
#                 scores[k] -= 0.2

#         # -------- NORMALIZE --------
#         for k in scores:
#             scores[k] = max(0.0, min(1.0, scores[k]))

#         # -------- OUTPUT --------
#         predictions = []

#         for bias, score in scores.items():
#             if score > 0.25:
#                 related_triggers = [t for b, t in triggers if b == bias]
#                 predictions.append({
#                     "bias_type": bias,
#                     "score": round(score, 2),
#                     "triggers": list(set(related_triggers))
#                 })

#         return {
#             "bias_scores": scores,
#             "bias_predictions": predictions,
#             "sentiment": sentiment
#         }


# def pretty_print_result(result):

#     print("\n=== BIAS SCORES ===")
#     for k, v in result["bias_scores"].items():
#         print(f"{k}: {v}")

#     print("\n=== BIAS PREDICTIONS ===")
#     for b in result["bias_predictions"]:
#         print(f"\nBias: {b['bias_type']}")
#         print(f"Score: {b['score']}")
#         print("Triggers:")
#         for t in b["triggers"]:
#             print(f" - {t}")

#     print("\n=== SENTIMENT ===")
#     for k, v in result["sentiment"].items():
#         print(f"{k}: {v}")
        
        
# detector = BiasHeuristicDetector()

# text = "people say and i have heard cpp is more important for basics but data science needs python."

# result = detector.analyze(text)

# pretty_print_result(result)





# ---------------- INSTALL (run once) ----------------
# pip install vaderSentiment
# python -m spacy download en_core_web_sm


# ---------------- IMPORTS ----------------
import re
import spacy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

nlp = spacy.load("en_core_web_sm")
sentiment_analyzer = SentimentIntensityAnalyzer()


class BiasHeuristicDetector:

    def __init__(self):

        # -------- BASE PATTERNS -------- #

        self.social_patterns = [
            r"everyone (says|is saying|thinks)",
            r"people (say|are saying|think|believe)",
            r"most people",
            r"many people",
            r"i have heard",
            r"i've heard",
            r"i heard",
            r"according to (experts|people|my teacher|friends)",
        ]

        self.confirmation_patterns = [
            r"this proves",
            r"this confirms",
            r"i was right",
            r"i already believed",
            r"obviously",
            r"clearly",
            r"i am sure",
            r"i know for sure"
        ]

        self.anchoring_patterns = [
            r"first (i heard|i thought|impression)",
            r"initially",
            r"from the beginning",
            r"at first",
            r"still think",
            r"haven't changed"
        ]

        self.absolute_patterns = [
            r"always",
            r"never",
            r"no future",
            r"everyone",
            r"nothing works",
            r"everything fails",
            r"best",
            r"worst",
            r"only option",
            r"no other choice"
        ]

        self.anecdotal_patterns = [
            r"i saw",
            r"i know someone",
            r"i heard about",
            r"once i",
            r"this happened once",
            r"my friend",
            r"based on one"
        ]

        self.balance_markers = ["but", "however", "although"]
        self.certainty_markers = ["definitely", "clearly", "for sure"]

    # ---------------- UTILS ---------------- #

    def match_patterns(self, patterns, text):
        matches = []
        for p in patterns:
            if re.search(p, text):
                matches.append(p)
        return matches

    # ---------------- MAIN ---------------- #

    def analyze(self, text):

        text_lower = text.lower()

        scores = {
            "confirmation_bias": 0.0,
            "anchoring_bias": 0.0,
            "social_influence_bias": 0.0,
            "availability_bias": 0.0
        }

        triggers = []

        # -------- PATTERN MATCHING -------- #

        social_hits = self.match_patterns(self.social_patterns, text_lower)
        confirm_hits = self.match_patterns(self.confirmation_patterns, text_lower)
        anchor_hits = self.match_patterns(self.anchoring_patterns, text_lower)
        absolute_hits = self.match_patterns(self.absolute_patterns, text_lower)
        anecdotal_hits = self.match_patterns(self.anecdotal_patterns, text_lower)

        # -------- BASIC SCORING -------- #

        scores["social_influence_bias"] += 0.3 * len(social_hits)
        scores["confirmation_bias"] += 0.3 * len(confirm_hits)
        scores["anchoring_bias"] += 0.3 * len(anchor_hits)
        scores["availability_bias"] += 0.25 * (len(absolute_hits) + len(anecdotal_hits))

        # store triggers
        for h in social_hits:
            triggers.append(("social_influence_bias", h))
        for h in confirm_hits:
            triggers.append(("confirmation_bias", h))
        for h in anchor_hits:
            triggers.append(("anchoring_bias", h))
        for h in absolute_hits:
            triggers.append(("availability_bias", h))
        for h in anecdotal_hits:
            triggers.append(("availability_bias", h))

        # -------- STRUCTURAL RULES -------- #

        if "because" in text_lower and not any(m in text_lower for m in self.balance_markers):
            scores["confirmation_bias"] += 0.2

        if "first" in text_lower and "still" in text_lower:
            scores["anchoring_bias"] += 0.3

        # -------- SMART COMBINATION LOGIC (IMPORTANT FIX) -------- #

        total_social_context = len(social_hits) + ("should" in text_lower)

        if total_social_context >= 2:
            scores["social_influence_bias"] += 0.3
            triggers.append(("social_influence_bias", "multiple social signals"))

        if social_hits and absolute_hits:
            scores["social_influence_bias"] += 0.2
            scores["availability_bias"] += 0.2

        if anecdotal_hits and absolute_hits:
            scores["availability_bias"] += 0.3

        if confirm_hits and absolute_hits:
            scores["confirmation_bias"] += 0.2

        # -------- SENTIMENT -------- #

        sentiment = sentiment_analyzer.polarity_scores(text)

        if abs(sentiment["compound"]) > 0.6:
            for k in scores:
                scores[k] += 0.1

        # -------- CERTAINTY BOOST -------- #

        if any(m in text_lower for m in self.certainty_markers):
            for k in scores:
                scores[k] += 0.1

        # -------- BALANCE REDUCTION -------- #

        if any(m in text_lower for m in self.balance_markers):
            for k in scores:
                scores[k] -= 0.15

        # -------- NORMALIZE -------- #

        for k in scores:
            scores[k] = max(0.0, min(1.0, scores[k]))

        # -------- OUTPUT -------- #

        predictions = []

        for bias, score in scores.items():
            if score > 0.25:
                related = [t for b, t in triggers if b == bias]
                predictions.append({
                    "bias_type": bias,
                    "score": round(score, 2),
                    "triggers": list(set(related))
                })

        return {
            "bias_scores": scores,
            "bias_predictions": predictions,
            "sentiment": sentiment
        }
        
# ---------------- TEST ----------------
if __name__ == "__main__":

    detector = BiasHeuristicDetector()

    text = "full stack has no future and it is said by many people"

    result = detector.analyze(text)

    print(result)    


