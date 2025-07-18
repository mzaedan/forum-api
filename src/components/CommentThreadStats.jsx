/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';

function ThreadStats({ commentsCount, views }) {
  return (
    <div className="border-top pt-3 mt-4">
      <div className="d-flex align-items-center text-muted">
        <span className="me-4">💬 {commentsCount} komentar</span>
        <span>👁️ {views} views</span>
      </div>
    </div>
  );
}

export default ThreadStats;
