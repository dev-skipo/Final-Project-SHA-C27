import React from 'react';

const LoadingSpinner = () => {
  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ height: '100vh' }} // Full viewport height
    >
      <div className="spinner-border text-dark spinner-border-lg" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;