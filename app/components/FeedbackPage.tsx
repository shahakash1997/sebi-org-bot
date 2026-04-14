'use client';

import { useState, useEffect } from 'react';
import * as Progress from '@radix-ui/react-progress';
import * as Separator from '@radix-ui/react-separator';
import { Download, Cpu } from 'lucide-react';
import PageHeader from './PageHeader';

interface FeedbackItem {
  id: string;
  question: string;
  answer_preview: string;
  rating: number;
  comment?: string;
  user: string;
  created_at: string;
}

const sampleFeedback: FeedbackItem[] = [
  { id: '1', question: 'What is the leave encashment policy?', answer_preview: 'Employees are entitled to encashment of earned leave as follows: Maximum 300 days can be accumulated...', rating: 5, comment: 'Very accurate and detailed. Exactly what I needed.', user: 'Ravi Sharma', created_at: '2026-04-13 14:32' },
  { id: '2', question: 'Summarize recent FMD circulars', answer_preview: 'The Financial Markets Department has issued the following key circulars in Q1 2026...', rating: 4, comment: 'Good overview but missed the Feb 2026 amendment.', user: 'Priya Patel', created_at: '2026-04-13 12:15' },
  { id: '3', question: 'What are the LODR compliance deadlines?', answer_preview: 'Under SEBI (LODR) Regulations, 2015, listed companies must adhere to quarterly reporting...', rating: 5, user: 'Amit Desai', created_at: '2026-04-13 10:45' },
  { id: '4', question: 'Travel allowance for Grade B officers', answer_preview: 'Grade B officers are entitled to air travel (economy class) for domestic tours...', rating: 3, comment: 'The answer cited an older version of the TA rules. Please update with the 2025 revision.', user: 'Sneha Gupta', created_at: '2026-04-12 16:00' },
  { id: '5', question: 'Insider trading pre-clearance process', answer_preview: 'Designated persons must obtain pre-clearance from the Compliance Officer at least 2 trading days before...', rating: 5, user: 'Vikram Mehta', created_at: '2026-04-12 11:30' },
  { id: '6', question: 'How to apply for study leave?', answer_preview: 'Study leave may be granted to employees with at least 5 years of continuous service...', rating: 2, comment: 'The response did not mention the revised 2025 study leave scheme. Needs correction.', user: 'Neha Krishnan', created_at: '2026-04-11 14:20' },
  { id: '7', question: 'Cybersecurity framework for intermediaries', answer_preview: 'The CSCRF mandates all registered intermediaries to implement SOC monitoring, incident response...', rating: 4, user: 'Rajesh Kumar', created_at: '2026-04-11 09:15' },
  { id: '8', question: 'Board diversity requirements for listed entities', answer_preview: 'As per the amended LODR, the top 500 listed entities by market cap must ensure at least one woman...', rating: 1, comment: 'Completely outdated. The 2026 circular raised it to top 1000 entities.', user: 'Ananya Roy', created_at: '2026-04-10 15:45' },
];

const ratingDistribution = [
  { stars: 5, count: 128, percentage: 45 },
  { stars: 4, count: 76, percentage: 27 },
  { stars: 3, count: 42, percentage: 15 },
  { stars: 2, count: 23, percentage: 8 },
  { stars: 1, count: 14, percentage: 5 },
];

const barColors = ['#22c55e', '#84cc16', '#e0a82e', '#f97316', '#ef4444'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="feedback-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}

export default function FeedbackPage({ onMenuClick }: { onMenuClick: () => void }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

  const totalFeedback = ratingDistribution.reduce((a, r) => a + r.count, 0);
  const avgRating = (ratingDistribution.reduce((a, r) => a + r.stars * r.count, 0) / totalFeedback).toFixed(1);
  const positivePct = Math.round(((ratingDistribution[0].count + ratingDistribution[1].count) / totalFeedback) * 100);

  return (
    <>
      <PageHeader title="Feedback Analytics" subtitle="Employee satisfaction & RL training signals" onMenuClick={onMenuClick}
        actions={
          <div style={{ display: 'flex', gap: 7 }}>
            <button className="btn btn-secondary btn-sm"><Download size={13} /> Export CSV</button>
            <button className="btn btn-primary btn-sm"><Cpu size={13} /> Trigger RL Training</button>
          </div>
        }
      />

      <div className="feedback-page fade-in">
        <div className="feedback-overview">
          <div className="feedback-metric" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 22, textAlign: 'center' }}>
            <div className="feedback-metric-value positive">{avgRating}</div>
            <div className="feedback-metric-label">Average Rating (out of 5)</div>
          </div>
          <div className="feedback-metric" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 22, textAlign: 'center' }}>
            <div className="feedback-metric-value neutral">{totalFeedback}</div>
            <div className="feedback-metric-label">Total Feedback Entries</div>
          </div>
          <div className="feedback-metric" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 22, textAlign: 'center' }}>
            <div className="feedback-metric-value positive">{positivePct}%</div>
            <div className="feedback-metric-label">Positive (4★ & 5★)</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-header"><h3 className="chart-card-title">Recent Feedback</h3></div>
            <div className="feedback-list">
              {sampleFeedback.map((fb) => (
                <div key={fb.id} className="feedback-card">
                  <div className="feedback-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <StarRating rating={fb.rating} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{fb.user}</span>
                    </div>
                    <span className="feedback-date">{fb.created_at}</span>
                  </div>
                  <div className="feedback-question">Q: {fb.question}</div>
                  <div className="feedback-answer">{fb.answer_preview}</div>
                  {fb.comment && <div className="feedback-comment">&quot;{fb.comment}&quot;</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header"><h3 className="chart-card-title">Rating Distribution</h3></div>
            <div className="rating-bar-container">
              {ratingDistribution.map((r, i) => (
                <div key={r.stars} className="rating-bar-row">
                  <div className="rating-bar-label">{r.stars}<span style={{ color: 'var(--sebi-gold-light)' }}>★</span></div>
                  <Progress.Root style={{ flex: 1, height: 9, background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <Progress.Indicator style={{
                      height: '100%', borderRadius: 'var(--radius-full)', background: barColors[i],
                      width: animated ? `${r.percentage}%` : '0%', transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }} />
                  </Progress.Root>
                  <div className="rating-bar-count">{r.count}</div>
                </div>
              ))}
            </div>

            <Separator.Root style={{ height: 1, background: 'var(--border-color)', margin: '22px 0 16px' }} />

            <div className="chart-card-header"><h3 className="chart-card-title">RL Training Status</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { name: 'Last Training', desc: 'April 7, 2026 02:00 AM' },
                { name: 'Training Pairs Generated', desc: '847 DPO pairs from feedback' },
                { name: 'Feedback Since Last Train', desc: `${totalFeedback} entries (threshold: 100)`, highlight: true },
                { name: 'Model Version', desc: 'orgbot-v3 (LoRA r=16, α=32)' },
              ].map((item) => (
                <div className="setting-row" key={item.name}>
                  <div className="setting-info">
                    <div className="setting-name">{item.name}</div>
                    <div className="setting-desc" style={item.highlight ? { color: 'var(--sebi-gold-light)' } : undefined}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
