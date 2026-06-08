import React from "react";
import "./Working.css";

const STEPS = [
  {
    num: "01",
    title: "Fetch Repository",
    desc: "GitHub REST API retrieves commit history (up to 200 commits), file paths, and author metadata.",
    detail: "POST /predict?repo_name=owner/repo",
  },
  {
    num: "02",
    title: "Extract Features",
    desc: "Per-file features are computed: commit churn, unique contributors, days since modified, and file depth.",
    detail: "4 features · Pandas DataFrame",
  },
  {
    num: "03",
    title: "XGBoost Prediction",
    desc: "Pre-trained XGBoost classifier assigns a bug probability score to each file using the engineered features.",
    detail: "model.predict_proba(X)[:, 1]",
  },
  {
    num: "04",
    title: "Risk Ranking",
    desc: "Files are sorted by predicted probability and returned as a ranked JSON list with risk levels.",
    detail: "High / Medium / Low · <3s",
  },
];

const Working = () => (
  <section className="working">
    <div className="working__inner">
      <div className="section-eyebrow">Under the Hood</div>
      <h1 className="section-title">How It Works</h1>
      <p className="section-body">
        Four stages, one pipeline — from a GitHub URL to a ranked bug-risk report
        in under 3 seconds.
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
