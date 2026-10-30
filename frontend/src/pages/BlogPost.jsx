import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Eye, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { getPost } from '../api';
import { format } from 'date-fns';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPost(slug)
      .then(data => {
        setPost(data);
        document.title = `${data.title} — Kaleg`;
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Article not found</h2>
          <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </main>
    );
  }

  // Convert markdown-like content to HTML paragraphs (simple renderer)
  const renderContent = (content) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
        if (line.startsWith('```')) return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i}>{line}</p>;
      });
  };

  return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      {/* Back */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        <button
          onClick={() => navigate('/blog')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: 'var(--text-muted)', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-sans)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Blog
        </button>
      </div>

      {/* Cover image */}
      {post.cover_image && (
        <div style={{
          height: 'clamp(200px, 40vw, 420px)',
          overflow: 'hidden',
          margin: '2rem 0',
        }}>
          <img
            src={post.cover_image}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <article className="container" style={{ maxWidth: 780, paddingBottom: '6rem' }}>
        {/* Meta */}
        <div style={{ paddingTop: post.cover_image ? 0 : '2rem', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
            {post.category && (
              <span className="badge badge-accent">{post.category}</span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Clock size={13} /> {post.read_time} min read
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Eye size={13} /> {post.views} views
            </span>
            {post.published_at && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Calendar size={13} /> {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </span>
            )}
          </div>

          <h1 style={{ marginBottom: '1.25rem', lineHeight: 1.25 }}>{post.title}</h1>

          {post.excerpt && (
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border)',
              marginBottom: '2rem',
              fontStyle: 'italic',
            }}>
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="prose">
          {renderContent(post.content)}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Tag size={16} style={{ color: 'var(--text-muted)' }} />
              {post.tags.map(tag => (
                <Link key={tag} to={`/blog?tag=${tag}`} className="badge" style={{ fontSize: '0.8rem' }}>
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <Link to="/blog" className="btn btn-outline">
            <ArrowLeft size={16} /> More Articles
          </Link>
        </div>
      </article>
    </main>
  );
}
