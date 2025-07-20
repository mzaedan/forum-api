import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import ThreadsList from '../components/ThreadsList';
import Header from '../components/HeaderPage';
import { AuthProvider } from '../contexts/AuthContext';

// Import the actual reducers
import authReducer from '../reducers/auth';
import threadsReducer from '../reducers/threads';

// Mock Redux store with actual reducers
const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    // Add other reducers if needed
  },
  preloadedState: {
    auth: {
      status: 'succeeded',
      user: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
      },
      error: null
    },
    threads: {
      status: 'succeeded',
      threads: [],
      users: {
        'user-1': {
          id: 'user-1',
          name: 'John Doe',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
        },
        'user-2': {
          id: 'user-2',
          name: 'Jane Smith',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=FF6B6B&color=fff',
        }
      },
      error: null
    }
  }
});

// Helper functions
const getUserById = (userId) => ({
  id: userId,
  name: userId === 'user-1' ? 'John Doe' : 'Jane Smith',
  avatar: userId === 'user-1'
    ? 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff'
    : 'https://ui-avatars.com/api/?name=Jane+Smith&background=FF6B6B&color=fff',
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

const calculateNetVotes = (upVotes = [], downVotes = []) => upVotes.length - downVotes.length;

const hasUserVoted = (thread, voteType) => {
  const userId = 'user-1'; // Current user ID
  return voteType === 'up'
    ? thread.upVotesBy.includes(userId)
    : thread.downVotesBy.includes(userId);
};

// Wrapper component to provide all necessary contexts with Bootstrap styling
// eslint-disable-next-line react/prop-types
const StoryWrapper = ({ children }) => (
  <Provider store={mockStore}>
    <BrowserRouter>
      <AuthProvider>
        <div className="min-vh-100 bg-light">
          <Header />
          <main className="py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);

export default {
  title: 'Pages/ThreadsList',
  component: ThreadsList,
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
};

// Template for stories
const Template = (args) => (
  <ThreadsList
    {...args}
    getUserById={getUserById}
    formatDate={formatDate}
    truncateText={truncateText}
    calculateNetVotes={calculateNetVotes}
    hasUserVoted={hasUserVoted}
    handleVote={() => {}}
    handleRemoveVote={() => {}}
    votingLoading={{}}
  />
);

// Mock data
const mockThreads = [
  {
    id: 'thread-1',
    title: 'Bagaimana pengalamanmu belajar Redux?',
    body: 'Saya baru saja memulai belajar Redux di Dicoding. Rasanya cukup menantang tapi sangat menarik! Bagaimana dengan pengalaman teman-teman semua? Ada tips dan trik yang bisa dibagikan?',
    category: 'redux',
    ownerId: 'user-1',
    upVotesBy: ['user-2', 'user-4'],
    downVotesBy: [],
    totalComments: 8,
    createdAt: '2025-05-29T10:30:00.000Z',
  },
  {
    id: 'thread-2',
    title: 'Halo! Selamat datang dan silakan perkenalkan diri kamu',
    body: 'Halo semuanya! Selamat datang di forum diskusi Dicoding. Mari kita saling mengenal. Saya Zaedan, seorang Full-stack Developer yang senang berbagi pengetahuan. Bagaimana dengan kalian?',
    category: 'perkenalan',
    ownerId: 'user-3',
    upVotesBy: ['user-1', 'user-2', 'user-4'],
    downVotesBy: [],
    totalComments: 15,
    createdAt: '2025-05-29T09:15:00.000Z',
  },
  {
    id: 'thread-3',
    title: 'Tips mengoptimalkan performa React',
    body: 'Beberapa teknik yang bisa digunakan untuk mengoptimalkan performa aplikasi React antara lain: React.memo, useMemo, useCallback, dan code splitting. Ada yang punya pengalaman menerapkan ini?',
    category: 'react',
    ownerId: 'user-4',
    upVotesBy: ['user-1', 'user-3'],
    downVotesBy: [],
    totalComments: 5,
    createdAt: '2025-05-28T14:20:00.000Z',
  },
  {
    id: 'thread-4',
    title: 'Perbedaan antara React Context dan Redux',
    body: 'Saya masih bingung kapan sebaiknya menggunakan React Context dan kapan menggunakan Redux. Apakah ada yang bisa menjelaskan perbedaan utamanya dan use case yang tepat untuk masing-masing?',
    category: 'react',
    ownerId: 'user-2',
    upVotesBy: ['user-1', 'user-3', 'user-4'],
    downVotesBy: [],
    totalComments: 12,
    createdAt: '2025-05-27T16:45:00.000Z',
  },
];

const mockUsers = {
  'user-1': {
    id: 'user-1',
    name: 'Dimas Saputra',
    email: 'dimas@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Dimas+Saputra&background=0D8ABC&color=fff'
  },
  'user-2': {
    id: 'user-2',
    name: 'Dicoding Team',
    email: 'team@dicoding.com',
    avatar: 'https://ui-avatars.com/api/?name=Dicoding+Team&background=FF6B6B&color=fff'
  },
  'user-3': {
    id: 'user-3',
    name: 'Zaedan',
    email: 'zaedan@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Zaedan&background=00C896&color=fff'
  },
  'user-4': {
    id: 'user-4',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=9C27B0&color=fff'
  },
};

export const Default = Template.bind({});
Default.args = {
  threads: mockThreads,
  getUserById: (id) => mockUsers[id],
  formatDate: (date) => new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date)),
  truncateText: (text, maxLength = 100) => text.length > maxLength ? `${text.substring(0, maxLength)}...` : text,
  calculateNetVotes: (upVotes, downVotes) => upVotes.length - downVotes.length,
  hasUserVoted: (thread, voteType) => {
    const userId = 'user-1';
    return voteType === 'up' ? thread.upVotesBy.includes(userId) : thread.downVotesBy.includes(userId);
  },
  handleVote: () => {},
  handleRemoveVote: () => {},
  votingLoading: {},
  searchTerm: '',
};

// Story: Daftar thread kosong
export const Empty = Template.bind({});
Empty.args = {
  ...Default.args,
  threads: [],
};

// Import ControlsThread component
import ControlsThread from '../components/ControlsThread';

// Story: Daftar thread dengan pencarian dan pengurutan
export const WithSearch = (args) => {
  // Create a mock users object from the threads
  const mockUsers = {};
  args.threads.forEach((thread) => {
    if (!mockUsers[thread.ownerId]) {
      mockUsers[thread.ownerId] = {
        id: thread.ownerId,
        name: args.getUserById(thread.ownerId).name,
        avatar: args.getUserById(thread.ownerId).avatar
      };
    }
  });

  return (
    <div className="container">
      <ControlsThread
        threads={args.threads}
        users={mockUsers}
        getUserById={args.getUserById}
        formatDate={args.formatDate}
        truncateText={args.truncateText}
        calculateNetVotes={args.calculateNetVotes}
        hasUserVoted={args.hasUserVoted}
        handleVote={args.handleVote}
        handleRemoveVote={args.handleRemoveVote}
        votingLoading={args.votingLoading}
        currentUserId="user-1" // Mock current user ID
      />
    </div>
  );
};

WithSearch.args = {
  ...Default.args,
  // Add any additional args needed for ControlsThread
};
