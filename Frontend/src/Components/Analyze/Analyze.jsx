import React, { useState } from "react";
import api from "../../services/api";
import "./Analyze.css";

const RISK_LEVELS = [
  { label: "High Risk", color: "#ff5f56", min: 0.7 },
  { label: "Medium Risk", color: "#ffbd2e", min: 0.4 },
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
    const trimmed = repoName.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const formatted = trimmed
        .replace(/^https?:\/\/github\.com\//, "")
        .replace(/\/$/, "");

      const parts = formatted.split("/");
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        throw new Error("Please enter a valid GitHub repository.");
      }

      const owner = parts[0];
      const repo = parts[1];

      const res = await api.post("/analysis/", {
        owner,
        repo,
      });

      setResults(Array.isArray(res.data?.results) ? res.data.results : []);
      setAnalyzed(`${owner}/${repo}`);
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        "Analysis failed.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  return (
    <section className="analyze">
      <div className="analyze__inner">
        <div className="analyze__header">
          <div className="section-eyebrow">Prediction Engine</div>
          <h1 className="analyze__title">Analyze Repository</h1>
          <p className="analyze__subtitle">
            Paste a GitHub repository URL. We scan commit history and structural
            complexity to surface your highest-risk files.
          </p>
        </div>

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

        {loading && (
          <div className="analyze__scanning">
            <div className="scanning__steps">
              {[
                "Fetching commit history...",
                "Extracting features...",
                "Running XGBoost model...",
                "Ranking files by risk...",
              ].map((step, i) => (
                <div
                  key={i}
                  className="scanning__step"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <span className="scanning__dot" />
                  <span className="scanning__label">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
                const risk = getRisk(item.bug_probability);
                const pct = (item.bug_probability * 100).toFixed(1);

                return (
                  <div key={item.id || index} className="result-row">
                    <div className="result-row__rank">#{index + 1}</div>

                    <div className="result-row__info">
                      <div className="result-row__file">
                        <span className="result-row__file-icon">📄</span>
                        {item.file_name}
                      </div>
                      <div className="result-row__bar-wrap">
                        <div className="result-row__bar">
                          <div
                            className="result-row__fill"
                            style={{
                              width: `${item.bug_probability * 100}%`,
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
