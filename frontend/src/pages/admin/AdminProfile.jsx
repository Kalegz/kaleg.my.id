import { useEffect, useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { getProfile, updateProfile } from '../../api';

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
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
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
            {field('avatar_url', 'Avatar URL', 'url', { placeholder: 'https://...' })}
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
              disabled={saving}
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
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
