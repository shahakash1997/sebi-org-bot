'use client';

import * as Switch from '@radix-ui/react-switch';
import * as Select from '@radix-ui/react-select';
import * as Separator from '@radix-ui/react-separator';
import { ChevronDown, Check, Save, RotateCcw } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import PageHeader from './PageHeader';

function RadixSwitch({ id, defaultChecked = false }: { id: string; defaultChecked?: boolean }) {
  return (
    <Switch.Root id={id} defaultChecked={defaultChecked} style={{
      width: 42, height: 24, borderRadius: 'var(--radius-full)', position: 'relative',
      backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)',
      cursor: 'pointer', outline: 'none', transition: 'background var(--transition-fast)',
    }}>
      <Switch.Thumb style={{
        display: 'block', width: 18, height: 18, borderRadius: '50%',
        background: 'var(--text-secondary)', transition: 'all var(--transition-fast)',
        transform: 'translateX(2px)', marginTop: 2,
      }} />
    </Switch.Root>
  );
}

function RadixSelect({ id, options, defaultValue }: { id: string; options: { value: string; label: string }[]; defaultValue: string }) {
  return (
    <Select.Root defaultValue={defaultValue}>
      <Select.Trigger id={id} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: 230, padding: '8px 13px', background: 'var(--bg-input)',
        border: '1px solid var(--border-input)', borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer', outline: 'none',
        fontFamily: 'var(--font-sans)',
      }}>
        <Select.Value />
        <Select.Icon><ChevronDown size={14} color="var(--text-tertiary)" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" sideOffset={4} style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)', padding: 4, boxShadow: 'var(--shadow-lg)',
          zIndex: 200, minWidth: 200,
        }}>
          <Select.Viewport>
            {options.map((o) => (
              <Select.Item key={o.value} value={o.value} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 11px', borderRadius: 'var(--radius-sm)',
                fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer',
                outline: 'none', transition: 'background var(--transition-fast)',
              }}>
                <Select.ItemIndicator><Check size={13} color="var(--text-accent)" /></Select.ItemIndicator>
                <Select.ItemText>{o.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default function SettingsPage({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader title="Settings" subtitle="System configuration" onMenuClick={onMenuClick} />

      <div className="settings-page fade-in">
        {/* General */}
        <div className="settings-section">
          <h3 className="settings-section-title">General</h3>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">System Name</div><div className="setting-desc">Display name for the chatbot</div></div>
            <input className="input-field" style={{ width: 230 }} defaultValue="SEBI OrgMemory" id="setting-system-name" />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Language</div><div className="setting-desc">Response language of the assistant</div></div>
            <RadixSelect id="setting-lang" defaultValue="en" options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'Hindi' }]} />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Theme</div><div className="setting-desc">Current: {theme === 'dark' ? 'Dark' : 'Light'} mode</div></div>
            <Switch.Root
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              id="setting-dark"
              style={{
                width: 42, height: 24, borderRadius: 'var(--radius-full)', position: 'relative',
                backgroundColor: theme === 'dark' ? 'var(--sebi-blue-light)' : 'var(--bg-input)',
                border: '1px solid var(--border-color)', cursor: 'pointer', outline: 'none',
                transition: 'background var(--transition-fast)',
              }}
            >
              <Switch.Thumb style={{
                display: 'block', width: 18, height: 18, borderRadius: '50%',
                background: '#fff', transition: 'all var(--transition-fast)', marginTop: 2,
              }} />
            </Switch.Root>
          </div>
        </div>

        <Separator.Root style={{ height: 1, background: 'var(--border-color)', margin: '4px 0 20px' }} />

        {/* RAG Configuration */}
        <div className="settings-section">
          <h3 className="settings-section-title">RAG Configuration</h3>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">LLM Model</div><div className="setting-desc">Currently loaded Ollama model</div></div>
            <RadixSelect id="setting-llm" defaultValue="llama3" options={[
              { value: 'llama3', label: 'llama3 (8B)' },
              { value: 'mistral', label: 'mistral (7B)' },
              { value: 'orgbot-v3', label: 'orgbot-v3 (fine-tuned)' },
            ]} />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Embedding Model</div><div className="setting-desc">Model for semantic search embeddings</div></div>
            <RadixSelect id="setting-embed" defaultValue="nomic" options={[
              { value: 'nomic', label: 'nomic-embed-text (768d)' },
              { value: 'bge', label: 'bge-base-en (768d)' },
            ]} />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Top-K Results</div><div className="setting-desc">Number of chunks per query</div></div>
            <input className="input-field" style={{ width: 90 }} type="number" defaultValue={5} min={1} max={20} id="setting-topk" />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Chunk Size (tokens)</div><div className="setting-desc">Token count per document chunk</div></div>
            <input className="input-field" style={{ width: 90 }} type="number" defaultValue={512} min={128} max={2048} id="setting-chunk-size" />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Chunk Overlap (tokens)</div><div className="setting-desc">Overlap between consecutive chunks</div></div>
            <input className="input-field" style={{ width: 90 }} type="number" defaultValue={50} min={0} max={256} id="setting-chunk-overlap" />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Stream Responses</div><div className="setting-desc">Enable streaming via SSE</div></div>
            <RadixSwitch id="setting-stream" defaultChecked />
          </div>
        </div>

        <Separator.Root style={{ height: 1, background: 'var(--border-color)', margin: '4px 0 20px' }} />

        {/* Feedback & RL */}
        <div className="settings-section">
          <h3 className="settings-section-title">Feedback & RL Loop</h3>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Feedback Threshold</div><div className="setting-desc">Min entries before RL training</div></div>
            <input className="input-field" style={{ width: 90 }} type="number" defaultValue={100} min={10} max={1000} id="setting-fb-threshold" />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">LoRA Rank (r)</div><div className="setting-desc">Rank for LoRA adapter</div></div>
            <input className="input-field" style={{ width: 90 }} type="number" defaultValue={16} min={4} max={64} id="setting-lora-r" />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">LoRA Alpha (α)</div><div className="setting-desc">Scaling factor for LoRA</div></div>
            <input className="input-field" style={{ width: 90 }} type="number" defaultValue={32} min={8} max={128} id="setting-lora-alpha" />
          </div>
          <div className="setting-row">
            <div className="setting-info"><div className="setting-name">Auto Fine-Tune</div><div className="setting-desc">Weekly automatic RL training</div></div>
            <RadixSwitch id="setting-auto-ft" defaultChecked />
          </div>
        </div>

        <Separator.Root style={{ height: 1, background: 'var(--border-color)', margin: '4px 0 20px' }} />

        {/* Service Status */}
        <div className="settings-section">
          <h3 className="settings-section-title">Service Status</h3>
          {[
            { name: 'Ollama (LLM)', url: 'http://ollama:11434' },
            { name: 'Qdrant (Vector DB)', url: 'http://qdrant:6333' },
            { name: 'PostgreSQL', url: 'postgres:5432' },
            { name: 'Redis (Cache)', url: 'redis:6379' },
            { name: 'Apache Tika', url: 'http://tika:9998' },
            { name: 'Keycloak (Auth)', url: 'http://keycloak:8180' },
          ].map((svc) => (
            <div className="setting-row" key={svc.name}>
              <div className="setting-info"><div className="setting-name">{svc.name}</div><div className="setting-desc">{svc.url}</div></div>
              <span className="status-online">Online</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9, marginTop: 6, marginBottom: 36 }}>
          <button className="btn btn-secondary"><RotateCcw size={13} /> Reset Defaults</button>
          <button className="btn btn-primary" id="save-settings-btn"><Save size={13} /> Save Settings</button>
        </div>
      </div>
    </>
  );
}
