import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight, Tag } from 'lucide-react';
import { getPosts } from '../api';
import { format } from 'date-fns';

function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <article
        className="card"
        style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
      >
        {/* Cover Image */}
        {post.cover_image && (
          <div style={{
            height: 200,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '1.25rem',
            background: 'var(--bg-secondary)',
          }}>
            <img
              src={post.cover_image}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
          </div>
        )}

        {/* No cover: gradient placeholder */}
        {!post.cover_image && (
          <div style={{
            height: 160,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '1.25rem',
            background: 'var(--gradient-card)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '2.5rem' }}>✍️</span>
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
          {post.category && (
            <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
              {post.category}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={12} /> {post.read_time} min read
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Eye size={12} /> {post.views}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', lineHeight: 1.4, flex: 1 }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border)',
        }}>
          {post.published_at && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {format(new Date(post.published_at), 'MMM d, yyyy')}
            </span>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--accent)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            Read more <ArrowRight size={14} />
          </div>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
                <Tag size={10} style={{ marginRight: 2 }} />{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    document.title = 'Blog — Kaleg';
  }, []);

  useEffect(() => {
    setLoading(true);
    getPosts({ page })
      .then(data => {
        setPosts(data.data || []);
        setLastPage(data.last_page || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      <section className="section">
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label">Writing</div>
            <h1 style={{ marginBottom: '1rem' }}>
              Thoughts &{' '}
              <span className="gradient-text">Articles</span>
            </h1>
            <p className="section-description">
              I write about web development, software architecture, and lessons learned
              from building real-world applications.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" />
            </div>
          ) : posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Coming Soon</h3>
              <p>Articles are being crafted. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-outline"
                    style={{ opacity: page === 1 ? 0.4 : 1 }}
                  >
                    Previous
                  </button>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                  }}>
                    {page} / {lastPage}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                    disabled={page === lastPage}
                    className="btn btn-outline"
                    style={{ opacity: page === lastPage ? 0.4 : 1 }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
