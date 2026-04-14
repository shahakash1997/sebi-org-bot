'use client';

import * as Switch from '@radix-ui/react-switch';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, onMenuClick, actions }: PageHeaderProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tooltip.Provider delayDuration={300}>
      <header className="page-header">
        <div className="page-header-left">
          <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
            <Menu size={18} />
          </button>
          <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        </div>
        <div className="header-actions">
          {actions}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                id="theme-toggle"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginLeft: 6,
                  background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)', padding: '6px 12px',
                  cursor: 'pointer', transition: 'all var(--transition-fast)',
                  color: 'var(--text-secondary)',
                }}
              >
                {isDark ? (
                  <Sun size={15} style={{ color: 'var(--sebi-gold-light)' }} />
                ) : (
                  <Moon size={15} style={{ color: 'var(--sebi-blue-light)' }} />
                )}
                <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                  {isDark ? 'Light' : 'Dark'}
                </span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="bottom"
                sideOffset={6}
                style={{
                  background: 'var(--bg-tooltip)', color: '#fff',
                  padding: '5px 10px', borderRadius: 'var(--radius-sm)',
                  fontSize: 12, fontWeight: 500, zIndex: 999,
                }}
              >
                Switch to {isDark ? 'Light' : 'Dark'} Mode
                <Tooltip.Arrow style={{ fill: 'var(--bg-tooltip)' }} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </header>
    </Tooltip.Provider>
  );
}
