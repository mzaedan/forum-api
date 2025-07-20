import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import '../index.css';

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    auth: (state = { 
      status: 'idle',
      user: null,
      error: null
    }, _action) => state,
  },
});

// Wrapper untuk memastikan komponen terlihat baik di Storybook
const withThemeProvider = (Story) => (
  <div className="bg-light min-vh-100 d-flex align-items-center">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Story />
        </div>
      </div>
    </div>
  </div>
);

// Create a decorator that can handle different states
const withReduxAndRouter = (Story, context) => {
  // Get the story-specific state from parameters
  const storyState = context.parameters.reduxState || {};
  
  const storyStore = configureStore({
    reducer: {
      auth: (state = {
        status: 'idle',
        user: null,
        error: null,
        ...storyState.auth
      }, _action) => state,
    },
  });

  return (
    <Provider store={storyStore}>
      <BrowserRouter>
        <withThemeProvider>
          <Story />
        </withThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default {
  title: 'Pages/LoginPage',
  component: LoginPage,
  decorators: [withReduxAndRouter],
  parameters: {
    // Default state for all stories
    reduxState: {
      auth: {
        status: 'idle',
        user: null,
        error: null
      }
    }
  },
};

// Template untuk stories
const Template = (args) => <LoginPage {...args} />;

// Story: Halaman login default
export const Default = Template.bind({});
Default.args = {};

// Story: Halaman login dengan loading state
export const Loading = Template.bind({});
Loading.parameters = {
  reduxState: {
    auth: {
      status: 'loading',
      user: null,
      error: null
    }
  }
};

// Create a wrapper component that simulates the error state
const WithErrorWrapper = (args) => {
  // Create a ref to access the form container
  const containerRef = React.useRef(null);
  
  // Use effect to simulate the error state after component mounts
  React.useEffect(() => {
    // Wait for the form to be rendered
    const checkForm = setInterval(() => {
      const form = containerRef.current?.querySelector('form');
      if (form) {
        clearInterval(checkForm);
        
        // Check if error message already exists
        const existingError = containerRef.current.querySelector('.alert.alert-danger');
        if (existingError) return;
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger py-2 mb-3';
        errorDiv.role = 'alert';
        errorDiv.textContent = 'Email atau password salah';
        
        // Insert error message above the form
        form.parentNode.insertBefore(errorDiv, form);
      }
    }, 100);
    
    // Cleanup function
    return () => clearInterval(checkForm);
  }, []);
  
  return (
    <div ref={containerRef}>
      <LoginPage {...args} />
    </div>
  );
};

// Story: Halaman login dengan error
export const WithError = (args) => <WithErrorWrapper {...args} />;

// Add parameters for the error story
WithError.parameters = {
  reduxState: {
    auth: {
      status: 'idle',
      user: null,
      error: null
    }
  }
};
