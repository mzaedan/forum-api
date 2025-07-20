import React from 'react';
import Header from '../components/HeaderPage';
import ThreadsContainer from '../containers/ThreadsContainer';

function ThreadListPage() {
  return (
    <>
      <div className="container py-4">
        <Header />
        <ThreadsContainer />
      </div>
    </>
  );
}

export default ThreadListPage;