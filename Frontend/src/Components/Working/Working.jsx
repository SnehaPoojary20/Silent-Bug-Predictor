import React from "react";
import "./Working.css";

const STEPS = [
  {
    num: "01",
    title: "Authenticate User",
    desc: "The frontend sends login credentials to the FastAPI auth endpoints and stores the returned JWT token.",
    detail: "POST /auth/register · POST /auth/login",
  },
  {
    num: "02",
    title: "Fetch Repository Data",
    desc: "The backend uses the GitHub REST API to collect Python files, commit history, and author metadata.",
    detail: "owner + repo → GitHub API",
  },
  {
    num: "03",
    title: "Extract Features",
    desc: "For each file, AST features and commit-based signals are combined into a single feature vector.",
    detail: "LOC · function_count · cyclomatic_complexity · commits · contributors · last_modified_days",
  },
  {
    num: "04",
    title: "Predict and Rank",
    desc: "The XGBoost model scores every file, then the backend sorts results by highest bug probability first.",
    detail: "POST /analysis/ → ranked file results",
  },
  {
    num: "05",
    title: "Save & Reuse",
    desc: "The analysis and file-level results are saved in PostgreSQL and can be fetched later for the same user.",
    detail: "GET /analysis/ · GET /analysis/{`{analysis_id}`}",
  },
];

const Working = () => (
  <section className="working">
    <div className="working__inner">
      <div className="section-eyebrow">Under the Hood</div>
      <h1 className="section-title">How It Works</h1>
      <p className="section-body">
        A simple flow from GitHub repo input to authenticated bug-risk analysis and saved results.
      </p>

      <div className="working__steps">
        {STEPS.map(({ num, title, desc, detail }, i) => (
          <div key={num} className="step-card">
            <div className="step-card__num">{num}</div>
            <div className="step-card__content">
              <h3 className="step-card__title">{title}</h3>
              <p className="step-card__desc">{desc}</p>
              <code className="step-card__code">{detail}</code>
            </div>
            {i < STEPS.length - 1 && <div className="step-card__arrow">↓</div>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Working;
