import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/Auth";
import "../Login/Login.css"; // reuse same auth styling

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [githubAccount, setGithubAccount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(email, password, githubAccount);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.error;
      setError(detail || "Registration failed. Try a different email.");
    }

    setLoading(false);
  };

  return (
    <section className="auth">
      <div className="auth__card">
        <div className="section-eyebrow">Get Started</div>
        <h1 className="auth__title">Create Account</h1>
        <p className="auth__subtitle">
          Register to save your repository analyses and track risk over time.
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__label">
            Email
            <input
              type="email"
              className="auth__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth__label">
            Password
            <input
              type="password"
              className="auth__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </label>

          <label className="auth__label">
            GitHub Username
            <input
              type="text"
              className="auth__input"
              value={githubAccount}
              onChange={(e) => setGithubAccount(e.target.value)}
              placeholder="octocat"
              required
            />
          </label>

          {error && (
            <div className="auth__error">
              <span>⚠</span>
              {error}
            </div>
          )}

          {success && (
            <div className="auth__error" style={{ color: "#00ff88", background: "rgba(0,255,136,0.08)", borderColor: "rgba(0,255,136,0.2)" }}>
              <span>✓</span>
              Account created! Redirecting to login...
            </div>
          )}

          <button type="submit" className="auth__btn" disabled={loading}>
            {loading ? (
              <>
                <span className="auth__spinner" />
                Creating account...
              </>
            ) : (
              <>
                Sign Up
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <p className="auth__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;