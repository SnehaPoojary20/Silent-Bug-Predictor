## Silent Bug Predictor

An end-to-end ML system that analyzes GitHub repositories and ranks Python files by how likely they are to contain bugs — combining commit-history patterns with AST-extracted code complexity metrics.

GitHub: github.com/SnehaPoojary20/Silent-Bug-Predictor

Live: https://silent-bug-predictor.vercel.app/

### The Problem

Code review is expensive, and teams often don't know where to focus it. Bug-prone files tend to share measurable characteristics: they're touched frequently by many contributors, they're structurally complex, and they accrue changes rapidly. This project turns those signals into a ranked, per-file score.

### System Architecture

```
React Frontend
      │
      ▼
FastAPI Backend  ←── POST /analysis/ { "owner": "...", "repo": "..." }  (JWT-authenticated)
      │
      ├── GitHub REST API  →  file tree + per-file commit history
      │
      ├── Feature Extraction
      │     ├── AST Analysis (LOC, function count, cyclomatic complexity)
      │     └── Commit Metadata (commit count, contributors, days since last change)
      │
      ├── XGBoost Classifier  →  bug probability per file
      │
      └── PostgreSQL  →  analysis + per-file results persisted, returned as JSON
```

### Feature Engineering

Each Python file gets six engineered features before hitting the model:

| Feature | Description | Source |
|---|---|---|
| loc | Lines of code | AST / file read |
| function_count | Number of function definitions (sync + async) | `ast.FunctionDef` / `ast.AsyncFunctionDef` |
| cyclomatic_complexity | Control-flow node count (if/for/while/try/except/boolop/ternary) | `ast.NodeVisitor` |
| commits | Number of commits touching this file | GitHub REST API |
| contributors | Unique commit authors on this file | GitHub REST API |
| last_modified_days | Days since the file's most recent commit | GitHub REST API |

Why these features? Files with high commit counts and many contributors tend to accumulate technical debt. High complexity is a commonly cited bug predictor in software engineering research. `last_modified_days` surfaces files that were once heavily changed but haven't been touched since — often forgotten danger zones.

### The ML Model

- **Algorithm:** XGBoost binary classifier, loaded from a pickled model file at startup
- **Target:** Bug-prone (1) vs. not bug-prone (0)
- **Risk bands:** probability ≥ 0.7 → HIGH, ≥ 0.4 → MEDIUM, else LOW
- **Why XGBoost:** chosen over a simpler linear classifier like logistic regression because it captures feature interactions — e.g., high complexity *and* high contributor count together is a stronger signal than either alone — and produces probability outputs suited to a risk-ranking use case.

> **Note on evaluation:** the model has not been benchmarked against a held-out, labeled bug dataset. Precision/recall are not established. **The test suite that would normally cover this (`tests/test_ml_service.py`, `test_ast_service.py`, `test_analysis_routes.py`) exists as scaffolding but currently contains no test code — the files are empty.** Writing those tests, and benchmarking against a labeled dataset, are the top two items before any accuracy claim should be made publicly.

### API

```
POST /analysis/
Authorization: Bearer <access_token>
```
```json
// Request
{ "owner": "torvalds", "repo": "some-repo" }
```
```json
// Response (201)
{
  "id": 4,
  "owner": "torvalds",
  "repo": "some-repo",
  "total_files": 24,
  "created_at": "2026-08-21T10:00:00Z",
  "results": [
    { "file_name": "auth.py", "bug_probability": 0.87, "risk_level": "HIGH" },
    { "file_name": "db_utils.py", "bug_probability": 0.61, "risk_level": "MEDIUM" }
  ]
}
```
```
GET /analysis/            → list current user's past analyses
GET /analysis/{id}        → fetch one analysis by id
POST /auth/register       → create an account
POST /auth/login          → returns a bearer access token
GET  /health               → { "status": "ok" }
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, plain CSS, Axios |
| Backend | Python, FastAPI, SQLAlchemy (async) |
| Database | PostgreSQL (via asyncpg) |
| Static analysis | Python `ast` module |
| ML model | XGBoost |
| External data | GitHub REST API (via httpx) |
| Auth | JWT (python-jose), bcrypt password hashing |
| Rate limiting | slowapi (`Limiter` is registered at app level but not yet applied to any route — see below) |
| Deployment | Docker, Render |

### Local Setup

```bash
git clone https://github.com/SnehaPoojary20/Silent-Bug-Predictor.git

# Backend
cd Silent-Bug-Predictor/Backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
# create a .env with: DATABASE_URL, SECRET_KEY, GITHUB_TOKEN
uvicorn app.main:app --reload
# Runs at http://localhost:8000 — Swagger docs at /docs

# Frontend
cd ../Frontend
npm install
npm start
# Runs at http://localhost:3000
```

**Docker Compose (backend + Postgres together)**
```bash
cd Silent-Bug-Predictor/Backend
docker compose up --build
```

### What I'd Improve Next

- **Write the test suite.** The pytest files exist but are empty — this is the most important gap in the project right now, not a nice-to-have.
- **Apply the rate limiter.** `slowapi`'s `Limiter` is wired into the app but no route currently has a `@limiter.limit(...)` decorator, so nothing is actually rate-limited yet.
- **Benchmark against a real labeled dataset** (e.g. issue-linked commits) to establish actual precision/recall, instead of relying on proxy labels.
- Extend AST analysis to JavaScript/TypeScript for multi-language support.
- Add file-level diff analysis to capture churn rate, not just total commit count.
- GitHub App integration so this can run as an automated PR check.
