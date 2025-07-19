/* eslint-disable linebreak-style */
import AnimatedThreadCard from '../components/AnimatedThreadCard';

export default {
  title: 'Components/AnimatedThreadCard',
  component: AnimatedThreadCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Animated thread card component using Framer Motion for smooth animations and interactions.'
      }
    }
  },
  argTypes: {
    onVote: { action: 'voted' },
    onThreadClick: { action: 'thread clicked' },
    index: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Index for stagger animation'
    }
  }
};

const mockThread = {
  id: 'thread-1',
  title: 'Bagaimana cara belajar React dengan efektif?',
  body: '<p>Saya baru mulai belajar React dan merasa sedikit kewalahan dengan banyaknya konsep yang harus dipahami. Apakah ada tips atau strategi khusus yang bisa membantu saya belajar React dengan lebih efektif?</p><p>Saya sudah mencoba tutorial online, tapi masih merasa perlu panduan yang lebih terstruktur.</p>',
  category: 'react',
  createdAt: '2024-01-15T10:30:00.000Z',
  user: {
    id: 'user-1',
    name: 'Sarah Johnson',
    avatar: 'https://via.placeholder.com/40x40/28a745/ffffff?text=SJ'
  },
  upVotesBy: ['user-2', 'user-3'],
  downVotesBy: [],
  totalComments: 5
};

const mockCurrentUserId = 'user-current';

export const Default = {
  args: {
    thread: mockThread,
    currentUserId: mockCurrentUserId,
    index: 0
  }
};

export const VotedUp = {
  args: {
    thread: {
      ...mockThread,
      upVotesBy: ['user-2', 'user-3', 'user-current']
    },
    currentUserId: mockCurrentUserId,
    index: 0
  }
};

export const VotedDown = {
  args: {
    thread: {
      ...mockThread,
      downVotesBy: ['user-current']
    },
    currentUserId: mockCurrentUserId,
    index: 0
  }
};

export const ShortContent = {
  args: {
    thread: {
      ...mockThread,
      body: '<p>Ini adalah thread dengan konten yang singkat.</p>',
      title: 'Thread dengan konten singkat'
    },
    currentUserId: mockCurrentUserId,
    index: 0
  }
};

export const WithoutAvatar = {
  args: {
    thread: {
      ...mockThread,
      user: {
        id: 'user-1',
        name: 'Anonymous User'
      }
    },
    currentUserId: mockCurrentUserId,
    index: 0
  }
};

export const StaggeredAnimation = {
  render: () => {
    const threads = [
      { ...mockThread, id: 'thread-1', title: 'Thread Pertama' },
      { ...mockThread, id: 'thread-2', title: 'Thread Kedua' },
      { ...mockThread, id: 'thread-3', title: 'Thread Ketiga' }
    ];

    return (
      <div>
        {threads.map((thread, index) => (
          <AnimatedThreadCard
            key={thread.id}
            thread={thread}
            currentUserId={mockCurrentUserId}
            index={index}
            onVote={(threadId, voteType) => console.log(`Voted ${voteType} on ${threadId}`)}
            onThreadClick={(threadId) => console.log(`Clicked thread ${threadId}`)}
          />
        ))}
      </div>
    );
  }
};
