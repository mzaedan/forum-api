
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

function AnimatedThreadCard({
  thread,
  onVote,
  onThreadClick,
  currentUserId,
  index = 0
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // Stagger animation
        ease: 'easeOut'
      }
    },
    hover: {
      y: -5,
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    collapsed: {
      height: 'auto',
      opacity: 1
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const voteButtonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        delay: 0.2
      }
    }
  };

  const handleVote = (e, voteType) => {
    e.stopPropagation();
    if (onVote) {
      onVote(thread.id, voteType, e);
    }
  };

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)  }...`;
  };

  const cleanBody = DOMPurify.sanitize(thread.body);
  const isLongContent = thread.body.length > 200;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="card mb-3 border-0 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body">
        {/* Header with animated elements */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <motion.img
              src={thread.user?.avatar || 'https://via.placeholder.com/40x40/212529/ffffff?text=U'}
              alt={thread.user?.name || 'User'}
              className="rounded-circle me-3"
              style={{ width: '40px', height: '40px' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <div>
              <motion.h6
                className="mb-1 fw-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {thread.user?.name || 'Anonymous'}
              </motion.h6>
              <motion.small
                className="text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {new Date(thread.createdAt).toLocaleDateString('id-ID')}
              </motion.small>
            </div>
          </div>

          {/* Animated category badge */}
          <motion.span
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="badge bg-primary"
          >
            #{thread.category}
          </motion.span>
        </div>

        {/* Title with hover effect */}
        <motion.h5
          className="card-title mb-3"
          onClick={() => onThreadClick && onThreadClick(thread.id)}
          whileHover={{ color: '#0d6efd' }}
          transition={{ duration: 0.2 }}
        >
          {thread.title}
        </motion.h5>

        {/* Animated content */}
        <motion.div
          variants={contentVariants}
          animate={isExpanded ? 'expanded' : 'collapsed'}
          className="card-text mb-3"
        >
          <div className="thread-body">
            {parse(isExpanded ? cleanBody : truncateText(cleanBody))}
          </div>

          {isLongContent && (
            <motion.button
              className="btn btn-link p-0 mt-2 text-decoration-none"
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isExpanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
            </motion.button>
          )}
        </motion.div>

        {/* Animated stats and controls */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {/* Vote buttons with animation */}
            <div className="d-flex align-items-center">
              <motion.button
                variants={voteButtonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className={`btn btn-sm ${thread.upVotesBy?.includes(currentUserId) ? 'btn-success' : 'btn-outline-success'}`}
                onClick={(e) => handleVote(e, 'up')}
              >
                <motion.span
                  animate={{ rotate: thread.upVotesBy?.includes(currentUserId) ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  👍
                </motion.span>
              </motion.button>

              <motion.span
                className="mx-2 fw-bold"
                key={thread.upVotesBy?.length - thread.downVotesBy?.length}
                initial={{ scale: 1.2, color: '#28a745' }}
                animate={{ scale: 1, color: 'inherit' }}
                transition={{ duration: 0.3 }}
              >
                {(thread.upVotesBy?.length || 0) - (thread.downVotesBy?.length || 0)}
              </motion.span>

              <motion.button
                variants={voteButtonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className={`btn btn-sm ${thread.downVotesBy?.includes(currentUserId) ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={(e) => handleVote(e, 'down')}
              >
                <motion.span
                  animate={{ rotate: thread.downVotesBy?.includes(currentUserId) ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  👎
                </motion.span>
              </motion.button>
            </div>

            {/* Comments count with pulse animation */}
            <motion.div
              className="d-flex align-items-center text-muted"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                💬
              </motion.span>
              <span className="ms-1">{thread.totalComments || 0}</span>
            </motion.div>
          </div>

          {/* Animated "Read More" button */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="btn btn-outline-primary btn-sm"
                onClick={() => onThreadClick && onThreadClick(thread.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Baca Thread
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default AnimatedThreadCard;
