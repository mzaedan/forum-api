import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/HeaderPage';
import ThreadBody from '../components/CommentThreadBody';
import ThreadStats from '../components/CommentThreadStats';
import CommentForm from '../components/CommentForm';
import CommentsList from '../components/CommentsList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreadDetail, createComment } from '../reducers/threads';

function ThreadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const threadDetail = useSelector((state) => state.threads.threadDetail);
  const threadDetailStatus = useSelector((state) => state.threads.threadDetailStatus);
  const threadDetailError = useSelector((state) => state.threads.threadDetailError);
  const user = useSelector((state) => state.auth.user);

  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState(null);

  const { status } = useSelector((state) => state.threads);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Komentar tidak boleh kosong');
      return;
    }

    try {
      await dispatch(createComment({ threadId: id, content: newComment }));
      setNewComment('');
      setCommentError(null);
      dispatch(fetchThreadDetail(id));
    } catch (error) {
      setCommentError(error.message || 'Gagal mengirim komentar');
    }
  };
  const isSubmitting = status === 'loading';

  useEffect(() => {
    dispatch(fetchThreadDetail(id));
  }, [dispatch, id]);

  const comments = threadDetail?.comments?.map((comment) => ({
    ...comment,
    body: comment.body || comment.content || '',
    owner: {
      ...comment.owner,
      avatar:
        comment.owner.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          comment.owner.name || 'U'
        )}&background=FFC107&color=fff&size=40`,
      username:
        comment.owner.username ||
        (comment.owner.email
          ? comment.owner.email.split('@')[0]
          : 'user'),
    },
  })) || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  };

  if (threadDetailError) return <div className="alert alert-danger">{threadDetailError}</div>;
  if (threadDetailStatus === 'loading') return <div className="text-center py-5">Loading...</div>;
  if (!threadDetail) return null;

  return (
    <div className="thread-detail-container">
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="container py-4">
        {/* Header */}
        <Header />

        <div className="container py-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary mb-4"
          >
            <i className="bi bi-arrow-left me-2"></i>Kembali
          </button>
          {/* Thread Detail */}
          {threadDetail && (
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="card mb-4">
                  <div className="card-body p-4">
                    {/* Thread Header */}
                    <div className="d-flex align-items-center mb-4">
                      <img
                        src={threadDetail.owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(threadDetail.owner?.name || 'U')}&background=FFC107&color=fff&size=40`}
                        alt={threadDetail.owner?.name || 'User'}
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                      <div>
                        <h4 className="mb-1 fw-bold">{threadDetail.title}</h4>
                        <div className="d-flex align-items-center text-muted small">
                          <span className="me-2">Dibuat oleh {threadDetail.owner?.name || 'Pengguna'}</span>
                          <span>•</span>
                          <span className="ms-2">{formatDate(threadDetail.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Thread Body */}
                    <ThreadBody body={threadDetail.body} />
                    {/* Thread Stats */}
                    <ThreadStats
                      commentsCount={comments.length}
                      views={threadDetail.views || 0}
                    />
                  </div>
                </div>

                {/* Comments Section */}
                <div className="card">
                  <div className="card-header bg-white border-bottom">
                    <h5 className="mb-0 fw-bold text-dark">
                      Komentar ({comments.length})
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    {/* Add Comment Form */}
                    <CommentForm
                      newComment={newComment}
                      setNewComment={setNewComment}
                      isSubmitting={isSubmitting}
                      onSubmit={handleSubmitComment}
                      error={commentError}
                      user={user}
                    />
                    {/* Comments List */}
                    <CommentsList comments={comments} formatDate={formatDate} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThreadDetailPage;