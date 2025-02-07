import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-3"> 
      <div className="container-fluid">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
       
          <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mb-3 mb-md-0">
            <a href="/" className="text-white text-decoration-none">Features</a>
            <a href="/about" className="text-white text-decoration-none">Help Center</a>
            <a href="/services" className="text-white text-decoration-none">Terms of Use</a>
            <a href="/contact" className="text-white text-decoration-none">Privacy Policy</a>
          </div>

          
          <div className="d-none d-md-block mx-3"></div>

        
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3">
            <span className="text-white text-decoration-none">LinkBio - ©2025</span> 
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;