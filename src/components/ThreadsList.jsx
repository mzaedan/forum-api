/* eslint-disable react/prop-types */
import React from 'react';

function ThreadsList({
  threads,
  getUserById,
  formatDate,
  truncateText,
  calculateNetVotes,
  hasUserVoted,
  handleVote,
  handleRemoveVote,
  votingLoading,
  searchTerm,

}) {
  const handleThreadClick = (threadId) => {
    window.location.href = `/thread/${threadId}`;
  };

  return (
    <div className="container py-4">
      {/* Thread List */}
      <div className="row">
        <div className="col-12">
          {threads.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <p className="text-muted mb-0">
                  {searchTerm
                    ? `Tidak ada thread yang cocok dengan "${searchTerm}"`
                    : 'Belum ada thread'}
                </p>
              </div>
            </div>
          ) : (
            <div className="thread-items">
              {threads.map((thread) => {
                const user = getUserById(thread.ownerId);
                const netVotes = calculateNetVotes(thread.upVotesBy, thread.downVotesBy);
                const hasUpVoted = hasUserVoted(thread, 'up');
                const hasDownVoted = hasUserVoted(thread, 'down');
                const isVotingLoading = votingLoading[thread.id];

                return (
                  <div
                    key={thread.id}
                    className="card mb-3 thread-item shadow-sm"
                    onClick={() => handleThreadClick(thread.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <div className="d-flex align-items-start">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="rounded-circle me-3 flex-shrink-0"
                              style={{ width: '48px', height: '48px' }}
                            />
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-1">
                                <h5 className="mb-0 thread-title">{thread.title}</h5>
                              </div>
                              <div className="mb-2">
                                <small className="text-muted">
                                  oleh <strong>{user.name}</strong> • {formatDate(thread.createdAt)}
                                </small>
                              </div>
                              <div className="mb-2">
                                <span className="badge bg-primary me-2">{thread.category}</span>
                                <span className="badge bg-light text-dark">
                                  💬 {thread.totalComments} komentar
                                </span>
                              </div>
                              <div className="mb-2">
                                <p className="text-muted mb-0">
                                  {truncateText(thread.body ? new DOMParser().parseFromString(thread.body, 'text/html').body.textContent || '' : '')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="d-flex flex-column align-items-end h-100">
                            {/* Voting Section */}
                            <div className="mb-3">
                              <div className="d-flex align-items-center gap-3 mb-2">
                                {/* Upvote Button */}
                                <button
                                  className={`btn btn-sm ${hasUpVoted ? 'btn-success' : 'btn-outline-success'}`}
                                  onClick={(e) => hasUpVoted ? handleRemoveVote(thread.id, e) : handleVote(thread.id, 'up', e)}
                                  disabled={isVotingLoading}
                                  title={hasUpVoted ? 'Batalkan upvote' : 'Upvote'}
                                  style={{ minWidth: '60px' }}
                                >
                                  {isVotingLoading === 'up' ? (
                                    <span className="spinner-border spinner-border-sm" />
                                  ) : (
                                    <>👍 {thread.upVotesBy.length}</>
                                  )}
                                </button>

                                {/* Downvote Button */}
                                <button
                                  className={`btn btn-sm ${hasDownVoted ? 'btn-danger' : 'btn-outline-danger'}`}
                                  onClick={(e) => hasDownVoted ? handleRemoveVote(thread.id, e) : handleVote(thread.id, 'down', e)}
                                  disabled={isVotingLoading}
                                  title={hasDownVoted ? 'Batalkan downvote' : 'Downvote'}
                                  style={{ minWidth: '60px' }}
                                >
                                  {isVotingLoading === 'down' ? (
                                    <span className="spinner-border spinner-border-sm" />
                                  ) : (
                                    <>👎 {thread.downVotesBy.length}</>
                                  )}
                                </button>
                              </div>

                              {/* Net Votes Display */}
                              <div className="text-center">
                                <span className="badge bg-light text-dark">
                                  📊
                                  <span className={`ms-1 ${netVotes > 0 ? 'text-success' : netVotes < 0 ? 'text-danger' : 'text-muted'}`}>
                                    {netVotes > 0 ? '+' : ''}
                                    {netVotes} net votes
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* User Info */}
                            <div className="mt-auto">
                              <div className="d-flex align-items-center">
                                <span className="text-muted me-2">👤</span>
                                <small className="text-muted">{user.name}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThreadsList;