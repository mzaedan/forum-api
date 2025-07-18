/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';

function CommentForm({
  newComment,
  setNewComment,
  isSubmitting,
  onSubmit,
  error,
  user,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-bottom bg-light">
      <div className="d-flex align-items-start">
        <img
          src={
            user?.avatar ||
            'https://via.placeholder.com/40x40/212529/ffffff?text=JD'
          }
          alt={user?.name || 'User'}
          className="rounded-circle me-3 flex-shrink-0"
          style={{ width: '40px', height: '40px' }}
        />
        <div className="flex-grow-1">
          <textarea
            className="form-control mb-3"
            rows="3"
            placeholder="Tulis komentar Anda..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            required
          />
          {error && <div className="alert alert-danger py-2 mb-2">{error}</div>}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Gunakan bahasa yang sopan dan konstruktif
            </small>
            <button
              type="submit"
              className="btn btn-dark"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Mengirim...
                </>
              ) : (
                'Kirim Komentar'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;
