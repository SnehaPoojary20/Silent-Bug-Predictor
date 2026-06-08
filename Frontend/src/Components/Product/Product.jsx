import React from "react";
import "./Product.css";

const FEATURES = [
  {
    icon: "🔬",
    title: "Bug Prediction",
    desc: "XGBoost model assigns a probability score per file based on 4 engineered features.",
    tag: "ML Model",
  },
  {
    icon: "📉",
    title: "Commit Churn",
    desc: "Files touched frequently across commits accumulate technical debt and regression risk.",
    tag: "Feature",
  },
  {
    icon: "🧬",
    title: "Structural Complexity",
    desc: "File depth and contributor count surface hidden coupling and ownership gaps.",
    tag: "Feature",
  },
  {
    icon: "⚡",
    title: "FastAPI Backend",
    desc: "Async endpoint returns ranked results in under 3 seconds for repos up to 200 commits.",
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
    </div>
  </section>
);

export default Product;
