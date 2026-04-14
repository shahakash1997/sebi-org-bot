'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FeedbackPage from '../components/FeedbackPage';

export default function Feedback() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <FeedbackPage onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </div>
  );
}
