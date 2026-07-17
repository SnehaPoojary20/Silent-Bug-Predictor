import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__brand-logo">
            <span className="footer__brand-hex">⬡</span>
            <span className="footer__brand-name">
              Silent<span>Bug</span>
            </span>
          </div>
          <p className="footer__brand-desc">
            ML-powered bug prediction for GitHub repositories.
            Built with FastAPI, XGBoost, and Python AST.
          </p>
          <div className="footer__social">
            <a
              href="https://github.com/SnehaPoojary20/Silent-Bug-Predictor"
              target="_blank"
              rel="noreferrer"
              className="footer__social-link"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/snehapoojary2020"
              target="_blank"
              rel="noreferrer"
              className="footer__social-link"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="footer__nav">
          <div className="footer__col">
            <h5 className="footer__col-title">Product</h5>
            <Link to="/product" className="footer__link">Features</Link>
            <Link to="/working" className="footer__link">How It Works</Link>
            <Link to="/analyze" className="footer__link">Analyze Repo</Link>
          </div>
          <div className="footer__col">
            <h5 className="footer__col-title">Developer</h5>
            <Link to="/docs" className="footer__link">API Docs</Link>
            <a
              href="https://github.com/SnehaPoojary20/Silent-Bug-Predictor"
              target="_blank"
              rel="noreferrer"
              className="footer__link"
            >
              Source Code
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span className="footer__copy">© {year} Silent Bug Predictor</span>
        <span className="footer__built">
          Built by{" "}
          <a
            href="https://github.com/SnehaPoojary20"
            target="_blank"
            rel="noreferrer"
          >
            Sneha Poojary
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
