import React, { useEffect, useState } from "react";
import { getAnalyses } from "../../api/analysis";
import "./Profile.css";

const RISK_COLORS = {
  HIGH: "#ff5f56",
  MEDIUM: "#ffbd2e",
  LOW: "#27c93f",
};

const Profile = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAnalyses();
        setAnalyses(Array.isArray(data) ? data : []);
      } catch (err) {
        const detail =
          err.response?.data?.detail || err.message || "Failed to load history.";
        setError(detail);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="profile">
        <div className="profile__inner">
          <p className="profile__status">Loading your analysis history...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="profile">
        <div className="profile__inner">
          <p className="profile__error">⚠ {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile">
      <div className="profile__inner">
        <div className="profile__header">
          <div className="section-eyebrow">Your Activity</div>
          <h1 className="profile__title">Analysis History</h1>
          <p className="profile__subtitle">
            {analyses.length} repositor{analyses.length === 1 ? "y" : "ies"} analyzed
          </p>
        </div>

        {analyses.length === 0 ? (
          <div className="profile__empty">
            <div className="empty__icon">⬡</div>
            <p className="empty__text">No analyses yet</p>
            <p className="empty__hint">Run your first scan from the Analyze page</p>
          </div>
        ) : (
          <div className="profile__list">
            {analyses.map((item) => {
              const highRisk = item.results.filter((r) => r.risk_level === "HIGH").length;
              return (
                <div key={item.id} className="profile-card">
                  <div className="profile-card__top">
                    <span className="profile-card__repo">
                      {item.owner}/{item.repo}
                    </span>
                    <span className="profile-card__date">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="profile-card__stats">
                    <span className="profile-card__stat">
                      {item.total_files} files scanned
                    </span>
                    {highRisk > 0 && (
                      <span
                        className="profile-card__badge"
                        style={{
                          color: RISK_COLORS.HIGH,
                          borderColor: `${RISK_COLORS.HIGH}33`,
                          background: `${RISK_COLORS.HIGH}10`,
                        }}
                      >
                        {highRisk} high risk
                      </span>
                    )}
                  </div>

                  <div className="profile-card__files">
                    {item.results.slice(0, 3).map((r) => (
                      <div
                        key={`${item.id}-${r.file_name}`}
                        className="profile-card__file"
                      >
                        <span className="profile-card__file-name">{r.file_name}</span>
                        <span
                          className="profile-card__file-score"
                          style={{ color: RISK_COLORS[r.risk_level] || RISK_COLORS.LOW }}
                        >
                          {(r.bug_probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                    {item.results.length > 3 && (
                      <span className="profile-card__more">
                        +{item.results.length - 3} more files
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;