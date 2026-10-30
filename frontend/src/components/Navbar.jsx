import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/about',      label: 'About' },
  { to: '/skills',     label: 'Skills' },
  { to: '/experience', label: 'XP' },
  { to: '/blog',       label: 'Blog' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 'var(--nav-height)',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        background: scrolled ? 'rgba(8,8,9,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'all 0.3s var(--ease-2)',
      }}>
        <div className="container" style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32,
              background: 'var(--p)',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--mono)',
              fontWeight: 700, fontSize: '0.9rem', color: '#000',
              letterSpacing: '-0.05em',
              flexShrink: 0,
            }}>
              K
            </div>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.75rem',
              color: 'var(--txt-3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              kaleg
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{
            display: 'flex', alignItems: 'center', gap: '0.25rem',
          }} className="desktop-nav">
            {LINKS.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.5rem 0.875rem',
                    borderRadius: 'var(--r)',
                    color: active ? 'var(--p)' : 'var(--txt-3)',
                    background: active ? 'var(--p-dim)' : 'transparent',
                    border: active ? '1px solid rgba(232,255,71,0.2)' : '1px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--txt)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--txt-3)'; }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/admin"
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.68rem',
                color: 'var(--txt-3)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.4rem 0.75rem',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.color = 'var(--txt)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--txt-3)'; }}
            >
              Admin
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: 'none', border: '1px solid var(--line)',
                borderRadius: 'var(--r)', padding: '0.4rem 0.5rem',
                color: 'var(--txt-2)', cursor: 'pointer',
                display: 'none',
                flexDirection: 'column', gap: '4px',
                alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36,
              }}
              id="nav-hamburger"
              aria-label="Toggle menu"
            >
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: 'block', width: 16, height: 1.5,
                  background: open && i === 1 ? 'transparent' : 'var(--txt-2)',
                  transition: 'all 0.2s',
                  transform: open
                    ? i === 0 ? 'translateY(5.5px) rotate(45deg)'
                    : i === 2 ? 'translateY(-5.5px) rotate(-45deg)'
                    : 'none'
                    : 'none',
                }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(8,8,9,0.98)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: '0 2rem',
          paddingTop: 'var(--nav-height)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            {LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'block',
                  fontFamily: 'var(--mono)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: pathname === to ? 'var(--p)' : 'var(--txt-2)',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--line)',
                  transition: 'color 0.15s',
                }}
              >
                {label}
              </Link>
            ))}
            <Link to="/admin" style={{
              display: 'block', fontFamily: 'var(--mono)',
              fontSize: '0.8rem', color: 'var(--txt-3)',
              marginTop: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              → Admin Panel
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          #nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
