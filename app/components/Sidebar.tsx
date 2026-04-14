'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Avatar from '@radix-ui/react-avatar';
import * as Separator from '@radix-ui/react-separator';
import {
  MessageSquare,
  BarChart3,
  FolderOpen,
  Star,
  Settings,
} from 'lucide-react';

const navItems = [
  {
    section: 'Main',
    items: [
      { label: 'Chat', href: '/', icon: MessageSquare },
      { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    ],
  },
  {
    section: 'Management',
    items: [
      { label: 'Documents', href: '/documents', icon: FolderOpen, badge: '24' },
      { label: 'Feedback', href: '/feedback', icon: Star },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Tooltip.Provider delayDuration={400}>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'var(--bg-overlay)',
            zIndex: 49, display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <Image src="/sebi-logo.png" alt="SEBI Logo" width={40} height={40} className="sidebar-logo-img" />
            <div className="sidebar-brand">
              <span className="sidebar-brand-title">SEBI OrgMemory</span>
              <span className="sidebar-brand-subtitle">AI Policy Assistant</span>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section}>
              <div className="nav-section-label">{section.section}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Tooltip.Root key={item.href}>
                    <Tooltip.Trigger asChild>
                      <Link
                        href={item.href}
                        className={`nav-link ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                      >
                        <span className="nav-icon"><Icon size={18} /></span>
                        <span>{item.label}</span>
                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                      </Link>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={8}
                        style={{
                          background: 'var(--bg-tooltip)', color: '#fff',
                          padding: '5px 10px', borderRadius: 'var(--radius-sm)',
                          fontSize: 12, fontWeight: 500, zIndex: 999,
                        }}
                      >
                        {item.label}
                        <Tooltip.Arrow style={{ fill: 'var(--bg-tooltip)' }} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Separator.Root style={{ height: 1, background: 'var(--border-color)', marginBottom: 12 }} />
          <div className="sidebar-user">
            <Avatar.Root style={{
              width: 34, height: 34, borderRadius: 'var(--radius-md)',
              overflow: 'hidden', display: 'flex', flexShrink: 0,
            }}>
              <Avatar.Fallback style={{
                width: '100%', height: '100%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, color: '#fff',
              }}>
                AK
              </Avatar.Fallback>
            </Avatar.Root>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>Akash Kumar</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>HR Manager</div>
            </div>
          </div>
        </div>
      </aside>
    </Tooltip.Provider>
  );
}
