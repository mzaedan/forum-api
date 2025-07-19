
/* eslint-disable react/prop-types */
import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

function EnhancedCommentForm({
  onSubmit,
  user,
  isSubmitting = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      comment: ''
    }
  });

  const commentValue = watch('comment');

  const onFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data.comment);
      reset(); // Reset form after successful submission
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onFormSubmit)}
      className="p-4 border-bottom bg-light"
    >
      <div className="d-flex align-items-start">
        <motion.img
          src={
            user?.avatar ||
            'https://via.placeholder.com/40x40/212529/ffffff?text=JD'
          }
          alt={user?.name || 'User'}
          className="rounded-circle me-3 flex-shrink-0"
          style={{ width: '40px', height: '40px' }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <div className="flex-grow-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <textarea
              {...register('comment', {
                required: 'Komentar tidak boleh kosong',
                minLength: {
                  value: 3,
                  message: 'Komentar minimal 3 karakter'
                },
                maxLength: {
                  value: 500,
                  message: 'Komentar maksimal 500 karakter'
                }
              })}
              className={`form-control mb-2 ${errors.comment ? 'is-invalid' : isValid && commentValue ? 'is-valid' : ''}`}
              rows="3"
              placeholder="Tulis komentar Anda..."
              disabled={isSubmitting}
            />
            {/* Character counter */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className={`${commentValue?.length > 450 ? 'text-warning' : 'text-muted'}`}>
                {commentValue?.length || 0}/500 karakter
              </small>
            </div>

            {/* Error message with animation */}
            {errors.comment && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-danger py-2 mb-2"
              >
                {errors.comment.message}
              </motion.div>
            )}
          </motion.div>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Gunakan bahasa yang sopan dan konstruktif
            </small>
            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className={`btn ${isValid && !isSubmitting ? 'btn-primary' : 'btn-secondary'}`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  className="d-flex align-items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Mengirim...
                </motion.div>
              ) : (
                'Kirim Komentar'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}

export default EnhancedCommentForm;
