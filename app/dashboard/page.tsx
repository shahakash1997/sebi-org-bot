'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardPage from '../components/DashboardPage';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <DashboardPage onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </div>
  );
}
