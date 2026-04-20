# 🧠 BiasLens

BiasLens is an AI-powered decision intelligence system that detects cognitive biases in user reasoning and improves decision quality through structured analysis and multi-agent evaluation.

---

## 🚀 Features

* 🔍 Detects cognitive biases (Confirmation, Anchoring, Social Influence, Availability)
* 🧩 Extracts structured reasoning:

  * Claim, Supporting Reason, Assumptions
  * Evidence (present / missing)
  * Conclusion, Emotional Intensity, Certainty Level
* 🤖 Multi-agent system:

  * Devil’s Advocate (challenges reasoning)
  * Statistician (evaluates evidence)
  * Neutral Judge (provides balanced output)
* 📊 Interactive dashboard with bias scores and insights
* 🧠 Generates improved, unbiased decision suggestions

---

## 🏗️ Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* PydanticAI (LLM structured outputs)
* spaCy (NLP preprocessing)

### Database

* PostgreSQL (with pgvector)

### Others

* Redis (caching & background jobs)
* Docker (optional for deployment)

---

## 📁 Project Structure

```
biaslens/
├── README.md
├── .env.example
├── docs/
├── frontend/
│   └── src/
├── backend/
│   └── app/
└── shared/
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd biaslens
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend

```bash
cd backend
python -m venv .venv
# activate environment
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env` and add your keys:

```
OPENAI_API_KEY=
DATABASE_URL=
REDIS_URL=
```

---

## 🔄 System Flow

User Input → Bias Detection → Argument Extraction → Evidence Analysis → Multi-Agent Reasoning → Balanced Decision Output → Dashboard

---

## 🎯 Goal

BiasLens aims to help users make better decisions by identifying flawed reasoning patterns and guiding them toward more balanced, evidence-based thinking.

---

## 📌 Future Improvements

* Personalized bias tracking
* Domain-specific decision modes (career, finance, etc.)
* Real-time feedback learning system
* Voice/audio input support

---

## 👩‍💻 Author

Gouri Gupta

---

## ⭐ Contribute

Feel free to fork, improve, and contribute to make decision-making smarter!
