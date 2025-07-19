/* eslint-disable no-undef */
// Pengujian ThreadsList
// Skenario:
// 1. Render daftar thread jika ada
// 2. Render pesan kosong jika tidak ada thread

import React from 'react';
import { render, screen } from '@testing-library/react';
import ThreadsList from './ThreadsList';
import { vi } from 'vitest';

describe('ThreadsList', () => {
  const baseProps = {
    getUserById: () => ({ avatar: 'avatar.png', name: 'User' }),
    formatDate: () => '2025-07-19',
    truncateText: (t) => t,
    calculateNetVotes: () => 1,
    hasUserVoted: () => false,
    handleVote: vi.fn(),
    handleRemoveVote: vi.fn(),
    votingLoading: {},
    searchTerm: '',
  };

  it('should render threads if provided', () => {
    render(
      <ThreadsList
        {...baseProps}
        threads={[{ id: '1', title: 'Thread 1', ownerId: 'u1', upVotesBy: [], downVotesBy: [] }]}
      />
    );
    expect(screen.getByText('Thread 1')).toBeInTheDocument();
  });

  it('should render empty message if no threads', () => {
    render(
      <ThreadsList
        {...baseProps}
        threads={[]}
      />
    );
    expect(screen.getByText(/belum ada thread/i)).toBeInTheDocument();
  });
});
