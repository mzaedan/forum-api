/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';

function CommentsList({ comments, formatDate }) {
  if (!comments.length) {
    return (
      <div className="text-center py-5">
        <p className="text-muted mb-0">
          Belum ada komentar. Jadilah yang pertama berkomentar!
        </p>
      </div>
    );
  }
  return (
    <div className="comments-list">
      {comments.map((comment, index) => (
        <div
          key={comment.id}
          className={`p-4 ${
            index < comments.length - 1 ? 'border-bottom' : ''
          }`}
        >
          <div className="d-flex align-items-start">
            <img
              src={comment.owner.avatar}
              alt={comment.owner.name}
              className="rounded-circle me-3 flex-shrink-0"
              style={{ width: '40px', height: '40px' }}
            />
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <strong className="text-dark me-2">{comment.owner.name}</strong>
                <span className="text-muted me-2">
                  @{comment.owner.username || 'user'}
                </span>
                <span className="text-muted">•</span>
                <span className="text-muted ms-2">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="mb-0 text-dark lh-lg">{comment.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentsList;
