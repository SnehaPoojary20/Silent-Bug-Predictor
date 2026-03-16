import React from "react";
import "./Product.css";

const Product = () => {
  return (
    <section className="product-section" id="product">
      <div className="container">
        <h1 className="product-title">Silent Bug Predictor</h1>
        <p className="product-subtitle">
          AI-powered system that predicts bug-prone files using commit churn 
          and structural complexity metrics.
        </p>

        <div className="product-features">
          <div className="feature">
            <h3>Bug Prediction</h3>
            <p>Automatically detect files with high probability of containing bugs.</p>
          </div>
          <div className="feature">
            <h3>Commit Churn Analysis</h3>
            <p>Tracks modification frequency to detect unstable components.</p>
          </div>
          <div className="feature">
            <h3>Structural Complexity</h3>
            <p>Measures repository structure to identify risky files.</p>
          </div>
          <div className="feature">
            <h3>Developer Friendly</h3>
            <p>FastAPI backend and simple interface for immediate insights.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
