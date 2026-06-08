import React, { useState } from "react";
import "./Docs.css";

const ENDPOINTS = [
  {
    method: "POST",
    path: "/predict",
    desc: "Submit a GitHub repository for bug-risk analysis",
    params: "repo_name: string (query param)",
    response: '{ results: [{ file, risk_score }] }',
  },
  {
    method: "GET",
    path: "/health",
    desc: "Health check — returns model load status",
    params: "None",
    response: '{ status, model_loaded, timestamp }',
  },
];

const STACK = [
  { label: "Language", value: "Python 3.11" },
  { label: "Backend", value: "FastAPI + Uvicorn" },
  { label: "ML Model", value: "XGBoost Classifier" },
  { label: "Data", value: "Pandas DataFrame" },
  { label: "GitHub Data", value: "PyGithub REST API" },
  { label: "Serialization", value: "Pydantic v2" },
  { label: "Container", value: "Docker" },
  { label: "Frontend", value: "React.js + Vite" },
];

const Docs = () => {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const ep = ENDPOINTS[activeEndpoint];

  return (
    <section className="docs">
      <div className="docs__inner">
        <div className="section-eyebrow">API Reference</div>
        <h1 className="section-title">Developer Docs</h1>
        <p className="section-body">
          All endpoints served over FastAPI. Run locally at{" "}
          <code className="inline-code">http://127.0.0.1:8000</code> or
          deploy via Docker.
        </p>

        {/* Endpoints */}
        <div className="docs__section-label">Endpoints</div>
        <div className="docs__endpoints">
          <div className="endpoints__tabs">
            {ENDPOINTS.map(({ method, path }, i) => (
              <button
                key={path}
                className={`endpoint-tab ${activeEndpoint === i ? "endpoint-tab--active" : ""}`}
                onClick={() => setActiveEndpoint(i)}
              >
                <span className={`method-badge method-badge--${method.toLowerCase()}`}>
                  {method}
                </span>
                <code>{path}</code>
              </button>
            ))}
          </div>

          <div className="endpoint-detail">
            <p className="endpoint-detail__desc">{ep.desc}</p>
            <div className="endpoint-detail__row">
              <span className="endpoint-detail__key">Parameters</span>
              <code className="endpoint-detail__val">{ep.params}</code>
            </div>
            <div className="endpoint-detail__row">
              <span className="endpoint-detail__key">Response</span>
              <code className="endpoint-detail__val">{ep.response}</code>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="docs__section-label" style={{ marginTop: "48px" }}>Tech Stack</div>
        <div className="docs__stack">
          {STACK.map(({ label, value }) => (
            <div key={label} className="stack-row">
              <span className="stack-row__label">{label}</span>
              <span className="stack-row__value">{value}</span>
            </div>
          ))}
        </div>

        {/* Setup */}
        <div className="docs__section-label" style={{ marginTop: "48px" }}>Local Setup</div>
        <div className="docs__code-block">
          <div className="code-block__bar">
            <span className="code-block__title">bash</span>
          </div>
          <pre className="code-block__body">{`# Clone repo
git clone https://github.com/SnehaPoojary20/Silent-Bug-Predictor.git

# Backend
cd Backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd Frontend
npm install && npm run dev`}</pre>
        </div>

      </div>
    </section>
  );
};

export default Docs;
