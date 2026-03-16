import React from "react";
import "./Docs.css";

const Docs = () => {
  return (
    <section className="docs-section" id="docs">
      <div className="container">
        <h1>Developer Docs</h1>
        <p className="docs-subtitle">
          Access the API endpoints and explore the ML pipeline.
        </p>

        <div className="docs-content">
          <h3>API Endpoints</h3>
          <ul>
            <li><code>POST /analyze-repo</code> – Submit a GitHub repository for analysis</li>
            <li><code>GET /results</code> – Retrieve analysis results</li>
            <li><code>GET /model-info</code> – View model information and metrics</li>
          </ul>

          <h3>Technology Stack</h3>
          <ul>
            <li>Python</li>
            <li>FastAPI</li>
            <li>XGBoost</li>
            <li>Pandas</li>
            <li>GitHub API</li>
            <li>Docker</li>
          </ul>

          <p className="docs-note">
            The ML model was trained on historical repository data to detect bug-prone files using commit churn and structural complexity features.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Docs;
