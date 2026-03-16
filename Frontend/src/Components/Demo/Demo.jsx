import React from "react";
import "./Demo.css";

const Demo = () => {
  return (
    <section className="demo-section" id="demo">
      <div className="container">
        <h1>Try the Demo</h1>
        <p className="demo-subtitle">
          Paste a GitHub repository URL to detect high-risk files instantly.
        </p>

        <div className="demo-input">
          <input
            type="text"
            placeholder="https://github.com/user/repository"
          />
          <button>Analyze Repository</button>
        </div>

        <p className="demo-note">
          The system fetches repository data, calculates commit churn and structural metrics, 
          and predicts bug-prone files using our ML model.
        </p>
      </div>
    </section>
  );
};

export default Demo;
