import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

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
        </div>

        <div className="navbar__right">
          <a
            href="https://github.com/SnehaPoojary20/Silent-Bug-Predictor"
            target="_blank"
            rel="noreferrer"
            className="navbar__cta"
          >
            <span className="navbar__cta-dot" />
            Analyze Repo
          </a>
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
