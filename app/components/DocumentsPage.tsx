'use client';

import { useState, useRef, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Toast from '@radix-ui/react-toast';
import * as Progress from '@radix-ui/react-progress';
import { Upload, Search, X, FileText, ChevronDown, Check, Trash2 } from 'lucide-react';
import PageHeader from './PageHeader';

interface Document {
  id: string;
  filename: string;
  source_type: 'circular' | 'hr_policy' | 'fmd' | 'regulatory';
  uploaded_by: string;
  uploaded_at: string;
  version: number;
  active: boolean;
  size: string;
  chunks: number;
}

const initialDocs: Document[] = [
  { id: '1', filename: 'HR_Policy_Manual_2024.pdf', source_type: 'hr_policy', uploaded_by: 'Admin', uploaded_at: '2026-04-10', version: 3, active: true, size: '2.4 MB', chunks: 156 },
  { id: '2', filename: 'Circular_MRD_2026_01.pdf', source_type: 'circular', uploaded_by: 'Admin', uploaded_at: '2026-04-08', version: 1, active: true, size: '840 KB', chunks: 42 },
  { id: '3', filename: 'FMD_Guidelines_2024.pdf', source_type: 'fmd', uploaded_by: 'Admin', uploaded_at: '2026-04-05', version: 2, active: true, size: '3.1 MB', chunks: 198 },
  { id: '4', filename: 'LODR_Regulations_2024.pdf', source_type: 'regulatory', uploaded_by: 'Admin', uploaded_at: '2026-04-03', version: 1, active: true, size: '5.7 MB', chunks: 324 },
  { id: '5', filename: 'Circular_IMD_2026_03.pdf', source_type: 'circular', uploaded_by: 'HR_Manager', uploaded_at: '2026-04-02', version: 1, active: true, size: '620 KB', chunks: 28 },
  { id: '6', filename: 'Leave_Encashment_Rules.pdf', source_type: 'hr_policy', uploaded_by: 'Admin', uploaded_at: '2026-03-28', version: 2, active: true, size: '1.1 MB', chunks: 67 },
  { id: '7', filename: 'FMD_Risk_Framework.pdf', source_type: 'fmd', uploaded_by: 'Admin', uploaded_at: '2026-03-25', version: 1, active: true, size: '4.2 MB', chunks: 256 },
  { id: '8', filename: 'Circular_CFD_2026_07.pdf', source_type: 'circular', uploaded_by: 'Admin', uploaded_at: '2026-03-20', version: 1, active: true, size: '950 KB', chunks: 51 },
  { id: '9', filename: 'Compliance_Handbook.pdf', source_type: 'regulatory', uploaded_by: 'Admin', uploaded_at: '2026-03-15', version: 4, active: true, size: '8.3 MB', chunks: 412 },
  { id: '10', filename: 'Travel_Allowance_Policy.pdf', source_type: 'hr_policy', uploaded_by: 'HR_Manager', uploaded_at: '2026-03-10', version: 1, active: true, size: '780 KB', chunks: 34 },
];

const typeLabels: Record<string, string> = { circular: 'Circular', hr_policy: 'HR Policy', fmd: 'FMD', regulatory: 'Regulatory' };
const fileIconMap: Record<string, string> = { pdf: '📕', docx: '📘', xlsx: '📗' };

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function DocumentsPage({ onMenuClick }: { onMenuClick: () => void }) {
  const [docs, setDocs] = useState(initialDocs);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [docType, setDocType] = useState('circular');
  const [docDesc, setDocDesc] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter((doc) => {
    const matchFilter = filter === 'all' || doc.source_type === filter;
    const matchSearch = searchQuery.trim() === '' || doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalChunks = docs.reduce((a, d) => a + d.chunks, 0);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'docx', 'doc', 'xlsx', 'xls'].includes(ext || '');
    });
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload + ingestion progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 80));
      setUploadProgress(i);
    }

    // Add new documents to the list
    const newDocs: Document[] = selectedFiles.map((file, idx) => ({
      id: crypto.randomUUID(),
      filename: file.name,
      source_type: docType as Document['source_type'],
      uploaded_by: 'Akash Kumar',
      uploaded_at: new Date().toISOString().split('T')[0],
      version: 1,
      active: false, // processing state
      size: formatFileSize(file.size),
      chunks: 0,
    }));

    setDocs((prev) => [...newDocs, ...prev]);

    // Simulate ingestion completing after 2 seconds
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          newDocs.find((nd) => nd.id === d.id)
            ? { ...d, active: true, chunks: Math.floor(Math.random() * 200 + 20) }
            : d,
        ),
      );
    }, 2000);

    setUploading(false);
    setUploadProgress(0);
    setSelectedFiles([]);
    setDocDesc('');
    setModalOpen(false);
    setToastMsg(`${selectedFiles.length} document(s) uploaded and queued for ingestion!`);
    setToastOpen(true);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <PageHeader
        title="Documents"
        subtitle={`${docs.length} documents indexed · ${totalChunks.toLocaleString()} chunks`}
        onMenuClick={onMenuClick}
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)} id="upload-doc-btn">
            <Upload size={14} /> Upload Document
          </button>
        }
      />

      <div className="documents-page fade-in">
        <div className="docs-toolbar">
          <div className="docs-search">
            <Search size={15} className="search-icon" />
            <input className="input-field" placeholder="Search documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="doc-search-input" />
          </div>
          <ToggleGroup.Root type="single" value={filter} onValueChange={(v) => v && setFilter(v)} style={{ display: 'flex', gap: 6 }}>
            {['all', 'circular', 'hr_policy', 'fmd', 'regulatory'].map((f) => (
              <ToggleGroup.Item key={f} value={f} style={{
                padding: '5px 13px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'all var(--transition-fast)',
                background: filter === f ? 'rgba(21, 101, 160, 0.12)' : 'var(--bg-input)',
                color: filter === f ? 'var(--text-accent)' : 'var(--text-secondary)',
                borderColor: filter === f ? 'rgba(21, 101, 160, 0.25)' : 'var(--border-color)',
                fontFamily: 'var(--font-sans)',
              }}>
                {f === 'all' ? 'All' : typeLabels[f]}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>

        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Document</th><th>Type</th><th>Chunks</th><th>Size</th><th>Uploaded</th><th>Version</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => {
                const ext = doc.filename.split('.').pop() || 'pdf';
                return (
                  <tr key={doc.id}>
                    <td><div className="doc-name"><div className={`doc-icon ${ext}`}>{fileIconMap[ext] || '📄'}</div>{doc.filename}</div></td>
                    <td><span className={`doc-type-badge ${doc.source_type}`}>{typeLabels[doc.source_type]}</span></td>
                    <td>{doc.chunks || '—'}</td>
                    <td>{doc.size}</td>
                    <td>{doc.uploaded_at}</td>
                    <td>v{doc.version}</td>
                    <td>
                      <div className="doc-status">
                        <span className={`doc-status-dot ${doc.active ? 'active' : 'processing'}`} />
                        {doc.active ? 'Active' : 'Processing'}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>No documents found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== UPLOAD MODAL (Radix Dialog) ===== */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay style={{
            position: 'fixed', inset: 0, background: 'var(--bg-overlay)',
            backdropFilter: 'blur(4px)', zIndex: 100, animation: 'fadeIn 0.2s ease-out',
          }} />
          <Dialog.Content style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)', padding: 28, maxWidth: 520, width: '92%',
            maxHeight: '90vh', overflowY: 'auto', zIndex: 101, animation: 'slideUp 0.3s ease-out',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <Dialog.Title style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Upload Document</Dialog.Title>
              <Dialog.Close asChild>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 4 }} aria-label="Close">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            {/* Drop Zone */}
            <div
              className={`upload-dropzone ${dragOver ? 'dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="upload-icon"><Upload size={32} /></div>
              <div className="upload-title">Drop files here or click to browse</div>
              <div className="upload-subtitle">Supports PDF, DOCX, XLSX · Max 50 MB per file</div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.xlsx,.xls"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files)}
                id="file-upload-input"
              />
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="upload-file-list">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="upload-file-item">
                    <FileText size={15} style={{ color: 'var(--text-accent)', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <button className="file-remove" onClick={() => removeFile(i)} aria-label="Remove file">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 5 }}>
                  <span>Uploading & ingesting...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress.Root style={{ height: 6, background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <Progress.Indicator style={{
                    height: '100%', background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-full)', width: `${uploadProgress}%`,
                    transition: 'width 0.15s ease-out',
                  }} />
                </Progress.Root>
              </div>
            )}

            {/* Document Type Selector (Radix Select) */}
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Document Type</label>
              <Select.Root value={docType} onValueChange={setDocType}>
                <Select.Trigger id="doc-type-select" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '9px 14px', background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14, cursor: 'pointer', outline: 'none',
                  fontFamily: 'var(--font-sans)',
                }}>
                  <Select.Value />
                  <Select.Icon><ChevronDown size={15} color="var(--text-tertiary)" /></Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content
                    position="popper"
                    sideOffset={4}
                    style={{
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)', padding: 4, boxShadow: 'var(--shadow-lg)',
                      zIndex: 200, minWidth: 200,
                    }}
                  >
                    <Select.Viewport>
                      {['circular', 'hr_policy', 'fmd', 'regulatory'].map((t) => (
                        <Select.Item key={t} value={t} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                          fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer',
                          outline: 'none', transition: 'background var(--transition-fast)',
                        }}>
                          <Select.ItemIndicator><Check size={14} color="var(--text-accent)" /></Select.ItemIndicator>
                          <Select.ItemText>{typeLabels[t]}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Description (Optional)</label>
              <input className="input-field" placeholder="Brief description of the document..."
                value={docDesc} onChange={(e) => setDocDesc(e.target.value)} id="doc-desc-input" />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9, marginTop: 22 }}>
              <Dialog.Close asChild>
                <button className="btn btn-secondary">Cancel</button>
              </Dialog.Close>
              <button className="btn btn-primary" onClick={handleUpload} disabled={selectedFiles.length === 0 || uploading}>
                <Upload size={14} />
                {uploading ? 'Ingesting...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Toast */}
      <Toast.Viewport style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8, width: 320 }} />
      <Toast.Root open={toastOpen} onOpenChange={setToastOpen} duration={3500} style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)', padding: '11px 18px', boxShadow: 'var(--shadow-lg)',
        borderLeft: '3px solid var(--color-success)', animation: 'slideUp 0.3s ease-out',
      }}>
        <Toast.Title style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{toastMsg}</Toast.Title>
      </Toast.Root>
    </Toast.Provider>
  );
}
