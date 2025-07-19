
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedCommentForm from '../components/EnhancedCommentForm';
import AnimatedThreadCard from '../components/AnimatedThreadCard';

function ReactEcosystemDemo() {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockUser = {
    id: 'demo-user',
    name: 'Demo User',
    avatar: 'https://via.placeholder.com/40x40/007bff/ffffff?text=DU'
  };

  const mockThreads = [
    {
      id: 'thread-1',
      title: 'React Hook Form - Powerful Form Validation',
      body: '<p>React Hook Form adalah library yang sangat powerful untuk menangani form di React. Dengan fitur validasi yang lengkap dan performa yang optimal, library ini sangat cocok untuk aplikasi modern.</p><p>Keunggulan utama: minimal re-renders, built-in validation, dan TypeScript support yang excellent.</p>',
      category: 'react-hook-form',
      createdAt: '2024-01-15T10:30:00.000Z',
      user: {
        id: 'user-1',
        name: 'React Developer',
        avatar: 'https://via.placeholder.com/40x40/28a745/ffffff?text=RD'
      },
      upVotesBy: ['user-2', 'user-3'],
      downVotesBy: [],
      totalComments: 8
    },
    {
      id: 'thread-2',
      title: 'Framer Motion - Animasi yang Menakjubkan',
      body: '<p>Framer Motion membuat animasi di React menjadi sangat mudah dan powerful. Dengan API yang intuitif dan fitur-fitur canggih seperti layout animations dan gesture handling.</p>',
      category: 'framer-motion',
      createdAt: '2024-01-14T15:45:00.000Z',
      user: {
        id: 'user-2',
        name: 'Animation Expert',
        avatar: 'https://via.placeholder.com/40x40/dc3545/ffffff?text=AE'
      },
      upVotesBy: ['user-1', 'user-3', 'demo-user'],
      downVotesBy: [],
      totalComments: 12
    }
  ];

  const handleCommentSubmit = async (comment) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newComment = {
      id: Date.now().toString(),
      text: comment,
      user: mockUser,
      createdAt: new Date().toISOString()
    };
    setComments((prev) => [newComment, ...prev]);
    setIsSubmitting(false);
  };

  const handleVote = (threadId, voteType) => {
    console.log(`Voted ${voteType} on thread ${threadId}`);
    // In real app, this would update the thread state
  };

  const handleThreadClick = (threadId) => {
    console.log(`Clicked thread ${threadId}`);
    // In real app, this would navigate to thread detail
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="container py-4"
    >
      {/* Header */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-5"
      >
        <h1 className="display-4 fw-bold text-primary mb-3">
          React Ecosystem Demo
        </h1>
        <p className="lead text-muted">
          Demonstrasi implementasi <strong>React Hook Form</strong> dan <strong>Framer Motion</strong>
        </p>

        <div className="row justify-content-center mt-4">
          <div className="col-md-6">
            <motion.div
              className="card border-primary"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="card-body">
                <h5 className="card-title text-primary">🎯 React Hook Form</h5>
                <p className="card-text">
                  Form validation dengan performa optimal dan minimal re-renders
                </p>
              </div>
            </motion.div>
          </div>
          <div className="col-md-6">
            <motion.div
              className="card border-success"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="card-body">
                <h5 className="card-title text-success">✨ Framer Motion</h5>
                <p className="card-text">
                  Animasi yang smooth dan interaktif untuk UI yang menarik
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Comment Form Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="mb-5"
      >
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">
              <i className="bi bi-chat-dots me-2"></i>
              Enhanced Comment Form
            </h3>
            <small>Menggunakan React Hook Form + Framer Motion</small>
          </div>
          <div className="card-body p-0">
            <EnhancedCommentForm
              user={mockUser}
              onSubmit={handleCommentSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Comments Display */}
        {comments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <h4 className="mb-3">Komentar Terbaru:</h4>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card mb-2"
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="rounded-circle me-2"
                      style={{ width: '30px', height: '30px' }}
                    />
                    <strong>{comment.user.name}</strong>
                    <small className="text-muted ms-2">
                      {new Date(comment.createdAt).toLocaleString('id-ID')}
                    </small>
                  </div>
                  <p className="mb-0">{comment.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Animated Thread Cards Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-success">
            <i className="bi bi-collection me-2"></i>
            Animated Thread Cards
          </h3>
          <span className="badge bg-success">Framer Motion</span>
        </div>
        <div className="row">
          {mockThreads.map((thread, index) => (
            <div key={thread.id} className="col-12">
              <AnimatedThreadCard
                thread={thread}
                currentUserId="demo-user"
                index={index}
                onVote={handleVote}
                onThreadClick={handleThreadClick}
              />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="text-center mt-5 pt-4 border-top"
      >
        <p className="text-muted">
          Demo implementasi React Ecosystem:
          <strong className="text-primary"> React Hook Form</strong> &
          <strong className="text-success"> Framer Motion</strong>
        </p>
      </motion.footer>
    </motion.div>
  );
}

export default ReactEcosystemDemo;
