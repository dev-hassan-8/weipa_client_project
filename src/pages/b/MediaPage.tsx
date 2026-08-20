import React, { useState, useEffect, useCallback } from 'react';
import {
  Image, Plus, Trash2, Eye, EyeOff, Link2, LayoutGrid, Upload,
  Loader2, CheckCircle2, AlertCircle, RefreshCw, X, Pencil
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  page: string;
  position: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

const PAGES = [
  { value: 'home',        label: '🏠 Home' },
  { value: 'automotive',  label: '🚗 Automotive' },
  { value: 'about',       label: '👥 About Us' },
  { value: 'gallery',     label: '🖼️ Gallery' },
];

const POSITIONS = [
  { value: '',        label: 'General / No specific slot' },
  { value: 'hero',    label: 'Hero Banner (top of page)' },
  { value: 'section', label: 'Section Image' },
  { value: 'gallery', label: 'Gallery Grid' },
  { value: 'team',    label: 'Team / About' },
];

const PAGE_COLORS: Record<string, string> = {
  home:        '#3b82f6',
  automotive:  '#f59e0b',
  residential: '#10b981',
  commercial:  '#8b5cf6',
  about:       '#ec4899',
  gallery:     '#06b6d4',
};

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [filterPage, setFilterPage] = useState<string>('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    url: '',
    page: 'home',
    position: '',
    sort_order: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sourceTab, setSourceTab] = useState<'upload' | 'url'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch {
      showToast('error', 'Failed to load media library');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const resetForm = () => {
    setForm({ name: '', url: '', page: 'home', position: '', sort_order: 0 });
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setSourceTab('upload');
    setEditingId(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item: MediaItem) => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    setEditingId(item.id);
    setForm({
      name: item.name,
      url: item.url,
      page: item.page,
      position: item.position || '',
      sort_order: item.sort_order,
    });
    setSourceTab('url');
    setShowForm(true);
  };

  const handleFileChange = (selected: File | null) => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(selected);
    setFilePreview(selected ? URL.createObjectURL(selected) : null);
    if (selected && !form.name.trim()) {
      const base = selected.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      setForm(p => ({ ...p, name: base }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('error', 'Name is required');
      return;
    }
    if (!editingId && sourceTab === 'upload' && !file) {
      showToast('error', 'Please choose an image or video to upload');
      return;
    }
    if (sourceTab === 'url' && !form.url.trim()) {
      showToast('error', 'A URL is required');
      return;
    }
    setSaving(true);
    try {
      let finalUrl = form.url.trim();

      if (sourceTab === 'upload' && file) {
        const fd = new FormData();
        fd.append('file', file);
        const upRes = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
        const upData = await upRes.json();
        if (!upRes.ok || !upData.success || !upData.url) {
          showToast('error', upData.error || 'Failed to upload file');
          return;
        }
        finalUrl = upData.url;
      }

      const payload = {
        name: form.name.trim(),
        url: finalUrl,
        page: form.page,
        position: form.position || null,
        sort_order: form.sort_order,
      };

      const res = editingId
        ? await fetch(`/api/media/${editingId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/media', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, url: finalUrl }),
          });

      const data = await res.json();
      if (data.success) {
        showToast('success', editingId ? 'Media updated' : 'Image added to library');
        if (editingId) {
          setItems(prev => prev.map(i => i.id === editingId ? data.item : i));
        } else {
          setItems(prev => [data.item, ...prev]);
        }
        resetForm();
        setShowForm(false);
      } else {
        showToast('error', data.error || (editingId ? 'Failed to update media' : 'Failed to add image'));
      }
    } catch {
      showToast('error', 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: MediaItem) => {
    try {
      const res = await fetch(`/api/media/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !item.active }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, active: !i.active } : i));
      }
    } catch {
      showToast('error', 'Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this image from the library?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(i => i.id !== id));
        showToast('success', 'Image removed');
      } else {
        showToast('error', 'Failed to delete');
      }
    } catch {
      showToast('error', 'Network error');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filterPage === 'all' ? items : items.filter(i => i.page === filterPage);

  const grouped = PAGES.reduce((acc, p) => {
    const pageItems = filtered.filter(i => i.page === p.value);
    if (pageItems.length > 0 || filterPage === p.value) acc[p.value] = pageItems;
    return acc;
  }, {} as Record<string, MediaItem[]>);

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const renderMediaForm = () => (
    <form onSubmit={handleSave}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Image Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Hero Banner Car"
            required
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.65rem 0.875rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Target Page *
          </label>
          <select
            value={form.page}
            onChange={e => setForm(p => ({ ...p, page: e.target.value }))}
            style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.65rem 0.875rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' }}
          >
            {PAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.8rem' }}>
          Image Source *
        </label>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setSourceTab('upload')}
            style={{
              flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              background: sourceTab === 'upload' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${sourceTab === 'upload' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: sourceTab === 'upload' ? '#60a5fa' : '#94a3b8',
            }}
          >
            <Upload size={14} /> Upload file
          </button>
          <button
            type="button"
            onClick={() => setSourceTab('url')}
            style={{
              flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              background: sourceTab === 'url' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${sourceTab === 'url' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: sourceTab === 'url' ? '#60a5fa' : '#94a3b8',
            }}
          >
            <Link2 size={14} /> Paste URL
          </button>
        </div>

        {sourceTab === 'upload' ? (
          <label
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', minHeight: '120px', cursor: 'pointer',
              border: '1px dashed rgba(59,130,246,0.4)', borderRadius: '10px',
              background: 'rgba(59,130,246,0.06)', padding: '1.25rem', color: '#94a3b8',
            }}
          >
            <Upload size={22} color="#60a5fa" />
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>
              {file ? file.name : editingId ? 'Click to replace with a new file (optional)' : 'Click to choose an image or video'}
            </span>
            <span style={{ fontSize: '0.75rem' }}>PNG, JPG, WEBP, GIF, MP4, WEBM</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
              onChange={e => handleFileChange(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </label>
        ) : (
          <div style={{ position: 'relative' }}>
            <Link2 size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              value={form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              placeholder="/images/photo.jpg or https://..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.65rem 0.875rem 0.65rem 2.4rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Position / Slot
          </label>
          <select
            value={form.position}
            onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
            style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.65rem 0.875rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' }}
          >
            {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Display Order
          </label>
          <input
            type="number"
            value={form.sort_order}
            onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
            min={0}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.65rem 0.875rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {(filePreview || (sourceTab === 'url' && form.url) || (editingId && sourceTab === 'upload' && form.url && !file)) && (
        <div style={{ marginBottom: '1.25rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#0b1118', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {sourceTab === 'upload' && file?.type.startsWith('video/') ? (
            <video src={filePreview || undefined} style={{ maxHeight: '140px', maxWidth: '100%' }} muted />
          ) : (
            <img
              src={sourceTab === 'upload' ? (filePreview || form.url) : form.url}
              alt="Preview"
              style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={closeForm}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.6rem 1.25rem', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{ background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '0.6rem 1.5rem', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : editingId ? <><Pencil size={14} /> Save Changes</> : <><Plus size={14} /> Add to Library</>}
        </button>
      </div>
    </form>
  );

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
          borderRadius: '10px', padding: '0.875rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          color: toast.type === 'success' ? '#10b981' : '#ef4444',
          fontSize: '0.875rem', fontWeight: 500, backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh' }}>
            <button
              onClick={() => setPreviewUrl(null)}
              style={{
                position: 'absolute', top: '-2.5rem', right: 0,
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: '2rem', height: '2rem', cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            ><X size={16} /></button>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain' }}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Image size={22} style={{ color: '#3b82f6' }} />
            Media Library
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.35rem 0 0' }}>
            Manage image and video links for each page of the public website
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchItems}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 0.875rem', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={openAddForm}
            style={{ background: '#3b82f6', border: 'none', borderRadius: '8px', padding: '0.5rem 1.1rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <Plus size={16} /> Add Media
          </button>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div style={{
        padding: '1.1rem 1.4rem',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '12px',
        marginBottom: '2rem',
        color: '#cbd5e1',
        fontSize: '0.9rem',
        lineHeight: 1.6
      }}>
        <strong style={{ color: '#60a5fa' }}>💡 How Media Library Works:</strong>
        <br />
        Upload images (PNG, JPG, WEBP) or videos (MP4, WEBM). When you assign media to a page (e.g. <em>Home</em>, <em>Automotive</em>, <em>Gallery</em>) and slot (e.g. <em>Hero Banner</em>, <em>Gallery Grid</em>), it automatically displays on the live website and replaces default stock placeholders!
      </div>

      {/* Add form (inline) / Edit form (modal — keeps grid scroll position) */}
      {showForm && !editingId && (
        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Add New Image
          </h3>
          {renderMediaForm()}
        </div>
      )}

      {showForm && editingId && (
        <div className="b-modal-overlay" style={{ zIndex: 1200 }}>
          <div
            className="b-modal-card"
            style={{ maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pencil size={16} /> Edit Media
              </h3>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="b-modal-close"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            {renderMediaForm()}
          </div>
        </div>
      )}

      {/* Page Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterPage('all')}
          style={{ padding: '0.4rem 0.875rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: filterPage === 'all' ? '#3b82f6' : 'rgba(255,255,255,0.07)', color: filterPage === 'all' ? '#fff' : '#94a3b8' }}
        >
          All Pages
        </button>
        {PAGES.map(p => (
          <button
            key={p.value}
            onClick={() => setFilterPage(p.value)}
            style={{ padding: '0.4rem 0.875rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: filterPage === p.value ? PAGE_COLORS[p.value] : 'rgba(255,255,255,0.07)', color: filterPage === p.value ? '#fff' : '#94a3b8' }}
          >
            {p.label}
            {items.filter(i => i.page === p.value).length > 0 && (
              <span style={{ marginLeft: '0.4rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0 0.4rem', fontSize: '0.7rem' }}>
                {items.filter(i => i.page === p.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#64748b', gap: '0.75rem' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading media library...
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
          <LayoutGrid size={40} style={{ color: '#334155', margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>No images in library yet.</p>
          <p style={{ color: '#475569', margin: '0.4rem 0 0', fontSize: '0.825rem' }}>Click "Add Image" to get started.</p>
        </div>
      )}

      {/* Grouped by page */}
      {!loading && Object.entries(grouped).map(([pageKey, pageItems]) => {
        const pageLabel = PAGES.find(p => p.value === pageKey)?.label || pageKey;
        const color = PAGE_COLORS[pageKey] || '#64748b';
        return (
          <div key={pageKey} style={{ marginBottom: '2.5rem' }}>
            {filterPage === 'all' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ height: '3px', width: '3px', borderRadius: '50%', background: color }} />
                <h3 style={{ color, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {pageLabel}
                </h3>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ color: '#475569', fontSize: '0.75rem' }}>{pageItems.length} image{pageItems.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {pageItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${item.active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    opacity: item.active ? 1 : 0.5,
                    transition: 'border-color 0.2s, opacity 0.2s',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => setPreviewUrl(item.url)}
                    style={{ height: '140px', background: '#0b1118', cursor: 'zoom-in', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        el.parentElement!.innerHTML += `<div style="color:#475569;font-size:0.75rem;display:flex;flex-direction:column;align-items:center;gap:0.5rem"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect width='18' height='18' x='3' y='3' rx='2'/><path d='m3 9 5-5 5 5 3-3 5 5'/><circle cx='8.5' cy='8.5' r='1.5'/></svg><span>Image not found</span></div>`;
                      }}
                    />
                    <div style={{
                      position: 'absolute', top: '0.5rem', right: '0.5rem',
                      background: color, borderRadius: '6px', padding: '0.2rem 0.5rem',
                      fontSize: '0.65rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {item.position || 'general'}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.3 }}>{item.name}</p>
                      <span style={{ fontSize: '0.65rem', color: '#fff', background: color, borderRadius: '4px', padding: '0.15rem 0.4rem', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                        #{item.sort_order}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', color: '#64748b', wordBreak: 'break-all', lineHeight: 1.4, maxHeight: '2.8em', overflow: 'hidden' }}>
                      {item.url}
                    </p>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEditForm(item)}
                        title="Edit"
                        className="b-icon-btn"
                        style={{ flex: 1 }}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setPreviewUrl(item.url)}
                        title="Preview"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', padding: '0.45rem 0.6rem', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(item)}
                        title={item.active ? 'Deactivate' : 'Activate'}
                        style={{ background: item.active ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${item.active ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '7px', padding: '0.45rem 0.6rem', cursor: 'pointer', color: item.active ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {item.active ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        title="Delete"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '7px', padding: '0.45rem 0.6rem', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {deletingId === item.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
