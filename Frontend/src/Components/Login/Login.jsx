import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/auth.js";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/analyze", { replace: true });
    } catch (err) {
      const data = err.response?.data;
      const detail =
        typeof data?.detail === "string"
          ? data.detail
          : typeof data?.message === "string"
          ? data.message
          : typeof data?.error === "string"
          ? data.error
          : null;
      setError(detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth__card">
        <div className="section-eyebrow">Welcome Back</div>
        <h1 className="auth__title">Log In</h1>
        <p className="auth__subtitle">
          Access your saved analyses and run new repository scans.
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
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <div className="auth__error">
              <span>⚠</span>
              {error}
            </div>
          )}

          <button type="submit" className="auth__btn" disabled={loading}>
            {loading ? (
              <>
                <span className="auth__spinner" />
                Logging in...
              </>
            ) : (
              <>
                Log In
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <p className="auth__switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;