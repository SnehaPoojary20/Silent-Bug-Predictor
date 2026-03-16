import React from "react";
import "./Footer.css";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h4>Silent Bug Predictor</h4>
          <p>
            AI powered system that detects bug-prone files using commit churn,
            repository structure, and machine learning models.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h5>Product</h5>
          <a href="#methodology">Methodology</a>
          <a href="#docs">API Docs</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub API</a>
        </div>

        {/* Social */}
        <div className="footer-social">
          <h5>Connect</h5>
          <div className="social-icons">
            <a href="#"><FaGithub /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {year} Silent Bug Predictor. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
