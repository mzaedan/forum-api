/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';

function Pagination({ currentPage = 1, totalPages = 3, onPageChange }) {
  return (
    <div className="d-flex justify-content-center mt-4">
      <nav aria-label="Thread pagination">
        <ul className="pagination">
          <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, idx) => (
            <li
              key={idx + 1}
              className={`page-item${currentPage === idx + 1 ? ' active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item${
              currentPage === totalPages ? ' disabled' : ''
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
