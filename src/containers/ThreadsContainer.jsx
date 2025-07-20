/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchThreadsAndUsers, voteThread, neutralizeThreadVote } from '../reducers/threads';
import { fetchOwnProfile } from '../reducers/auth';
import LoadingState from '../components/LoadingState';
import Pagination from '../components/Pagination';
import AnimatedThreadCard from '../components/AnimatedThreadCard';

function ThreadsContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const threads = useSelector((state) => state.threads.threads);
  const users = useSelector((state) => state.threads.users);
  const status = useSelector((state) => state.threads.status);
  const error = useSelector((state) => state.threads.error);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const [votingLoading, setVotingLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(fetchThreadsAndUsers());
    dispatch(fetchOwnProfile());
  }, [dispatch]);

  // Helper functions
  const getUserById = (userId) => {
    return (
      users.find((user) => user.id === userId) || {
        id: userId,
        name: 'Unknown User',
        avatar: 'https://via.placeholder.com/40x40/6c757d/ffffff?text=?',
      }
    );
  };

  const calculateNetVotes = (upVotes = [], downVotes = []) => {
    return upVotes.length - downVotes.length;
  };

  const hasUserVoted = (thread, voteType) => {
    if (!currentUserId) return false;
    if (voteType === 'up') {
      return thread.upVotesBy?.includes(currentUserId) || false;
    } else {
      return thread.downVotesBy?.includes(currentUserId) || false;
    }
  };

  // Filter and sort threads
  const filteredAndSortedThreads = React.useMemo(() => {
    // Filter threads based on search term
    const filtered = threads.filter((thread) => {
      const user = getUserById(thread.ownerId);
      const searchLower = searchTerm.toLowerCase();
      return (
        thread.title?.toLowerCase().includes(searchLower) ||
        thread.body?.toLowerCase().includes(searchLower) ||
        thread.category?.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower)
      );
    });

    // Sort threads
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'mostComments':
        return (b.totalComments || 0) - (a.totalComments || 0);
      case 'leastComments':
        return (a.totalComments || 0) - (b.totalComments || 0);
      case 'mostVotes':
        return calculateNetVotes(b.upVotesBy, b.downVotesBy) - calculateNetVotes(a.upVotesBy, a.downVotesBy);
      default:
        return 0;
      }
    });
  }, [threads, searchTerm, sortBy, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const renderThreadItem = (thread, index) => {
    const user = getUserById(thread.ownerId);

    return (
      <AnimatedThreadCard
        key={thread.id}
        thread={{
          ...thread,
          user,
          upVotesBy: thread.upVotesBy || [],
          downVotesBy: thread.downVotesBy || [],
          totalComments: thread.totalComments || 0,
          createdAt: thread.createdAt || new Date().toISOString()
        }}
        currentUserId={currentUserId}
        index={index}
        onVote={handleVote}
        onThreadClick={(threadId) => navigate(`/thread/${threadId}`)}
      />
    );
  };

  // Handler
  const handleVote = (threadId, voteType, e) => {
    e.stopPropagation();
    if (!currentUserId) {
      alert('Silakan login terlebih dahulu untuk memberikan vote');
      return;
    }
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return;
    const hasUpVoted = hasUserVoted(thread, 'up');
    const hasDownVoted = hasUserVoted(thread, 'down');
    const isTogglingSameVote = (voteType === 'up' && hasUpVoted) || (voteType === 'down' && hasDownVoted);

    setVotingLoading((prev) => ({ ...prev, [threadId]: voteType }));

    if (isTogglingSameVote) {
      dispatch(neutralizeThreadVote(threadId))
        .catch((err) => {
          alert(err.message || 'Terjadi kesalahan saat menghapus vote');
        })
        .finally(() => {
          setVotingLoading((prev) => ({ ...prev, [threadId]: false }));
        });
    } else if (voteType === 'up' && hasDownVoted) {
      dispatch(neutralizeThreadVote(threadId))
        .then(() => dispatch(voteThread({ threadId, voteType: 'up' })))
        .catch((err) => {
          alert(err.message || 'Terjadi kesalahan saat memberikan vote');
        })
        .finally(() => {
          setVotingLoading((prev) => ({ ...prev, [threadId]: false }));
        });
    } else if (voteType === 'down' && hasUpVoted) {
      dispatch(neutralizeThreadVote(threadId))
        .then(() => dispatch(voteThread({ threadId, voteType: 'down' })))
        .catch((err) => {
          alert(err.message || 'Terjadi kesalahan saat memberikan vote');
        })
        .finally(() => {
          setVotingLoading((prev) => ({ ...prev, [threadId]: false }));
        });
    } else {
      dispatch(voteThread({ threadId, voteType }))
        .catch((err) => {
          alert(err.message || 'Terjadi kesalahan saat memberikan vote');
        })
        .finally(() => {
          setVotingLoading((prev) => ({ ...prev, [threadId]: false }));
        });
    }
  };


  return (
    <div className="container py-4">
      {/* Search and Filter Controls */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center g-4">
            {/* Search Input */}
            <div className="col-md-4">
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
                <button
                  onClick={() => navigate('/add-thread')}
                  className="btn btn-dark"
                >
                  <span className="me-2">➕</span>
                  Buat Thread Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threads List */}
      {status === 'loading' && <LoadingState />}
      {status === 'failed' && <div className="alert alert-danger">{error}</div>}
      {status === 'succeeded' && (
        <div className="row g-4">
          {filteredAndSortedThreads.map((thread, index) => renderThreadItem(thread, index))}
        </div>
      )}
      <div className="mt-4">
        <Pagination />
      </div>
    </div>
  );
}

export default ThreadsContainer;
