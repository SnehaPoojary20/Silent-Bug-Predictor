import React from "react";
import "./Working.css";

const Working = () => {
  return (
    <section className="working-section" id="how-it-works">
      <div className="container">
        <h1>How It Works</h1>
        <p className="working-subtitle">
          Silent Bug Predictor processes repository data to deliver actionable insights.
        </p>

        <div className="working-steps">
          <div className="step">
            <h3>1. Repository Analysis</h3>
            <p>Fetch commit history, file paths, and structural metrics from GitHub API.</p>
          </div>
          <div className="step">
            <h3>2. Feature Engineering</h3>
            <p>Generate ML features like commit churn, file depth, and modification frequency.</p>
          </div>
          <div className="step">
            <h3>3. ML Prediction</h3>
            <p>Run XGBoost model to estimate bug probability for each file.</p>
          </div>
          <div className="step">
            <h3>4. Risk Scoring</h3>
            <p>Rank files by predicted risk and display results in a developer-friendly dashboard.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;
