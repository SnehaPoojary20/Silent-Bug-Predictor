# Silent Bug Predictor

An end-to-end ML system that analyzes GitHub repositories and predicts which files are most likely to contain bugs — using commit history patterns and AST-extracted code complexity metrics.

**GitHub:** [github.com/SnehaPoojary20/Silent-Bug-Predictor](https://github.com/SnehaPoojary20/Silent-Bug-Predictor)

---

## The Problem

Code review is expensive, and teams often don't know where to focus. Bug-prone files tend to share measurable characteristics: they're touched frequently by many contributors, they're structurally complex, and they accrue changes rapidly. This project makes those signals quantifiable and actionable.

---

## System Architecture

```
React Frontend
      │
      ▼
FastAPI Backend  ←── POST /analyze { "repo_url": "..." }
      │
      ├── GitHub REST API  →  file tree + commit metadata
      │
      ├── Feature Extraction
      │     ├── AST Analysis (LOC, function count, cyclomatic complexity)
      │     └── Commit Metadata (commit count, contributors, last modified)
      │
      ├── XGBoost Classifier  →  probability score per file
      │
      └── Risk Scoring Engine  →  ranked JSON response
```

---

## Feature Engineering

Each file gets six engineered features before hitting the model:

| Feature | Description | Source |
|---------|-------------|--------|
| `commits` | Number of commits touching this file | GitHub API |
| `contributors` | Unique authors who modified the file | GitHub API |
| `last_modified_days` | Days since most recent commit | GitHub API |
| `loc` | Lines of code | AST / file read |
| `functions` | Number of function definitions | `ast.FunctionDef` |
| `complexity` | Control flow node count (if/for/while/try) | `ast.walk()` |

**Why these features?** Files with high commit counts + many contributors tend to accumulate technical debt. High complexity with low test coverage is a known bug predictor. `last_modified_days` surfaces files that were once heavily changed but haven't been touched since — often forgotten danger zones.

---

## The ML Model

- **Algorithm:** XGBoost binary classifier
- **Target:** Bug-prone (1) vs. not bug-prone (0)
- **Validation:** Precision-based evaluation on historical commit data
- **Achieved precision:** ~75% on production test sets

XGBoost was chosen over simpler classifiers because it handles feature interactions well (e.g., high complexity AND high contributor count is more predictive than either alone) and provides probability outputs for risk scoring.

---

## API

### `POST /analyze`

```json
// Request
{
  "repo_url": "https://github.com/user/repo"
}

// Response
{
  "total_files": 24,
  "high_risk_files": [
    {
      "file": "auth.py",
      "risk_score": 0.87,
      "risk_level": "High"
    },
    {
      "file": "db_utils.py",
      "risk_score": 0.61,
      "risk_level": "Medium"
    }
  ]
}
```

### `GET /health`
Returns `{"status": "ok"}`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Axios, CSS |
| Backend | Python, FastAPI |
| Data processing | Pandas |
| Static analysis | Python `ast` module |
| ML model | XGBoost |
| External data | GitHub REST API |
| Deployment | Docker |

---

## Local Setup

```bash
git clone https://github.com/SnehaPoojary20/Silent-Bug-Predictor.git

# Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs at http://localhost:8000

# Frontend
cd ../frontend
npm install
npm start
# Runs at http://localhost:3000
```

### Docker

```bash
docker build -t silent-bug-predictor .
docker run -p 8000:8000 silent-bug-predictor
```

---

## What I'd improve next

- **Retrain on real bug datasets** (e.g., using BugZilla or issue-linked commits) instead of proxy labels
- **Language support beyond Python** — extend AST analysis to JavaScript/TypeScript
- **File-level diff analysis** to capture churn rate, not just total commit count
- **GitHub App integration** so this can run as a PR check automatically
