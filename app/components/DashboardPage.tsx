'use client';

import { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Separator from '@radix-ui/react-separator';
import * as Progress from '@radix-ui/react-progress';
import { MessageSquare, FileText, Star, Zap } from 'lucide-react';
import PageHeader from './PageHeader';

interface StatCard {
  icon: React.ReactNode;
  iconClass: string;
  value: string;
  label: string;
  trend: string;
  trendDir: 'up' | 'down';
}

const barData = [
  { label: 'Mon', value: 72 },
  { label: 'Tue', value: 85 },
  { label: 'Wed', value: 64 },
  { label: 'Thu', value: 91 },
  { label: 'Fri', value: 78 },
  { label: 'Sat', value: 35 },
  { label: 'Sun', value: 22 },
];

const activities = [
  { type: 'query', text: '<strong>Ravi Sharma</strong> asked about leave encashment policy', time: '2 min ago' },
  { type: 'ingest', text: '<strong>Admin</strong> uploaded Circular_MRD_2026_15.pdf', time: '18 min ago' },
  { type: 'feedback', text: '<strong>Priya Patel</strong> rated a response ⭐⭐⭐⭐⭐', time: '35 min ago' },
  { type: 'query', text: '<strong>Amit Desai</strong> asked about FMD margin requirements', time: '1 hour ago' },
  { type: 'ingest', text: '<strong>Admin</strong> uploaded HR_Policy_Update_Q1.pdf', time: '2 hours ago' },
  { type: 'feedback', text: '<strong>Sneha Gupta</strong> provided detailed feedback on compliance answer', time: '3 hours ago' },
];

export default function DashboardPage({ onMenuClick }: { onMenuClick: () => void }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const stats: StatCard[] = [
    { icon: <MessageSquare size={18} />, iconClass: 'blue', value: '2,847', label: 'Total Queries', trend: '+12.5%', trendDir: 'up' },
    { icon: <FileText size={18} />, iconClass: 'gold', value: '24', label: 'Documents Indexed', trend: '+3', trendDir: 'up' },
    { icon: <Star size={18} />, iconClass: 'green', value: '4.3', label: 'Avg. Rating', trend: '+0.2', trendDir: 'up' },
    { icon: <Zap size={18} />, iconClass: 'purple', value: '2.1s', label: 'Avg. Latency', trend: '-0.3s', trendDir: 'up' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Analytics & system overview" onMenuClick={onMenuClick}
        actions={<div style={{ display: 'flex', gap: 7 }}><button className="btn btn-secondary btn-sm">Export</button><button className="btn btn-primary btn-sm">Refresh</button></div>} />

      <div className="dashboard-page fade-in">
        <div className="dashboard-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="stat-header">
                <div className={`stat-icon ${s.iconClass}`}>{s.icon}</div>
                <span className={`stat-trend ${s.trendDir}`}>{s.trend}</span>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Queries This Week</h3>
              <Tabs.Root defaultValue="7d">
                <Tabs.List style={{ display: 'flex', gap: 2, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
                  {['7D', '30D', '90D'].map((t) => (
                    <Tabs.Trigger key={t} value={t.toLowerCase()} style={{
                      padding: '3px 11px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500,
                      color: 'var(--text-tertiary)', cursor: 'pointer', border: 'none', background: 'none',
                      transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)',
                    }}
                      data-state-style="true"
                    >{t}</Tabs.Trigger>
                  ))}
                </Tabs.List>
              </Tabs.Root>
            </div>
            <div className="bar-chart">
              {barData.map((d, i) => (
                <div key={i} className="bar-col">
                  <div className="bar" style={{ height: animated ? `${d.value}%` : '4px', transitionDelay: `${i * 70}ms` }} title={`${d.value} queries`} />
                  <span className="bar-label">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header"><h3 className="chart-card-title">Query Categories</h3></div>
            <div className="donut-chart">
              <div className="donut-ring"><div className="donut-hole"><div className="donut-value">847</div><div className="donut-label">this week</div></div></div>
            </div>
            <div className="donut-legend">
              {[
                { color: '#1565a0', label: 'HR Policies', pct: 35 },
                { color: '#c69214', label: 'Circulars', pct: 25 },
                { color: '#22c55e', label: 'FMD Guidelines', pct: 20 },
                { color: '#a855f7', label: 'Regulatory', pct: 20 },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: item.color }} />
                    <span>{item.label}</span>
                    <span className="legend-value">{item.pct}%</span>
                  </div>
                  <Progress.Root style={{ height: 4, background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <Progress.Indicator style={{
                      height: '100%', background: item.color, borderRadius: 'var(--radius-full)',
                      width: animated ? `${item.pct}%` : '0%', transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }} />
                  </Progress.Root>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header"><h3 className="chart-card-title">Recent Activity</h3><button className="btn btn-ghost btn-sm">View All</button></div>
          <Separator.Root style={{ height: 1, background: 'var(--border-color)', marginBottom: 4 }} />
          <div className="activity-list">
            {activities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-icon ${a.type}`}>
                  {a.type === 'query' && <MessageSquare size={14} />}
                  {a.type === 'ingest' && <FileText size={14} />}
                  {a.type === 'feedback' && <Star size={14} />}
                </div>
                <div>
                  <div className="activity-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
