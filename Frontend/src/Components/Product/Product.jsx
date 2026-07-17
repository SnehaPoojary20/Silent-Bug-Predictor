import React from "react";
import "./Product.css";

const FEATURES = [
  {
    icon: "🔬",
    title: "Bug Prediction",
    desc: "XGBoost ranks each Python file by bug probability using code structure and repository history.",
    tag: "ML Model",
  },
  {
    icon: "📉",
    title: "Commit Intelligence",
    desc: "The backend scans commit count, contributor count, and days since last modified for each file.",
    tag: "Feature",
  },
  {
    icon: "🧬",
    title: "AST-Based Structure",
    desc: "Python AST is used to extract LOC, function count, and cyclomatic complexity without executing code.",
    tag: "Feature",
  },
  {
    icon: "⚡",
    title: "FastAPI Backend",
    desc: "Async endpoints return authenticated analysis results and saved reports for each user.",
    tag: "Backend",
  },
];

const Product = () => (
  <section className="product">
    <div className="product__inner">
      <div className="section-eyebrow">Product Overview</div>
      <h1 className="section-title">What Silent Bug Predictor Does</h1>
      <p className="section-body">
        An end-to-end ML system that analyzes GitHub repositories and ranks files by
        bug probability — giving engineering teams an evidence-based starting point
        for every code review.
      </p>

      <div className="product__grid">
        {FEATURES.map(({ icon, title, desc, tag }) => (
          <div key={title} className="product-card">
            <div className="product-card__top">
              <span className="product-card__icon">{icon}</span>
              <span className="product-card__tag">{tag}</span>
            </div>
            <h3 className="product-card__title">{title}</h3>
            <p className="product-card__desc">{desc}</p>
          </div>
        ))}
      </div>

      <div className="docs__section-label" style={{ marginTop: "48px" }}>
        API Flow
      </div>
      <div className="product__flow">
        <div className="step-card">
          <div className="step-card__num">01</div>
          <div className="step-card__content">
            <h3 className="step-card__title">Register / Login</h3>
            <p className="step-card__desc">
              Users create an account with email, password, and GitHub username, then log in to receive a JWT token.
            </p>
            <code className="step-card__code">POST /auth/register · POST /auth/login</code>
          </div>
        </div>

        <div className="step-card">
          <div className="step-card__num">02</div>
          <div className="step-card__content">
            <h3 className="step-card__title">Analyze Repository</h3>
            <p className="step-card__desc">
              The frontend sends owner and repo in the request body to the backend analysis route.
            </p>
            <code className="step-card__code">POST /analysis/</code>
          </div>
        </div>

        <div className="step-card">
          <div className="step-card__num">03</div>
          <div className="step-card__content">
            <h3 className="step-card__title">Save & Review Results</h3>
            <p className="step-card__desc">
              Results are stored per user and can be fetched later from the authenticated analysis endpoints.
            </p>
            <code className="step-card__code">GET /analysis/ · GET /analysis/{`{analysis_id}`}</code>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Product;
