import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const STATS = [
  { value: "75%", label: "Prediction Precision" },
  { value: "4", label: "Engineered Features" },
  { value: "<3s", label: "Analysis Time" },
  { value: "200", label: "Commits Scanned" },
];

const Home = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.alpha})`;
        ctx.fill();
      });
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((q) => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.08 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <main className="home">

      {/* HERO */}
      <section className="hero">
        <canvas ref={canvasRef} className="hero__canvas" />
        <div className="hero__grid-overlay" />

        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            ML-Powered · GitHub API · XGBoost
          </div>

          <h1 className="hero__title">
            Predict Bugs
            <br />
            <span className="hero__title-accent">Before They Break</span>
          </h1>

          <p className="hero__subtitle">
            AI system that scans GitHub repos and surfaces the files most likely to
            contain bugs — using commit churn, structural complexity, and
            contributor patterns.
          </p>

          <div className="hero__actions">
            <Link to="/analyze" className="btn-primary">
              Analyze Repository
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/docs" className="btn-ghost">View Docs</Link>
          </div>

          <div className="hero__terminal">
            <div className="terminal__bar">
              <span className="terminal__dot terminal__dot--red" />
              <span className="terminal__dot terminal__dot--yellow" />
              <span className="terminal__dot terminal__dot--green" />
              <span className="terminal__title">bug-predictor ~</span>
            </div>
            <div className="terminal__body">
              <p><span className="terminal__prompt">$</span> POST /predict?repo_name=user/repo</p>
              <p className="terminal__response">{"{"}</p>
              <p className="terminal__response">&nbsp;&nbsp;"auth/login.py": <span className="terminal__high">0.87</span>,</p>
              <p className="terminal__response">&nbsp;&nbsp;"db_utils.py": <span className="terminal__med">0.61</span>,</p>
              <p className="terminal__response">&nbsp;&nbsp;"api/routes.py": <span className="terminal__low">0.23</span></p>
              <p className="terminal__response">{"}"}</p>
              <p className="terminal__cursor">▋</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats__inner">
          {STATS.map(({ value, label }) => (
            <div key={label} className="stat-card">
              <div className="stat-card__value">{value}</div>
              <div className="stat-card__label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="overview">
        <div className="overview__inner">
          <div className="section-eyebrow">Why It Matters</div>
          <h2 className="section-title">Stop Guessing. Start Predicting.</h2>
          <p className="section-body">
            Code review is expensive. Engineers spend hours reviewing files that are
            statistically low-risk, while truly dangerous files slip through. Silent
            Bug Predictor quantifies risk using commit history and code structure —
            so your team focuses where it counts.
          </p>

          <div className="overview__cards">
            {[
              { icon: "🔬", title: "AST Analysis", desc: "Parses Python AST to extract LOC, function count, and cyclomatic complexity without executing code." },
              { icon: "📊", title: "Commit Intelligence", desc: "Tracks churn, unique contributors, and time-since-modified per file across 200 commits." },
              { icon: "⚡", title: "XGBoost Model", desc: "Captures interaction effects between complexity and contributor count — signals logistic regression misses." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="overview-card">
                <div className="overview-card__icon">{icon}</div>
                <h3 className="overview-card__title">{title}</h3>
                <p className="overview-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;
