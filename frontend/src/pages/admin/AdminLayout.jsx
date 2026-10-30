import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, Code2, Briefcase, FileText,
  LogOut, Menu, X, ExternalLink, ChevronRight
} from 'lucide-react';
import { adminLogout, getAdminMe } from '../../api';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/profile', icon: User, label: 'Profile' },
  { to: '/admin/skills', icon: Code2, label: 'Skills' },
  { to: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { to: '/admin/posts', icon: FileText, label: 'Blog Posts' },
];

// Breakpoint: treat anything < 768px as mobile
const MOBILE_BP = 768;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // On desktop: sidebar can be collapsed to icon-only (72px) or expanded (240px)
  // On mobile: sidebar is a full-width drawer, hidden by default
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BP);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Derived: is sidebar "open" in the visible sense?
  const sidebarExpanded = isMobile ? mobileOpen : !desktopCollapsed;
  const SIDEBAR_WIDTH = isMobile ? 260 : (desktopCollapsed ? 72 : 240);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BP;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false); // close drawer when resizing to desktop
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin'); return; }
    getAdminMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try { await adminLogout(); } catch {}
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen(o => !o);
    } else {
      setDesktopCollapsed(c => !c);
    }
  }, [isMobile]);

  const showLabel = sidebarExpanded; // only show text when expanded

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ── Mobile overlay backdrop ──────────────────────────────── */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside style={{
        width: SIDEBAR_WIDTH,
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: isMobile ? (mobileOpen ? 0 : -SIDEBAR_WIDTH) : 0,
        top: 0, bottom: 0,
        zIndex: 100,
        transition: 'width 0.3s ease, left 0.3s ease',
        overflow: 'hidden',
      }}>
        {/* Sidebar Header */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          {showLabel ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.9rem', color: 'white',
                  flexShrink: 0,
                }}>K</div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>Admin Panel</span>
              </div>
              <button
                onClick={toggleSidebar}
                aria-label="Close sidebar"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.9rem', color: 'white',
              margin: '0 auto',
            }}>K</div>
          )}
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {!showLabel && (
            <button
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              style={{
                width: '100%', padding: '0.625rem', borderRadius: 8,
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', justifyContent: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <Menu size={18} />
            </button>
          )}
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                title={!showLabel ? label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: showLabel ? '0.625rem 0.875rem' : '0.625rem',
                  borderRadius: 8,
                  textDecoration: 'none',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  justifyContent: showLabel ? 'flex-start' : 'center',
                }}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {showLabel && <span>{label}</span>}
                {showLabel && isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '0.75rem 0.5rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {showLabel && user && (
            <div style={{
              padding: '0.75rem',
              borderRadius: 8,
              background: 'var(--bg-glass)',
              border: '1px solid var(--border)',
              marginBottom: '0.25rem',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          )}

          <a
            href="/"
            target="_blank"
            title="View Portfolio"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: showLabel ? '0.625rem 0.875rem' : '0.625rem',
              borderRadius: 8, textDecoration: 'none',
              color: 'var(--text-muted)', fontSize: '0.875rem',
              transition: 'all 0.15s',
              justifyContent: showLabel ? 'flex-start' : 'center',
            }}
          >
            <ExternalLink size={17} style={{ flexShrink: 0 }} />
            {showLabel && <span>View Portfolio</span>}
          </a>

          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: showLabel ? '0.625rem 0.875rem' : '0.625rem',
              borderRadius: 8,
              background: 'none', border: 'none',
              color: '#ff6b6b', cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-sans)',
              width: '100%',
              justifyContent: showLabel ? 'flex-start' : 'center',
            }}
          >
            <LogOut size={17} style={{ flexShrink: 0 }} />
            {showLabel && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        // On mobile: no margin (sidebar is off-canvas overlay)
        // On desktop: push content by sidebar width
        marginLeft: isMobile ? 0 : SIDEBAR_WIDTH,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>
        {/* ── Mobile top bar ──────────────────────────────────────── */}
        {isMobile && (
          <div style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            flexShrink: 0,
          }}>
            <button
              onClick={toggleSidebar}
              aria-label="Open menu"
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-primary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.5rem',
              }}
            >
              <Menu size={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.8rem', color: 'white',
              }}>K</div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Admin Panel</span>
            </div>
            <div style={{ width: 38 }} /> {/* spacer to center the title */}
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}
