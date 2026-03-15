import React from 'react';

const Navbar = () => {
  return (
    <div className='Navbar'>
    
      <div className="collapse" id="navbarToggleExternalContent" data-bs-theme="dark">
        <div className="bg-dark p-4">
          <h5 className="text-white h4">Silent Bug Predictor</h5>
          <span className="text-muted">Analyzing repository risk with ML.</span>
        </div>
      </div>
      
      {/* Main Bar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarToggleExternalContent" 
            aria-controls="navbarToggleExternalContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <span className="navbar-brand mb-0 h1 ms-3">Bug Predictor AI</span>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
