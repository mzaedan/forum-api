/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';

import ThreadsList from './ThreadsList';

function ControlsThread({
  threads,
  users,
  getUserById,
  formatDate,
  truncateText,
  calculateNetVotes,
  hasUserVoted,
  handleVote,
  handleRemoveVote,
  votingLoading,
  currentUserId,
}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('newest');

  // Filtering logic
  const filteredThreads = threads.filter((thread) => {
    const user = getUserById(thread.ownerId);
    return (
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting logic
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    switch (sortBy) {
    case 'newest':
      return new Date(b.createdAt) - new Date(a.createdAt);
    case 'oldest':
      return new Date(a.createdAt) - new Date(b.createdAt);
    case 'mostComments':
      return b.totalComments - a.totalComments;
    case 'leastComments':
      return a.totalComments - b.totalComments;
    case 'mostVotes':
      return calculateNetVotes(b.upVotesBy, b.downVotesBy) - calculateNetVotes(a.upVotesBy, a.upVotesBy);
    default:
      return 0;
    }
  });
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <>
      <div className="card mt-4">
        <div className="card-body">
          <div className="row align-items-center g-4 mb-4">
            {/* Search Input */}
            <div className="col-md-4 mt-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari thread..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Sort Select */}
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="mostComments">Paling Banyak Komentar</option>
                <option value="leastComments">Paling Sedikit Komentar</option>
                <option value="mostVotes">Paling Banyak Votes</option>
              </select>
            </div>

            {/* Create Thread Button */}
            <div className="col-md-5">
              <div className="d-flex justify-content-md-end">
                <a href="/add-thread" className="btn btn-dark">
                  <span className="me-2">➕</span>
                  Buat Thread Baru
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Render filtered/sorted threads */}
      <ThreadsList
        threads={sortedThreads}
        users={users}
        getUserById={getUserById}
        formatDate={formatDate}
        truncateText={truncateText}
        calculateNetVotes={calculateNetVotes}
        hasUserVoted={hasUserVoted}
        handleVote={handleVote}
        handleRemoveVote={handleRemoveVote}
        votingLoading={votingLoading}
        currentUserId={currentUserId}
      />
    </>
  );
}

export default ControlsThread;
