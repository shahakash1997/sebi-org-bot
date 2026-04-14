'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';
import { Send, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';
import PageHeader from './PageHeader';

interface Source {
  doc_name: string;
  page: number;
  chunk_id: string;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  sources?: Source[];
  timestamp: Date;
  feedback?: 'up' | 'down' | null;
  query_id?: string;
}

const quickActions = [
  { icon: '📋', title: 'Leave Policy', desc: 'Annual / casual leave rules', question: 'What is the leave encashment policy for employees?' },
  { icon: '📜', title: 'Latest Circulars', desc: 'Recent regulatory updates', question: 'Summarize the latest regulatory circulars issued this quarter.' },
  { icon: '🏦', title: 'FMD Guidelines', desc: 'Financial market rules', question: 'What are the key FMD guidelines for market intermediaries?' },
  { icon: '🔒', title: 'Compliance', desc: 'Regulatory compliance checks', question: 'What are the compliance requirements for listed companies?' },
];

const botResponses: Record<string, { answer: string; sources: Source[] }> = {
  default: {
    answer: "Based on the available organizational policies, I can provide the following guidance:\n\nThe policy framework at SEBI encompasses multiple regulatory areas including HR policies, FMD guidelines, and internal circulars. Each document is carefully indexed and version-controlled for accurate reference.\n\nPlease ask a specific question regarding any policy area — HR, compliance, FMD, or regulatory circulars — and I'll provide a detailed, cited response.",
    sources: [
      { doc_name: 'SEBI_Policy_Framework_2024.pdf', page: 1, chunk_id: 'a1b2' },
      { doc_name: 'HR_Manual_v3.pdf', page: 5, chunk_id: 'c3d4' },
    ],
  },
  leave: {
    answer: "**Leave Encashment Policy (SEBI HR Policy Manual, Section 7.3)**\n\nEmployees are entitled to encashment of earned leave as follows:\n\n1. **Earned Leave**: Maximum 300 days can be accumulated. Encashment at basic pay + DA at the time of retirement.\n2. **Half-Pay Leave**: Can be commuted to full pay leave with medical certificate. Not encashable.\n3. **Casual Leave**: 8 days per calendar year. Cannot be accumulated or encashed.\n4. **Special Casual Leave**: Granted for specific purposes like blood donation (1 day), departmental sports (up to 15 days).\n\n**Important**: Leave encashment during service is permitted once in a block of two years, subject to a maximum of 15 days of earned leave.",
    sources: [
      { doc_name: 'HR_Policy_Manual_2024.pdf', page: 42, chunk_id: 'e5f6' },
      { doc_name: 'Circular_HR_2023_045.pdf', page: 3, chunk_id: 'g7h8' },
    ],
  },
  circular: {
    answer: "**Summary of Recent Regulatory Circulars (Q1 2026)**\n\n1. **SEBI/HO/MRD/TPD/2026/01** — Revised framework for algorithmic trading by retail investors, mandating pre-trade risk checks.\n\n2. **SEBI/HO/IMD/DF2/2026/03** — Updated disclosure norms for mutual fund schemes with ESG mandates.\n\n3. **SEBI/HO/CFD/CMD2/2026/07** — Enhanced Corporate Governance requirements for listed entities, including board diversity targets.\n\n4. **SEBI/HO/DDHS/2026/11** — Framework for social stock exchanges — listing criteria for Not-for-Profit Organizations.\n\nEach circular mandates compliance within 90 days of issuance unless otherwise specified.",
    sources: [
      { doc_name: 'Circular_MRD_2026_01.pdf', page: 1, chunk_id: 'i9j0' },
      { doc_name: 'Circular_IMD_2026_03.pdf', page: 2, chunk_id: 'k1l2' },
      { doc_name: 'Circular_CFD_2026_07.pdf', page: 1, chunk_id: 'm3n4' },
    ],
  },
  fmd: {
    answer: "**Key FMD Guidelines for Market Intermediaries**\n\n1. **Capital Adequacy**: All intermediaries must maintain net worth of ₹5 crore minimum (₹25 crore for clearing members).\n\n2. **Risk Management**: Mandatory real-time position monitoring with VaR-based margining system.\n\n3. **Reporting**: Daily trade reporting to FMD within T+1 hours. Settlement cycle is T+1.\n\n4. **Client Money Segregation**: Strict segregation of client funds in designated bank accounts. Quarterly audit mandated.\n\n5. **Cybersecurity**: CSCRF compliance mandatory from January 2025.\n\n6. **KYC/AML**: Enhanced due diligence for high-value trades exceeding ₹10 lakh per day.",
    sources: [
      { doc_name: 'FMD_Guidelines_2024.pdf', page: 15, chunk_id: 'o5p6' },
      { doc_name: 'FMD_Risk_Framework.pdf', page: 8, chunk_id: 'q7r8' },
    ],
  },
  compliance: {
    answer: "**Compliance Requirements for Listed Companies**\n\nUnder SEBI (LODR) Regulations, 2015 (as amended):\n\n1. **Board Composition**: At least one-third independent directors (half for top 500 by market cap).\n\n2. **Quarterly Financial Results**: Publish within 45 days of quarter-end; annual within 60 days.\n\n3. **Related Party Transactions**: Prior approval of Audit Committee; shareholders' approval for material RPTs exceeding ₹1,000 crore or 10% of revenue.\n\n4. **Corporate Governance Report**: Submit quarterly to stock exchanges within 15 days.\n\n5. **BRSR**: Mandatory for top 1,000 listed companies.\n\n6. **Insider Trading**: Pre-clearance for trades by designated persons. Trading window closures around financial results.",
    sources: [
      { doc_name: 'LODR_Regulations_2024.pdf', page: 23, chunk_id: 's9t0' },
      { doc_name: 'Compliance_Handbook.pdf', page: 7, chunk_id: 'u1v2' },
    ],
  },
};

function getResponse(question: string) {
  const q = question.toLowerCase();
  if (q.includes('leave') || q.includes('encash')) return botResponses.leave;
  if (q.includes('circular') || q.includes('recent') || q.includes('quarter')) return botResponses.circular;
  if (q.includes('fmd') || q.includes('market') || q.includes('intermediar')) return botResponses.fmd;
  if (q.includes('compliance') || q.includes('listed') || q.includes('lodr') || q.includes('governance')) return botResponses.compliance;
  return botResponses.default;
}

export default function ChatPage({ onMenuClick }: { onMenuClick: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 1000));
    const resp = getResponse(text);
    const botMsg: Message = { id: crypto.randomUUID(), role: 'bot', content: resp.answer, sources: resp.sources, timestamp: new Date(), feedback: null, query_id: crypto.randomUUID() };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  }, [isTyping]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m));
    setToastMsg(type === 'up' ? 'Thanks for the positive feedback!' : 'Feedback recorded. We\'ll improve!');
    setToastOpen(true);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <PageHeader title="Policy Assistant" subtitle="Ask anything about SEBI policies, circulars, and guidelines" onMenuClick={onMenuClick} actions={<span className="status-online">System Online</span>} />

      <div className="chat-container">
        <ScrollArea.Root style={{ flex: 1, overflow: 'hidden' }}>
          <ScrollArea.Viewport style={{ width: '100%', height: '100%' }}>
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-welcome fade-in">
                  <div className="chat-welcome-icon">
                    <BookOpen size={36} style={{ color: 'var(--sebi-blue-light)' }} />
                  </div>
                  <h2>SEBI Organizational Memory</h2>
                  <p>Your intelligent policy assistant. Ask me about HR policies, regulatory circulars, FMD guidelines, and compliance requirements. Every answer is sourced and cited.</p>
                  <div className="quick-actions">
                    {quickActions.map((qa) => (
                      <button key={qa.title} className="quick-action-card" onClick={() => sendMessage(qa.question)}>
                        <div className="qa-icon">{qa.icon}</div>
                        <div className="qa-title">{qa.title}</div>
                        <div className="qa-desc">{qa.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`message-row ${msg.role}`}>
                  {msg.role === 'bot' && (
                    <div style={{
                      width: 30, height: 30, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                      background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <BookOpen size={14} color="#fff" />
                    </div>
                  )}
                  <div className={`message-bubble ${msg.role}`}>
                    <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="message-sources">
                        <div className="message-sources-title">📎 Sources</div>
                        {msg.sources.map((src, i) => (
                          <Tooltip.Provider key={i} delayDuration={200}>
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <span className="source-tag" style={{ cursor: 'pointer' }}>📄 {src.doc_name} p.{src.page}</span>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content side="top" sideOffset={4} style={{
                                  background: 'var(--bg-tooltip)', color: '#fff', padding: '6px 10px',
                                  borderRadius: 'var(--radius-sm)', fontSize: 11, zIndex: 999,
                                }}>
                                  Chunk ID: {src.chunk_id}
                                  <Tooltip.Arrow style={{ fill: 'var(--bg-tooltip)' }} />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        ))}
                      </div>
                    )}
                    {msg.role === 'bot' && (
                      <div className="message-feedback">
                        <button className={`feedback-btn ${msg.feedback === 'up' ? 'active-up' : ''}`} onClick={() => handleFeedback(msg.id, 'up')} title="Helpful">
                          <ThumbsUp size={13} />
                        </button>
                        <button className={`feedback-btn ${msg.feedback === 'down' ? 'active-down' : ''}`} onClick={() => handleFeedback(msg.id, 'down')} title="Not helpful">
                          <ThumbsDown size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div style={{
                      width: 30, height: 30, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                      background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: '#0b0e14',
                    }}>AK</div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="message-row bot">
                  <div style={{
                    width: 30, height: 30, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                    background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BookOpen size={14} color="#fff" />
                  </div>
                  <div className="message-bubble bot">
                    <div className="typing-indicator">
                      <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" style={{ width: 6, padding: 1 }}>
            <ScrollArea.Thumb style={{ background: 'var(--scrollbar-thumb)', borderRadius: 3 }} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        <div className="chat-input-wrapper">
          <form onSubmit={handleSubmit} className="chat-input-container">
            <textarea ref={inputRef} className="chat-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Ask about SEBI policies, circulars, HR guidelines..." rows={1} disabled={isTyping} id="chat-input" />
            <button type="submit" className="chat-send-btn" disabled={!input.trim() || isTyping} aria-label="Send message" id="chat-send-btn">
              <Send size={16} />
            </button>
          </form>
          <div className="chat-disclaimer">Responses are AI-generated from internal SEBI documents. Always verify with the official source.</div>
        </div>
      </div>

      <Toast.Viewport style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 200,
        display: 'flex', flexDirection: 'column', gap: 8, width: 300,
      }} />
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        duration={2500}
        style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)', padding: '11px 18px',
          boxShadow: 'var(--shadow-lg)', borderLeft: '3px solid var(--color-success)',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <Toast.Title style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{toastMsg}</Toast.Title>
      </Toast.Root>
    </Toast.Provider>
  );
}
