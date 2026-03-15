import React from 'react';
import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          {/* Brand and Description */}
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <h5 className="text-uppercase fw-bold mb-2">
              <span className="text-primary">Silent</span> Bug Predictor
            </h5>
            <p className="small text-muted mb-0">
              Leveraging XGBoost to identify structural risks and commit churn patterns in modern repositories.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <ul className="list-inline mb-0">
              <li className="list-inline-item mx-2">
                <a href="#about" className="text-muted text-decoration-none small hover-white">Methodology</a>
              </li>
              <li className="list-inline-item mx-2">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted text-decoration-none small hover-white">GitHub API</a>
              </li>
              <li className="list-inline-item mx-2">
                <a href="#docs" className="text-muted text-decoration-none small hover-white">API Docs</a>
              </li>
            </ul>
          </div>

          {/* Status & Copyright */}
          <div className="col-md-4 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center mb-2">
              <span className="badge rounded-pill bg-success me-2" style={{ fontSize: '0.7rem' }}>Backend Online</span>
              <span className="text-muted small">v1.0.0</span>
            </div>
            <p className="small text-muted mb-0">
              &copy; {currentYear} Silent Bug Predictor. Engineered for code quality.
            </p>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom border or extra style */}
      <style jsx="true">{`
        .hover-white:hover {
          color: #fff !important;
          transition: 0.3s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
