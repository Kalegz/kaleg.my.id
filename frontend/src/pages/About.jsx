import { useEffect, useState } from 'react';
import { MapPin, Mail, Github, Linkedin, Twitter, Instagram, Download, Sparkles } from 'lucide-react';
import { getProfile } from '../api';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'About — Kaleg';
    getProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const socials = profile ? [
    { href: profile.github_url, icon: Github, label: 'GitHub' },
    { href: profile.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { href: profile.twitter_url, icon: Twitter, label: 'Twitter' },
    { href: profile.instagram_url, icon: Instagram, label: 'Instagram' },
  ].filter(s => s.href) : [];

  return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      <section className="section">
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '4rem' }}>
            <div className="section-label">About Me</div>
            <h1>
              The person <span className="gradient-text">behind the code</span>
            </h1>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}>
              {/* Left: Avatar + Info */}
              <div>
                {/* Avatar */}
                <div style={{
                  width: '100%',
                  maxWidth: 320,
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '6rem',
                      fontWeight: 800,
                      background: 'var(--gradient-hero)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {profile?.name?.[0] || 'K'}
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--gradient-card)',
                    opacity: 0.3,
                  }} />
                </div>

                {/* Quick info */}
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {profile?.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem' }}>{profile.location}</span>
                      </div>
                    )}
                    {profile?.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Mail size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <a href={`mailto:${profile.email}`} style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>
                          {profile.email}
                        </a>
                      </div>
                    )}
                    {profile?.is_available && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sparkles size={16} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--teal)' }}>Open to opportunities</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social links */}
                {socials.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {socials.map(({ href, icon: Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost"
                        style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}
                      >
                        <Icon size={15} /> {label}
                      </a>
                    ))}
                  </div>
                )}

                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                  >
                    <Download size={16} /> Download Resume
                  </a>
                )}
              </div>

              {/* Right: Bio Content */}
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>
                  Hi, I&apos;m{' '}
                  <span className="gradient-text">{profile?.name || 'Kaleg'}</span>
                </h2>

                {profile?.tagline && (
                  <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    marginBottom: '1.5rem',
                    lineHeight: 1.5,
                  }}>
                    {profile.tagline}
                  </p>
                )}

                <div style={{ whiteSpace: 'pre-line' }}>
                  {(profile?.bio || 'I am a passionate full stack developer...').split('\n').map((para, i) => (
                    <p key={i} style={{ marginBottom: '1rem', lineHeight: 1.8 }}>{para}</p>
                  ))}
                </div>

                {/* Values */}
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>What I value</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      { emoji: '⚡', title: 'Performance', desc: 'Fast, optimized code' },
                      { emoji: '🎨', title: 'Design', desc: 'Beautiful interfaces' },
                      { emoji: '🔒', title: 'Security', desc: 'Safe & reliable apps' },
                      { emoji: '♻️', title: 'Clean Code', desc: 'Maintainable codebase' },
                    ].map(({ emoji, title, desc }) => (
                      <div
                        key={title}
                        className="card"
                        style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
