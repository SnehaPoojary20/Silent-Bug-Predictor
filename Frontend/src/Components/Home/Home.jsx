import React from "react";
import "./Home.css";


const Home = () => {
  return (
    <main className="home-container">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Silent Bug Predictor</h1>
          <p className="hero-subtitle">
            AI-powered system that predicts bug-prone files in GitHub repositories using commit churn 
            and structural complexity metrics.
          </p>
          <div className="hero-cta">
            <a href="/demo" className="btn-primary">Analyze Repository</a>
            <a href="/docs" className="btn-secondary">View Docs</a>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="overview-section">
        <div className="overview-container">
          <h2>Why Silent Bug Predictor?</h2>
          <p className="overview-text">
            Developing high-quality software requires catching bugs early. Silent Bug Predictor leverages 
            machine learning to automatically highlight files that are likely to contain issues, 
            helping developers prioritize code review and maintain code stability.
          </p>
        </div>
      </section>

    <Analyze/>

    </main>
  );
};

export default Home;
