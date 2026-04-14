'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPage from './components/ChatPage';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <ChatPage onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </div>
  );
}
