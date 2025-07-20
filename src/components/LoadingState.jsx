/* eslint-disable linebreak-style */
import React from 'react';

function LoadingState() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-dark" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Memuat thread...</p>
      <div
        className="progress mx-auto"
        style={{ width: '200px', height: '4px' }}
      >
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-dark"
          role="progressbar"
          style={{ width: '100%' }}
        ></div>
      </div>
    </div>
  );
}

export default LoadingState;
