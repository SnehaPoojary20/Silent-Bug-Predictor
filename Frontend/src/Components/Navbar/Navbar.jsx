import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../../api/auth.js";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <Link to="/home" className="navbar__brand">
          <span className="navbar__brand-icon">⬡</span>
          <span className="navbar__brand-text">
            Silent<span className="navbar__brand-accent">Bug</span>
          </span>
        </Link>

        <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {[
            { to: "/home", label: "Home" },
            { to: "/product", label: "Product" },
            { to: "/working", label: "How It Works" },
            { to: "/analyze", label: "Analyze" },
            { to: "/docs", label: "Docs" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar__link ${isActive(to) ? "navbar__link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          {loggedIn && (
            <Link
              to="/profile"
              className={`navbar__link ${isActive("/profile") ? "navbar__link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          )}
        </div>

        <div className="navbar__right">
          {loggedIn ? (
            <button className="navbar__cta" onClick={handleLogout}>
              <span className="navbar__cta-dot" />
              Log Out
            </button>
          ) : (
            <Link to="/login" className="navbar__cta" onClick={() => setMenuOpen(false)}>
              <span className="navbar__cta-dot" />
              Log In
            </Link>
          )}

          <button
            className="navbar__burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
