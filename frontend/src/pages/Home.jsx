import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, ArrowUpRight, Mail } from 'lucide-react';
import { getProfile, getSkills } from '../api';

/* Typing animation hook */
function useTypewriter(words, speed = 90, pause = 2000) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    const word = words[wordIdx % words.length];
    let timeout;
    if (typing) {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setTyping(false), pause);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), speed / 2);
      } else {
        setWordIdx(i => i + 1);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, typing, wordIdx]);
  return text;
}

/* Animated counter */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => {
        start += Math.ceil(to / 40);
        if (start >= to) { setVal(to); return; }
        setVal(start);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const ROLES = ['Full Stack Developer', 'Laravel Developer', 'React Developer', 'UI Engineer'];

const STACK = [
  'React', 'Laravel', 'TypeScript', 'MySQL', 'Docker',
  'Node.js', 'Vue.js', 'PHP', 'Redis', 'Linux',
  'Nginx', 'Git', 'Tailwind', 'REST API', 'Figma',
];

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);
  const role = useTypewriter(ROLES);

  useEffect(() => {
    document.title = 'Kaleg — Full Stack Developer';
    getProfile().then(setProfile).catch(() => {});
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const name = profile?.name || 'Kaleg';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <main>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section style={{
        minHeight: '100vh',
        paddingTop: 'var(--nav-height)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* grid bg */}
        <div className="grid-lines" />

        {/* corner label */}
        <div style={{
          position: 'absolute', top: 'calc(var(--nav-height) + 1.5rem)', right: '2rem',
          fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--txt-3)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem',
        }}>
          <span>v1.0 — 2025</span>
          <span style={{ color: 'var(--p)', opacity: 0.6 }}>kaleg.my.id</span>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: ready ? 1 : 0,
            transform: ready ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.7s var(--ease), transform 0.7s var(--ease)',
          }}>

            {/* eyebrow */}
            <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>
              {profile?.is_available
                ? <><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--p)', display: 'inline-block', boxShadow: '0 0 8px var(--p)' }} /> Available for work</>
                : 'Portfolio'}
            </div>

            {/* name */}
            <h1 style={{ marginBottom: '0.5rem', lineHeight: 1 }}>
              {name}
              <span style={{ color: 'var(--p)' }}>.</span>
            </h1>

            {/* typed role */}
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              color: 'var(--txt-2)',
              marginBottom: '2rem',
              height: '2em',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ color: 'var(--p)', opacity: 0.5 }}>→</span>
              <span>{role}</span>
              <span className="cursor" style={{ color: 'var(--p)' }}>_</span>
            </div>

            {/* description */}
            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              lineHeight: 1.75, maxWidth: 520,
              marginBottom: '2.5rem',
              color: 'var(--txt-2)',
            }}>
              {profile?.tagline || 'Building fast, beautiful web apps from Indonesia.'}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link to="/about" className="btn btn-primary">
                See my work <ArrowRight size={15} />
              </Link>
              <a href={`mailto:${profile?.email || 'hello@kaleg.my.id'}`} className="btn btn-outline">
                <Mail size={15} /> Get in touch
              </a>
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  <Github size={15} /> GitHub
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  <Linkedin size={15} /> LinkedIn
                </a>
              )}
            </div>

            {/* quick nav */}
            <div style={{
              display: 'flex', gap: '2rem', flexWrap: 'wrap',
              fontFamily: 'var(--mono)', fontSize: '0.75rem',
              color: 'var(--txt-3)', letterSpacing: '0.05em',
            }}>
              {[['About', '/about'], ['Skills', '/skills'], ['Experience', '/experience'], ['Blog', '/blog']].map(([label, to]) => (
                <Link key={to} to={to} style={{ transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--p)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}>
                  {label} ↗
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '2rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          fontFamily: 'var(--mono)', fontSize: '0.68rem',
          color: 'var(--txt-3)', letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          <div style={{
            width: 1, height: 48,
            background: 'linear-gradient(to bottom, var(--p), transparent)',
            animation: 'float 2s ease-in-out infinite',
          }} />
          Scroll
        </div>
      </section>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <section style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            borderLeft: '1px solid var(--line)',
          }}>
            {[
              { n: 3, suf: '+', label: 'Years experience' },
              { n: 20, suf: '+', label: 'Projects shipped' },
              { n: 15, suf: '+', label: 'Tech stack' },
              { n: 100, suf: '%', label: 'Dedication' },
            ].map(({ n, suf, label }) => (
              <div key={label} style={{
                padding: '2.5rem 1.5rem',
                borderRight: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
              }}>
                <div className="stat-num">
                  <Counter to={n} suffix={suf} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--txt-3)', marginTop: '0.35rem', fontFamily: 'var(--mono)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── MARQUEE STACK ───────────────── */}
      <section style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)' }}>
        <div className="ticker">
          <div className="ticker-inner">
            {[...STACK, ...STACK].map((tech, i) => (
              <span key={i} style={{
                fontFamily: 'var(--mono)', fontSize: '0.75rem',
                color: 'var(--txt-3)', letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '1.5rem',
              }}>
                <span style={{ color: 'var(--p)', fontSize: '0.5rem' }}>◆</span>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── FEATURED WORK ───────────────── */}
      <section className="section" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: '3rem', gap: '1rem', flexWrap: 'wrap',
          }}>
            <div>
              <div className="eyebrow">Work</div>
              <h2 style={{ maxWidth: 480 }}>
                Building things that<br />
                <span style={{ color: 'var(--p)' }}>matter.</span>
              </h2>
            </div>
            <Link to="/experience" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
              Full experience <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'var(--line)' }}>
            {[
              { num: '01', title: 'Full Stack', desc: 'End-to-end development from database schema to pixel-perfect UI.', tag: 'Core Skill' },
              { num: '02', title: 'API Design', desc: 'RESTful & clean APIs with Laravel Sanctum auth, rate limiting & proper HTTP semantics.', tag: 'Backend' },
              { num: '03', title: 'Frontend', desc: 'React + TypeScript SPAs with performance-first architecture and smooth UX.', tag: 'Frontend' },
            ].map(({ num, title, desc, tag }) => (
              <div key={num} style={{
                padding: '2.5rem 2rem',
                background: 'var(--bg)',
                transition: 'background 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
              >
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: '0.68rem',
                  color: 'var(--p)', marginBottom: '1.25rem',
                  letterSpacing: '0.1em',
                }}>
                  {num}
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{desc}</p>
                <span className="tag tag-p">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ─────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 4vw, 4rem)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '2rem',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* accent bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(to right, var(--p), transparent)',
            }} />
            <div>
              <div className="eyebrow" style={{ color: 'var(--txt-3)' }}>Let's talk</div>
              <h2 style={{ maxWidth: 480, lineHeight: 1.15 }}>
                Have a project?<br />
                <span style={{ color: 'var(--p)' }}>Let's build it.</span>
              </h2>
            </div>
            <a
              href={`mailto:${profile?.email || 'hello@kaleg.my.id'}`}
              className="btn btn-primary"
              style={{ fontSize: '1rem', padding: '0.9rem 2rem', flexShrink: 0 }}
            >
              Send a message <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
