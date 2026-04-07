import React, { useState } from "react";
import "./Analyze.css";

const Analyze = () => {
  const [repoName, setRepoName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!repoName) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Convert full GitHub URL → owner/repo
      let formattedRepo = repoName
        .replace("https://github.com/", "")
        .trim();

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/predict?repo_name=${formattedRepo}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to analyze repo");
      }

      // Sort top risky files
      const sorted = data.results
        .sort((a, b) => b.risk_score - a.risk_score)
        .slice(0, 10);

      setResults(sorted);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <section className="demo-section">
      <div className="container">
        <h1>Try the Demo</h1>

        <p className="demo-subtitle">
          Paste a GitHub repository URL to detect high-risk files instantly.
        </p>

        <div className="demo-input">
          <input
            type="text"
            placeholder="https://github.com/user/repository"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />

          <button onClick={handleAnalyze}>
            {loading ? "Analyzing..." : "Analyze Repository"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {/* RESULTS */}
        <div className="results">
          {results.length > 0 && <h2>Top Risk Files</h2>}

          {results.map((item, index) => (
            <div key={index} className="card">
              <p className="file">{item.file}</p>

              <p className="risk">
                {(item.risk_score * 100).toFixed(2)}%
              </p>

              <div className="bar">
                <div
                  className="fill"
                  style={{
                    width: `${item.risk_score * 100}%`,
                    background:
                      item.risk_score > 0.7
                        ? "#ff4d4d"
                        : item.risk_score > 0.3
                        ? "#f1c40f"
                        : "#2ecc71",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <p className="demo-note">
          The system fetches repository data, calculates commit churn and
          structural metrics, and predicts bug-prone files using ML.
        </p>
      </div>
    </section>
  );
};

export default Analyze;
