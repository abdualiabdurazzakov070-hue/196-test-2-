import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPostComments, fetchPostById } from '../services/api';

export default function PostComments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Promise.all([fetchPostById(id), fetchPostComments(id)])
      .then(([postData, commentsData]) => {
        if (isMounted) {
          setPost(postData);
          setComments(commentsData || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Izohlarni yuklashda xatolik yuz berdi');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p>Post izohlari yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error">
        <div className="error-icon">⚠️</div>
        <h3>Xatolik yuz berdi</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Orqaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="detail-page-wrapper">
      <div className="detail-top-bar">
        <button 
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate(`/posts/${id}`);
            }
          }} 
          className="btn-back"
        >
          ← Orqaga qaytish
        </button>

        <Link to={`/posts/${id}`} className="btn btn-secondary">
          Post tafsilotlariga oʻtish 📖
        </Link>
      </div>

      {post && (
        <div className="post-context-summary-card">
          <span className="badge-id">Mavzu: Post #{post.id}</span>
          <h2>{post.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px', lineHeight: '1.6' }}>
            {post.body}
          </p>
        </div>
      )}

      <div className="detail-comments-section">
        <div className="detail-comments-header">
          <h3>
            <span>💬</span> Barcha Izohlar
            <span className="comment-count-pill">{comments.length} ta</span>
          </h3>
        </div>

        {comments.length === 0 ? (
          <div className="empty-state">
            <p>Ushbu maqolaga hali izohlar qoldirilmagan.</p>
          </div>
        ) : (
          <div className="comments-timeline">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item-card">
                <div className="comment-user-header">
                  <div className="comment-user-avatar">
                    {comment.name ? comment.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="comment-user-meta">
                    <div className="comment-user-name">{comment.name}</div>
                    <div className="comment-user-email">✉️ {comment.email}</div>
                  </div>
                </div>
                <p className="comment-body-text">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
