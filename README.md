## 🧠 Silent Bug Predictor

AI-powered system that analyzes GitHub repositories to predict bug-prone files using commit history and structural complexity metrics.

---

## 🚀 Tech Stack

### Backend

* Python
* FastAPI
* Pandas
* XGBoost
* GitHub REST API
* Docker

### Frontend

* React.js
* CSS
* Axios

---

## 🎯 Features

* Repository-level analysis via GitHub URL
* Feature engineering from commit history & code structure
* ML-based probabilistic risk scoring
* Ranked list of high-risk files
* RESTful API architecture
* Dockerized deployment

---

## 🏗 System Architecture

```
Frontend (React)
        ↓
FastAPI Backend
        ↓
GitHub API
        ↓
Feature Extraction (AST + Metadata)
        ↓
ML Model (XGBoost)
        ↓
Risk Scoring Engine
        ↓
JSON Response → UI Visualization
```

---

## 🔄 End-to-End Flow

### 1️⃣ User Input

User enters GitHub repository URL in frontend.

### 2️⃣ API Request

Frontend sends POST request:

```
POST /analyze
{
  "repo_url": "https://github.com/user/repo"
}
```

### 3️⃣ Backend Processing

* Parse repo URL
* Fetch file tree from GitHub API
* Extract Python files
* Collect commit metadata
* Compute structural metrics using AST:

  * LOC
  * Function count
  * Complexity score
* Construct feature dataframe

### 4️⃣ ML Prediction

* Load trained XGBoost model
* Generate probability scores
* Classify risk levels

### 5️⃣ Response

```json
{
  "total_files": 24,
  "high_risk_files": [
    {
      "file": "auth.py",
      "risk_score": 0.87,
      "risk_level": "High"
    }
  ]
}
```

### 6️⃣ Frontend Display

* Risk ranking table
* Highlight high-risk modules
* Summary metrics dashboard

---

## 🧮 Feature Engineering

Per file extracted:

| Feature            | Description                      |
| ------------------ | -------------------------------- |
| commits            | Number of commits affecting file |
| contributors       | Unique authors modifying file    |
| loc                | Lines of code                    |
| functions          | Count of functions (AST)         |
| complexity         | Control flow node count          |
| last_modified_days | Days since last commit           |

---

## 🐳 Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📊 Model Details

* Model: XGBoost Classifier
* Input: Repository structural & historical metrics
* Output: Probability of bug-prone classification
* Evaluation: Precision-based validation on historical data

---

## 📦 Docker 

```bash
docker build -t silent-bug-predictor .
docker run -p 8000:8000 silent-bug-predictor
```

---

## 💡 Why This Project

This project demonstrates:

* Applied Machine Learning in Software Engineering
* Feature Engineering from Version Control Data
* Backend API Architecture
* Code Structure Analysis using AST
* Scalable System Design Principles

---

# 🏗 Detailed Architecture Diagram 

                ┌──────────────────────┐
                │      React UI        │
                │  (Repo URL Input)    │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │   FastAPI Backend    │
                │   /analyze Endpoint  │
                └─────────┬────────────┘
                          │
        ┌─────────────────┴──────────────────┐
        ▼                                    ▼
┌───────────────┐                    ┌────────────────┐
│ GitHub API    │                    │ Feature Engine │
│ Repo Metadata │                    │ AST Analysis   │
└───────────────┘                    └────────────────┘
                                                │
                                                ▼
                                    ┌──────────────────┐
                                    │ XGBoost Model    │
                                    │ Risk Prediction  │
                                    └──────────────────┘
                                                │
                                                ▼
                                    ┌──────────────────┐
                                    │ JSON Risk Report │
                                    └──────────────────┘
                                                │
                                                ▼
                                    ┌──────────────────┐
                                    │ React Dashboard  │
                                    └──────────────────┘
```

---
