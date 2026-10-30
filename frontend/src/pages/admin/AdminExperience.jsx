import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../api';

function useIsMobile(bp = 640) {
  const [mobile, setMobile] = useState(window.innerWidth < bp);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return mobile;
}

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Freelance', 'Contract', 'Internship'];

const emptyExp = {
  company: '', position: '', location: '', employment_type: 'Full-time',
  description: '', technologies: [], start_date: '', end_date: '', is_current: false,
};

export default function AdminExperience() {
  const isMobile = useIsMobile();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');

  const fetchExperiences = () => {
    setLoading(true);
    getExperiences().then(setExperiences).finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Experience — Admin';
    fetchExperiences();
  }, []);

  const handleSave = async () => {
    if (!form.company || !form.position || !form.start_date) {
      return alert('Company, position, and start date are required');
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (form.is_current) delete payload.end_date;
      if (form.id) {
        await updateExperience(form.id, payload);
      } else {
        await createExperience(payload);
      }
      setForm(null);
      fetchExperiences();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await deleteExperience(id);
      fetchExperiences();
    } catch (err) {
      alert(err.message);
    }
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setForm(f => ({ ...f, technologies: [...(f.technologies || []), techInput.trim()] }));
    setTechInput('');
  };

  const removeTech = (i) => {
    setForm(f => ({ ...f, technologies: f.technologies.filter((_, idx) => idx !== i) }));
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
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Experience</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manage your work history and career timeline.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ ...emptyExp }); setTechInput(''); }}
          style={{ fontSize: '0.875rem', alignSelf: isMobile ? 'stretch' : 'auto', justifyContent: 'center' }}>
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {/* Modal */}
      {form && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', overflowY: 'auto',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, padding: '1.75rem', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>{form.id ? 'Edit Experience' : 'Add Experience'}</h3>
              <button onClick={() => setForm(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              {[
                ['Company', 'company', 'text', 'Company name'],
                ['Position', 'position', 'text', 'Job title'],
                ['Location', 'location', 'text', 'City, Country'],
              ].map(([label, key, type, placeholder]) => (
                <div key={key} style={{ marginBottom: '1rem', gridColumn: key === 'location' ? 'span 1' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Type</label>
                <select value={form.employment_type} onChange={e => setForm(f => ({ ...f, employment_type: e.target.value }))}>
                  {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Description</label>
              <textarea rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Start Date</label>
                <input type="date" value={form.start_date || ''} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>End Date</label>
                <input type="date" value={form.end_date || ''} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} disabled={form.is_current} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <input type="checkbox" id="is_current" checked={form.is_current || false} onChange={e => setForm(f => ({ ...f, is_current: e.target.checked, end_date: '' }))} style={{ width: 'auto' }} />
              <label htmlFor="is_current" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Currently working here</label>
            </div>

            {/* Technologies */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, marginBottom: '0.4rem' }}>Technologies</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text" placeholder="Add tech..." value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-outline" onClick={addTech} style={{ padding: '0.5rem 0.875rem', whiteSpace: 'nowrap' }}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(form.technologies || []).map((t, i) => (
                  <span key={i} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {t}
                    <button onClick={() => removeTech(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
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

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : experiences.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No experiences yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {experiences.map(exp => (
            <div key={exp.id} className="card" style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: isMobile ? '0.75rem' : '1rem',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700 }}>{exp.position}</span>
                  {exp.is_current && <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>Current</span>}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--accent-light)', marginBottom: '0.25rem' }}>{exp.company}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {exp.start_date?.slice(0, 7)} – {exp.is_current ? 'Present' : (exp.end_date?.slice(0, 7) || 'Present')}
                  {exp.location ? ` · ${exp.location}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignSelf: isMobile ? 'flex-end' : 'flex-start' }}>
                <button className="btn btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => { setForm({ ...exp, technologies: exp.technologies || [] }); setTechInput(''); }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(exp.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.4rem' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
