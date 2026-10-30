import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--line)',
      background: 'var(--bg)',
    }}>
      {/* top */}
      <div className="container" style={{
        padding: '3rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2.5rem',
      }}>
        {/* brand */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            marginBottom: '0.875rem',
          }}>
            <div style={{
              width: 28, height: 28, background: 'var(--p)',
              borderRadius: '4px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.8rem', color: '#000',
            }}>K</div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--txt-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Kaleg
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.65, maxWidth: 220 }}>
            Full Stack Developer.<br />Building for the web.
          </p>
        </div>

        {/* pages */}
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--txt-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Pages
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[['About', '/about'], ['Skills', '/skills'], ['Experience', '/experience'], ['Blog', '/blog']].map(([label, to]) => (
              <Link key={to} to={to} style={{
                fontSize: '0.875rem', color: 'var(--txt-2)', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--p)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-2)'}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* find me */}
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--txt-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Find me
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: Github, href: 'https://github.com/kaleg', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com/in/kaleg', label: 'LinkedIn' },
              { icon: Twitter, href: 'https://x.com/kaleg', label: 'Twitter' },
              { icon: Instagram, href: 'https://instagram.com/kaleg', label: 'Instagram' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                title={label}
                style={{
                  width: 36, height: 36,
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--txt-3)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--p)'; e.currentTarget.style.color = 'var(--p)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--txt-3)'; }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div style={{
        borderTop: '1px solid var(--line)',
        padding: '1.25rem 2rem',
      }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--txt-3)', letterSpacing: '0.05em' }}>
            © {year} Kaleg. Built with Laravel + React.
          </span>
          <Link
            to="/admin"
            style={{
              fontFamily: 'var(--mono)', fontSize: '0.68rem',
              color: 'var(--txt-3)', letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--p)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
          >
            Admin <ArrowUpRight size={10} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
