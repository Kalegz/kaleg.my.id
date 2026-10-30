import { useEffect, useState, useRef } from 'react';
import { Save, CheckCircle, Upload, X } from 'lucide-react';
import { getProfile, updateProfile, uploadAvatar } from '../../api';

function useIsMobile(bp = 640) {
  const [mobile, setMobile] = useState(window.innerWidth < bp);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return mobile;
}

export default function AdminProfile() {
  const isMobile = useIsMobile();
  const cols = isMobile ? '1fr' : '1fr 1fr';
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', title: '', tagline: '', bio: '', email: '',
    location: '', avatar_url: '', github_url: '', linkedin_url: '',
    twitter_url: '', instagram_url: '', resume_url: '', is_available: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = 'Edit Profile — Admin';
    getProfile()
      .then(data => setForm({ ...form, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      // Upload avatar first if a new file was selected
      if (avatarFile) {
        setUploading(true);
        const { avatar_url } = await uploadAvatar(avatarFile);
        setUploading(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        setForm(f => ({ ...f, avatar_url }));
        // Save the rest of the form with the new URL
        await updateProfile({ ...form, avatar_url });
      } else {
        await updateProfile(form);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setUploading(false);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const clearAvatarSelection = () => {
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const field = (key, label, type = 'text', props = {}) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={form[key] || ''}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={5}
          style={{ resize: 'vertical' }}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={form[key] || ''}
          onChange={e => setForm(f => ({ ...f, [key]: type === 'checkbox' ? e.target.checked : e.target.value }))}
          {...props}
        />
      )}
    </div>
  );

  return (
    <div style={{ padding: isMobile ? '1.25rem' : '2rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Edit Profile</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Update your portfolio bio and personal information.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              Basic Info
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '0 1.25rem' }}>
              {field('name', 'Full Name', 'text', { placeholder: 'Your name' })}
              {field('title', 'Job Title', 'text', { placeholder: 'Full Stack Developer' })}
            </div>
            {field('tagline', 'Tagline', 'text', { placeholder: 'A short catchy phrase' })}
            {field('bio', 'Bio', 'textarea', { placeholder: 'Write about yourself...' })}
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '0 1.25rem' }}>
              {field('email', 'Email', 'email', { placeholder: 'hello@kaleg.my.id' })}
              {field('location', 'Location', 'text', { placeholder: 'Indonesia' })}
            </div>

            {/* Availability Toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}>
              <input
                type="checkbox"
                id="is_available"
                checked={form.is_available || false}
                onChange={e => setForm(f => ({ ...f, is_available: e.target.checked }))}
                style={{ width: 'auto' }}
              />
              <label htmlFor="is_available" style={{ fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                Available for new opportunities
              </label>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              Links & Social
            </h3>

            {/* Avatar Upload */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Avatar
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Preview */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border)',
                  overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {(avatarPreview || form.avatar_url) ? (
                    <img
                      src={avatarPreview || form.avatar_url}
                      alt="Avatar preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.75rem', color: 'var(--text-muted)' }}>👤</span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                    id="avatar-upload"
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ fontSize: '0.825rem', gap: '0.4rem' }}
                    >
                      <Upload size={14} /> {form.avatar_url ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    {avatarFile && (
                      <button
                        type="button"
                        onClick={clearAvatarSelection}
                        style={{
                          background: 'none', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)', color: 'var(--text-muted)',
                          cursor: 'pointer', fontSize: '0.825rem',
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          padding: '0.5rem 0.875rem',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        <X size={13} /> Cancel
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {avatarFile
                      ? `Selected: ${avatarFile.name}`
                      : 'JPG, PNG or WebP · max 2MB'}
                  </span>
                </div>
              </div>
            </div>
            {field('resume_url', 'Resume URL', 'url', { placeholder: 'https://...' })}
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '0 1.25rem' }}>
              {field('github_url', 'GitHub URL', 'url', { placeholder: 'https://github.com/...' })}
              {field('linkedin_url', 'LinkedIn URL', 'url', { placeholder: 'https://linkedin.com/in/...' })}
              {field('twitter_url', 'Twitter / X URL', 'url', { placeholder: 'https://x.com/...' })}
              {field('instagram_url', 'Instagram URL', 'url', { placeholder: 'https://instagram.com/...' })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || uploading}
              style={{ opacity: (saving || uploading) ? 0.7 : 1 }}
            >
              <Save size={16} />
              {uploading ? 'Uploading avatar...' : saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teal)', fontSize: '0.875rem' }}>
                <CheckCircle size={16} /> Saved successfully!
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
