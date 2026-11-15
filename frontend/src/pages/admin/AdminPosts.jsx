import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Save, X, Eye, EyeOff, Upload } from 'lucide-react';
import { getAdminPosts, getAdminPost, createPost, updatePost, deletePost, uploadPostCover } from '../../api';

function useIsMobile(bp = 640) {
  const [mobile, setMobile] = useState(window.innerWidth < bp);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return mobile;
}

const emptyPost = {
  title: '', slug: '', excerpt: '', content: '',
  cover_image: '', category: '', tags: [], status: 'draft', read_time: 5,
};

function TagsInput({ tags, onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    if (!input.trim() || tags.includes(input.trim())) return;
    onChange([...tags, input.trim()]);
    setInput('');
  };
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input type="text" placeholder="Add tag..." value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          style={{ flex: 1 }}
        />
        <button type="button" className="btn btn-outline" onClick={add} style={{ padding: '0.5rem 0.875rem' }}>Add</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {tags.map((t, i) => (
          <span key={i} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {t}
            <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminPosts() {
  const isMobile = useIsMobile();
  const cols = isMobile ? '1fr' : '1fr 1fr';
  const fileInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, {} = form
  const [saving, setSaving] = useState(false);

  // Cover image upload states
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'

  const fetchPosts = () => {
    setLoading(true);
    getAdminPosts().then(setPosts).finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Posts — Admin';
    fetchPosts();
  }, []);

  const handleCreateNew = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setUploadMode('file');
    setEditing({ ...emptyPost });
  };

  const handleEdit = async (post) => {
    setCoverFile(null);
    setCoverPreview(null);
    setUploadMode(post.cover_image && !post.cover_image.includes('/storage/posts/') ? 'url' : 'file');

    // Load available data immediately with defaults
    const initialData = {
      ...emptyPost,
      ...post,
      tags: Array.isArray(post.tags) ? post.tags : (post.tags ? JSON.parse(post.tags) : []),
    };
    setEditing(initialData);

    // Fetch full post to ensure content, excerpt, and all attributes are hydrated
    try {
      const fullPost = await getAdminPost(post.id);
      setEditing({
        ...emptyPost,
        ...fullPost,
        tags: Array.isArray(fullPost.tags) ? fullPost.tags : (fullPost.tags ? JSON.parse(fullPost.tags) : []),
      });
    } catch (err) {
      console.error('Failed to fetch full post detail:', err);
    }
  };

  const handleSave = async () => {
    if (!editing.title || !editing.content) return alert('Title and content are required');
    setSaving(true);
    try {
      let finalCoverImage = editing.cover_image;

      // Upload file to Laravel storage if a new file was chosen
      if (coverFile) {
        const uploadRes = await uploadPostCover(coverFile);
        finalCoverImage = uploadRes.cover_image || uploadRes.url;
      }

      const payload = {
        ...editing,
        cover_image: finalCoverImage,
      };

      if (editing.id) {
        await updatePost(editing.id, payload);
      } else {
        await createPost(payload);
      }

      setEditing(null);
      setCoverFile(null);
      setCoverPreview(null);
      fetchPosts();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await deletePost(id); fetchPosts(); } catch (err) { alert(err.message); }
  };

  // ── Editor View ────────────────────────────────────────────────────
  if (editing) {
    return (
      <div style={{ padding: isMobile ? '1.25rem' : '2rem', maxWidth: 900 }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <h1 style={{ fontSize: '1.5rem' }}>{editing.id ? 'Edit Post' : 'New Post'}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', width: isMobile ? '100%' : 'auto' }}>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)} style={{ flex: isMobile ? 1 : 'none' }}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: isMobile ? 1 : 'none', justifyContent: 'center' }}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>

        {/* Status & publish */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Status:</span>
          {['draft', 'published'].map(s => (
            <button
              type="button"
              key={s}
              onClick={() => setEditing(e => ({ ...e, status: s }))}
              style={{
                padding: '0.375rem 1rem',
                borderRadius: 999,
                border: `1px solid ${editing.status === s ? 'var(--accent)' : 'var(--border)'}`,
                background: editing.status === s ? 'var(--accent-glow)' : 'transparent',
                color: editing.status === s ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: editing.status === s ? 600 : 400,
                fontFamily: 'var(--font-sans)',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              {s === 'draft' ? <EyeOff size={13} /> : <Eye size={13} />}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Title */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Title *</label>
          <input
            type="text" placeholder="Post title..."
            value={editing.title || ''}
            onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
            style={{ fontSize: '1.1rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '0 1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Slug</label>
            <input type="text" placeholder="auto-generated-from-title" value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Category</label>
            <input type="text" placeholder="Tutorial, DevLog, etc." value={editing.category || ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Read Time (min)</label>
            <input type="number" min={1} value={editing.read_time || 5} onChange={e => setEditing(p => ({ ...p, read_time: Number(e.target.value) }))} />
          </div>
        </div>

        {/* Cover Image: File Upload or URL */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 500 }}>Cover Image</label>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: uploadMode === 'file' ? 'var(--accent)' : 'var(--text-muted)',
                  fontWeight: uploadMode === 'file' ? 600 : 400,
                  textDecoration: uploadMode === 'file' ? 'underline' : 'none',
                }}
              >
                Upload File
              </button>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: uploadMode === 'url' ? 'var(--accent)' : 'var(--text-muted)',
                  fontWeight: uploadMode === 'url' ? 600 : 400,
                  textDecoration: uploadMode === 'url' ? 'underline' : 'none',
                }}
              >
                Image URL
              </button>
            </div>
          </div>

          {uploadMode === 'file' ? (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCoverFile(file);
                    setCoverPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.875rem' }}
                >
                  <Upload size={14} /> {coverFile ? 'Change File' : 'Choose Image'}
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {coverFile ? coverFile.name : (editing.cover_image ? 'Existing image set' : 'No file chosen')}
                </span>
              </div>
            </div>
          ) : (
            <input
              type="url"
              placeholder="https://..."
              value={editing.cover_image || ''}
              onChange={e => {
                setCoverFile(null);
                setCoverPreview(null);
                setEditing(p => ({ ...p, cover_image: e.target.value }));
              }}
            />
          )}

          {/* Image Preview */}
          {(coverPreview || editing.cover_image) && (
            <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
              <img
                src={coverPreview || editing.cover_image}
                alt="Cover Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 180,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <button
                type="button"
                title="Remove image"
                onClick={() => {
                  setCoverFile(null);
                  setCoverPreview(null);
                  setEditing(p => ({ ...p, cover_image: '' }));
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  color: '#ff6b6b',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Excerpt</label>
          <textarea rows={2} placeholder="Short summary..." value={editing.excerpt || ''} onChange={e => setEditing(p => ({ ...p, excerpt: e.target.value }))} style={{ resize: 'vertical' }} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Content * (Markdown supported)</label>
          <textarea
            rows={20}
            placeholder="Write your article here... (Markdown supported)"
            value={editing.content || ''}
            onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
            style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Tags</label>
          <TagsInput tags={editing.tags || []} onChange={tags => setEditing(p => ({ ...p, tags }))} />
        </div>
      </div>
    );
  }

  // ── List View ──────────────────────────────────────────────────────
  return (
    <div style={{ padding: isMobile ? '1.25rem' : '2rem' }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Blog Posts</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Write and manage your blog articles.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreateNew} style={{ fontSize: '0.875rem', alignSelf: isMobile ? 'stretch' : 'auto', justifyContent: 'center' }}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No posts yet. <button type="button" onClick={handleCreateNew} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}>Create your first post</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {posts.map(post => (
            <div key={post.id} className="card" style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '0.75rem' : '1rem',
              padding: '1rem 1.25rem',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {post.category && <span style={{ marginRight: '0.75rem' }}>📂 {post.category}</span>}
                  {post.published_at && <span>{new Date(post.published_at).toLocaleDateString()}</span>}
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                flexShrink: 0,
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'space-between' : 'flex-end',
              }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  padding: '0.2rem 0.7rem', borderRadius: 999,
                  background: post.status === 'published' ? 'rgba(0,217,192,0.15)' : 'rgba(255,209,102,0.15)',
                  color: post.status === 'published' ? 'var(--teal)' : '#ffd166',
                  border: `1px solid ${post.status === 'published' ? 'var(--teal)' : '#ffd166'}44`,
                }}>
                  {post.status}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleEdit(post)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.4rem' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
