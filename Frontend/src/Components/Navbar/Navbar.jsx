import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="nav-inner">

        {/* Logo */}
        <div className="nav-logo">
          Silent Bug Predictor
        </div>

        {/* Links */}
        <div className="nav-links">
          <a href="#product">Product</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#demo">Demo</a>
          <a href="#docs">Docs</a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>

        {/* CTA */}
        <div className="nav-cta">
          <a href="#analyze">Analyze Repo</a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
