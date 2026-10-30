import { useEffect, useState, useRef } from 'react';
import { getSkills } from '../api';

const CATEGORY_COLORS = {
  Frontend: { color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' },
  Backend: { color: '#00d9c0', bg: 'rgba(0,217,192,0.12)' },
  Database: { color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)' },
  DevOps: { color: '#ffd166', bg: 'rgba(255,209,102,0.12)' },
  Tools: { color: '#a8d8ea', bg: 'rgba(168,216,234,0.12)' },
};

function SkillBar({ name, level, icon, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{name}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{level}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill"
          style={{
            width: animated ? `${level}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [skillsByCategory, setSkillsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    document.title = 'Skills — Kaleg';
    getSkills()
      .then(data => {
        setSkillsByCategory(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Object.keys(skillsByCategory)];

  const filteredSkills = activeCategory === 'All'
    ? Object.entries(skillsByCategory)
    : [[activeCategory, skillsByCategory[activeCategory] || []]];

  return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      <section className="section">
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label">My Arsenal</div>
            <h1 style={{ marginBottom: '1rem' }}>
              Skills &{' '}
              <span className="gradient-text">Technologies</span>
            </h1>
            <p className="section-description">
              A curated set of tools and technologies I use to bring ideas to life,
              from frontend design to backend architecture and deployment.
            </p>
          </div>

          {/* Category Filter */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}>
            {categories.map(cat => {
              const colorInfo = CATEGORY_COLORS[cat] || {};
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: 999,
                    border: `1px solid ${isActive ? (colorInfo.color || 'var(--accent)') : 'var(--border)'}`,
                    background: isActive ? (colorInfo.bg || 'var(--accent-glow)') : 'transparent',
                    color: isActive ? (colorInfo.color || 'var(--accent)') : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" />
            </div>
          ) : (
            <div className="grid-2">
              {filteredSkills.map(([category, skills]) => {
                const colorInfo = CATEGORY_COLORS[category] || { color: 'var(--accent)', bg: 'var(--accent-glow)' };
                return (
                  <div key={category} className="card">
                    {/* Category Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{
                        width: 36, height: 36,
                        borderRadius: 10,
                        background: colorInfo.bg,
                        border: `1px solid ${colorInfo.color}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                      }}>
                        {category === 'Frontend' ? '🎨' :
                         category === 'Backend' ? '⚙️' :
                         category === 'Database' ? '🗄️' :
                         category === 'DevOps' ? '🚀' : '🛠️'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 0 }}>{category}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {skills?.length || 0} skills
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {(skills || []).map((skill, i) => (
                      <SkillBar
                        key={skill.id}
                        name={skill.name}
                        level={skill.level}
                        icon={skill.icon}
                        delay={i * 100}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tech icons cloud */}
          {!loading && Object.keys(skillsByCategory).length > 0 && (
            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                & many more technologies
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                justifyContent: 'center',
              }}>
                {['REST APIs', 'GraphQL', 'WebSockets', 'JWT', 'OAuth', 'AWS', 'CI/CD', 'Agile', 'TDD', 'Microservices'].map(tech => (
                  <span key={tech} className="badge" style={{ padding: '0.4rem 0.875rem' }}>{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
