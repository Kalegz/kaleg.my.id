import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Code2, Briefcase, FileText, Eye, TrendingUp } from 'lucide-react';
import { getProfile, getSkills, getExperiences, getAdminPosts } from '../../api';

function useIsMobile(bp = 640) {
  const [mobile, setMobile] = useState(window.innerWidth < bp);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return mobile;
}

function StatCard({ icon: Icon, label, value, color, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'all 0.3s ease' }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `${color}22`,
          border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-primary)' }}>{value ?? '–'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard — Admin';
    Promise.allSettled([
      getProfile(),
      getSkills(),
      getExperiences(),
      getAdminPosts(),
    ]).then(([profile, skills, exp, postsData]) => {
      const skillCount = skills.status === 'fulfilled'
        ? Object.values(skills.value).flat().length
        : 0;
      setStats({
        profile: profile.status === 'fulfilled' ? 1 : 0,
        skills: skillCount,
        experiences: exp.status === 'fulfilled' ? exp.value.length : 0,
        posts: postsData.status === 'fulfilled' ? postsData.value.length : 0,
      });
      if (postsData.status === 'fulfilled') {
        setPosts(postsData.value.slice(0, 5));
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: isMobile ? '1.25rem' : '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.75rem', marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <StatCard icon={User} label="Profile" value="Active" color="#6c63ff" to="/admin/profile" />
        <StatCard icon={Code2} label="Skills" value={stats.skills} color="#00d9c0" to="/admin/skills" />
        <StatCard icon={Briefcase} label="Experiences" value={stats.experiences} color="#ffd166" to="/admin/experience" />
        <StatCard icon={FileText} label="Blog Posts" value={stats.posts} color="#ff6b6b" to="/admin/posts" />
      </div>

      {/* Recent Posts */}
      <div className="card">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '1rem' }}>Recent Posts</h3>
          <Link to="/admin/posts" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <FileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
            <p style={{ fontSize: '0.875rem' }}>No posts yet. <Link to="/admin/posts" style={{ color: 'var(--accent)' }}>Create one</Link></p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {posts.map(post => (
              <div key={post.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem',
                borderRadius: 8,
                background: 'var(--bg-secondary)',
                gap: '1rem',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 500, fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {post.title}
                  </div>
                  {post.category && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.category}</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Eye size={12} /> {post.views}
                    </div>
                  )}
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: post.status === 'published' ? 'rgba(0,217,192,0.15)' : 'rgba(255,209,102,0.15)',
                    color: post.status === 'published' ? 'var(--teal)' : '#ffd166',
                    border: `1px solid ${post.status === 'published' ? 'var(--teal)' : '#ffd166'}44`,
                  }}>
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/posts" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <FileText size={15} /> New Post
          </Link>
          <Link to="/admin/skills" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            <Code2 size={15} /> Manage Skills
          </Link>
          <Link to="/admin/profile" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            <User size={15} /> Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
