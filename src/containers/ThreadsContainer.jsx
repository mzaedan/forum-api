import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchThreadsAndUsers, voteThread, neutralizeThreadVote } from '../reducers/threads';
import { fetchOwnProfile } from '../reducers/auth';
import ControlsThread from '../components/ControlsThread';
import LoadingState from '../components/LoadingState';
import Pagination from '../components/Pagination';

function ThreadsContainer() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.threads.threads);
  const users = useSelector((state) => state.threads.users);
  const status = useSelector((state) => state.threads.status);
  const error = useSelector((state) => state.threads.error);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const [votingLoading, setVotingLoading] = useState({});

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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)  }...`;
  };

  const calculateNetVotes = (upVotes, downVotes) => {
    return upVotes.length - downVotes.length;
  };

  const hasUserVoted = (thread, voteType) => {
    if (!currentUserId) return false;
    if (voteType === 'up') {
      return thread.upVotesBy.includes(currentUserId);
    } else {
      return thread.downVotesBy.includes(currentUserId);
    }
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

    if ((voteType === 'up' && hasUpVoted) || (voteType === 'down' && hasDownVoted)) {
      return; // Jangan lakukan apa-apa jika sudah memilih vote yang sama
    }

    setVotingLoading((prev) => ({ ...prev, [threadId]: voteType }));

    if (voteType === 'up' && hasDownVoted) {
      // Jika sudah downvote, netralkan dulu baru upvote
      dispatch(neutralizeThreadVote(threadId))
        .then(() => dispatch(voteThread({ threadId, voteType: 'up' })))
        .catch((err) => {
          alert(err.message || 'Terjadi kesalahan saat memberikan vote');
        })
        .finally(() => {
          setVotingLoading((prev) => ({ ...prev, [threadId]: false }));
        });
    } else if (voteType === 'down' && hasUpVoted) {
      // Jika sudah upvote, netralkan dulu baru downvote
      dispatch(neutralizeThreadVote(threadId))
        .then(() => dispatch(voteThread({ threadId, voteType: 'down' })))
        .catch((err) => {
          alert(err.message || 'Terjadi kesalahan saat memberikan vote');
        })
        .finally(() => {
          setVotingLoading((prev) => ({ ...prev, [threadId]: false }));
        });
    } else {
      // Jika belum memilih, langsung vote
      dispatch(voteThread({ threadId, voteType }))
        .catch((err) => {
          alert(err.message || 'Terjadi kesalahan saat memberikan vote');
        })
        .finally(() => {
          setVotingLoading((prev) => ({ ...prev, [threadId]: false }));
        });
    }
  };

  const handleRemoveVote = (threadId, e) => {
    e.stopPropagation();
    if (!currentUserId) return;

    setVotingLoading((prev) => ({ ...prev, [threadId]: 'remove' }));

    dispatch(neutralizeThreadVote(threadId))
      .catch((err) => {
        alert(err.message || 'Terjadi kesalahan saat menghapus vote');
      })
      .finally(() => {
        setVotingLoading((prev) => ({ ...prev, [threadId]: false }));
      });
  };

  return (
    <div>
      {status === 'loading' && <LoadingState />}
      {status === 'failed' && <div className="alert alert-danger">{error}</div>}
      {status === 'succeeded' && (
        <ControlsThread
          threads={threads}
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
      )}
      <Pagination />
    </div>
  );
}

export default ThreadsContainer;
