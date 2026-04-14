'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SettingsPage from '../components/SettingsPage';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <SettingsPage onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </div>
  );
}
