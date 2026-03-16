import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

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
          <Link className="nav-item-link" to="/home">
            Home
          </Link>
          <Link className="nav-item-link" to="/product">
            Product
          </Link>
          <Link className="nav-item-link" to="/working">
            How it Works
          </Link>
          <Link className="nav-item-link" to="/demo">
            Demo
          </Link>
          <Link className="nav-item-link" to="/docs">
            Docs
          </Link>
          <Link className="nav-item-link" to="/github">
            Github
          </Link>
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
