'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DocumentsPage from '../components/DocumentsPage';

export default function Documents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <DocumentsPage onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </div>
  );
}
