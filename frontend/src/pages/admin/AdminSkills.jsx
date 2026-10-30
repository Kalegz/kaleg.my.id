import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../api';

function useIsMobile(bp = 640) {
  const [mobile, setMobile] = useState(window.innerWidth < bp);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return mobile;
}

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'];

const emptySkill = { name: '', category: 'Frontend', icon: '', level: 80, is_featured: false };

export default function AdminSkills() {
  const isMobile = useIsMobile();
  const [skillsByCategory, setSkillsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchSkills = () => {
    setLoading(true);
    getSkills().then(setSkillsByCategory).finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Skills — Admin';
    fetchSkills();
  }, []);

  const allSkills = Object.values(skillsByCategory).flat();

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Name is required');
    setSaving(true);
    try {
      if (form.id) {
        await updateSkill(form.id, form);
      } else {
        await createSkill(form);
      }
      setForm(null);
      fetchSkills();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id);
      fetchSkills();
    } catch (err) {
      alert(err.message);
    }
  };

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
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Skills</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manage your tech skills and proficiency levels.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setForm({ ...emptySkill })}
          style={{ fontSize: '0.875rem', alignSelf: isMobile ? 'stretch' : 'auto', justifyContent: 'center' }}
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Add/Edit Modal */}
      {form && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 440, padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>{form.id ? 'Edit Skill' : 'Add Skill'}</h3>
              <button onClick={() => setForm(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {[
              ['Name', 'name', 'text', 'e.g. React'],
              ['Icon slug', 'icon', 'text', 'e.g. react (from devicons)'],
            ].map(([label, key, type, placeholder]) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key] || ''}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                Level: {form.level}%
              </label>
              <input
                type="range" min={0} max={100}
                value={form.level}
                onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
                style={{ padding: 0 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <input
                type="checkbox" id="featured"
                checked={form.is_featured || false}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                style={{ width: 'auto' }}
              />
              <label htmlFor="featured" style={{ fontSize: '0.875rem' }}>Featured skill</label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                <Save size={15} /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Skills List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{category}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(skills || []).map(skill => (
                <div key={skill.id} className="card" style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{skill.name}</span>
                      {skill.is_featured && <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>Featured</span>}
                    </div>
                    <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${skill.level}%`, background: 'var(--gradient-hero)', borderRadius: 999 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: 36, textAlign: 'right' }}>
                    {skill.level}%
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => setForm({ ...skill })}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.4rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
