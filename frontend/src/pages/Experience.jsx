import { useEffect, useState } from 'react';
import { MapPin, Calendar, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { getExperiences } from '../api';
import { format, differenceInMonths } from 'date-fns';

function formatDuration(start, end, isCurrent) {
  const startDate = new Date(start);
  const endDate = isCurrent ? new Date() : (end ? new Date(end) : new Date());
  const months = differenceInMonths(endDate, startDate);
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years} yr ${rem} mo` : `${years} yr`;
}

function ExperienceCard({ exp, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="timeline-item">
      <div className="timeline-dot" style={{
        background: exp.is_current ? 'var(--teal)' : 'var(--accent)',
        boxShadow: exp.is_current ? '0 0 12px var(--teal-glow)' : '0 0 12px var(--accent-glow)',
      }} />

      <div
        className="card"
        style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 0 }}>{exp.position}</h3>
              {exp.is_current && (
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  Current
                </span>
              )}
              <span
                className="badge"
                style={{ fontSize: '0.7rem' }}
              >
                {exp.employment_type}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-light)', fontWeight: 600 }}>
                <Briefcase size={14} />
                <span style={{ fontSize: '0.95rem' }}>{exp.company}</span>
              </div>
              {exp.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                  <MapPin size={13} />
                  <span style={{ fontSize: '0.85rem' }}>{exp.location}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              <Calendar size={13} />
              <span>
                {format(new Date(exp.start_date), 'MMM yyyy')} —{' '}
                {exp.is_current ? 'Present' : (exp.end_date ? format(new Date(exp.end_date), 'MMM yyyy') : 'Present')}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {formatDuration(exp.start_date, exp.end_date, exp.is_current)}
            </div>
            <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <div style={{
          maxHeight: expanded ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border)', marginTop: '1.25rem' }}>
            {exp.description && (
              <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>{exp.description}</p>
            )}
            {exp.technologies?.length > 0 && (
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Technologies
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {exp.technologies.map(tech => (
                    <span key={tech} className="badge badge-accent" style={{ fontSize: '0.75rem' }}>{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Experience — Kaleg';
    getExperiences()
      .then(setExperiences)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      <section className="section">
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '4rem' }}>
            <div className="section-label">Career Journey</div>
            <h1 style={{ marginBottom: '1rem' }}>
              Work{' '}
              <span className="gradient-text">Experience</span>
            </h1>
            <p className="section-description">
              A timeline of my professional journey, the companies I&apos;ve worked with,
              and the impact I&apos;ve made.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" />
            </div>
          ) : experiences.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              No experiences added yet.
            </div>
          ) : (
            <div style={{ maxWidth: 760 }}>
              <div className="timeline">
                {experiences.map((exp, i) => (
                  <ExperienceCard key={exp.id} exp={exp} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
