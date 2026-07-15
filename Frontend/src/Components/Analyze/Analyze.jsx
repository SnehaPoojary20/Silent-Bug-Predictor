import React, { useState } from "react";
import "./Analyze.css";

const RISK_LEVELS = [
  { label: "High Risk", color: "#ff5f56", min: 0.7 },
  { label: "Medium Risk", color: "#ffbd2e", min: 0.3 },
  { label: "Low Risk", color: "#27c93f", min: 0 },
];

const getRisk = (score) => RISK_LEVELS.find((r) => score >= r.min) || RISK_LEVELS[2];

const Analyze = () => {
  const [repoName, setRepoName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzed, setAnalyzed] = useState("");

const handleAnalyze = async () => {
  if (!repoName.trim()) return;

  setLoading(true);
  setError("");
  setResults([]);

  try {
    const formatted = repoName
      .replace("https://github.com/", "")
      .replace("http://github.com/", "")
      .trim();

    const parts = formatted.split("/");

    if (parts.length < 2) {
      throw new Error("Please enter a valid GitHub repository.");
    }

    const owner = parts[0];
    const repo = parts[1];

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login first.");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/analysis/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          owner,
          repo,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Analysis failed.");
    }

    setResults(data.results);
    setAnalyzed(`${owner}/${repo}`);
  } catch (err) {
    setError(err.message);
  }

  setLoading(false);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  return (
    <section className="analyze">
      <div className="analyze__inner">

        {/* Header */}
        <div className="analyze__header">
          <div className="section-eyebrow">Prediction Engine</div>
          <h1 className="analyze__title">Analyze Repository</h1>
          <p className="analyze__subtitle">
            Paste a GitHub repository URL. We scan commit history and structural
            complexity to surface your highest-risk files.
          </p>
        </div>

        {/* Input */}
        <div className="analyze__input-wrap">
          <div className="analyze__input-box">
            <span className="analyze__input-icon">⬡</span>
            <input
              type="text"
              className="analyze__input"
              placeholder="https://github.com/owner/repository"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`analyze__btn ${loading ? "analyze__btn--loading" : ""}`}
              onClick={handleAnalyze}
              disabled={loading || !repoName.trim()}
            >
              {loading ? (
                <>
                  <span className="analyze__spinner" />
                  Scanning...
                </>
              ) : (
                <>
                  Analyze
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="analyze__error">
              <span>⚠</span>
              {error}
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="analyze__scanning">
            <div className="scanning__steps">
              {["Fetching commit history...", "Extracting features...", "Running XGBoost model...", "Ranking files by risk..."].map((step, i) => (
                <div key={i} className="scanning__step" style={{ animationDelay: `${i * 0.4}s` }}>
                  <span className="scanning__dot" />
                  <span className="scanning__label">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="analyze__results">
            <div className="results__header">
              <div>
                <h2 className="results__title">Risk Analysis Complete</h2>
                <p className="results__meta">
                  Repo: <span className="results__repo">{analyzed}</span> ·{" "}
                  {results.length} files ranked
                </p>
              </div>
              <div className="results__legend">
                {RISK_LEVELS.map(({ label, color }) => (
                  <span key={label} className="legend-item">
                    <span className="legend-dot" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="results__list">
              {results.map((item, index) => {
                const risk = getRisk(item.risk_score);
                const pct = (item.risk_score * 100).toFixed(1);
                return (
                  <div key={index} className="result-row">
                    <div className="result-row__rank">#{index + 1}</div>

                    <div className="result-row__info">
                      <div className="result-row__file">
                        <span className="result-row__file-icon">📄</span>
                        {item.file}
                      </div>
                      <div className="result-row__bar-wrap">
                        <div className="result-row__bar">
                          <div
                            className="result-row__fill"
                            style={{
                              width: `${item.risk_score * 100}%`,
                              background: risk.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="result-row__right">
                      <span
                        className="result-row__badge"
                        style={{
                          color: risk.color,
                          borderColor: `${risk.color}33`,
                          background: `${risk.color}10`,
                        }}
                      >
                        {risk.label}
                      </span>
                      <span className="result-row__score" style={{ color: risk.color }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && !error && (
          <div className="analyze__empty">
            <div className="empty__icon">⬡</div>
            <p className="empty__text">
              Enter a GitHub repository to begin analysis
            </p>
            <p className="empty__hint">
              Example: <code>tensorflow/tensorflow</code> or{" "}
              <code>facebook/react</code>
            </p>
          </div>
        )}

        <p className="analyze__note">
          Fetches up to 200 commits · Ranks by commit churn, contributor count,
          file depth, and days since last modified
        </p>

      </div>
    </section>
  );
};

export default Analyze;
