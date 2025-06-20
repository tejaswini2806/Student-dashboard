import React from 'react';
import '../index.css'; // Assuming some basic spinner CSS in global styles

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;