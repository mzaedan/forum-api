/* eslint-disable linebreak-style */
import EnhancedCommentForm from '../components/EnhancedCommentForm';

export default {
  title: 'Components/EnhancedCommentForm',
  component: EnhancedCommentForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Enhanced comment form using React Hook Form for validation and Framer Motion for animations.'
      }
    }
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    isSubmitting: {
      control: 'boolean',
      description: 'Loading state of the form'
    }
  }
};

const mockUser = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://via.placeholder.com/40x40/007bff/ffffff?text=JD'
};

export const Default = {
  args: {
    user: mockUser,
    isSubmitting: false,
    onSubmit: async (comment) => {
      console.log('Comment submitted:', comment);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

export const WithoutAvatar = {
  args: {
    user: { id: '1', name: 'Anonymous User' },
    isSubmitting: false,
    onSubmit: async (comment) => {
      console.log('Comment submitted:', comment);
    }
  }
};

export const LoadingState = {
  args: {
    user: mockUser,
    isSubmitting: true,
    onSubmit: async (comment) => {
      console.log('Comment submitted:', comment);
    }
  }
};

export const Interactive = {
  args: {
    user: mockUser,
    isSubmitting: false,
  },
  render: (args) => {
    const handleSubmit = async (comment) => {
      alert(`Comment submitted: "${comment}"`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
    };

    return <EnhancedCommentForm {...args} onSubmit={handleSubmit} />;
  }
};
