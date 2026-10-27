import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPostById, fetchUserById, fetchPostComments } from '../services/api';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = parseInt(id, 10);

  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [error, setError] = useState(null);

  // Interaktiv holatlar (Likes, Bookmark, Toast)
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Yangi izoh qo'shish formasi holati
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentEmail, setNewCommentEmail] = useState('');
  const [newCommentBody, setNewCommentBody] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setLoading(true);
    setLoadingComments(true);
    setError(null);
  }

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Post va unga tegishli muallifni yuklash
    fetchPostById(id)
      .then((postData) => {
        if (!isMounted) return null;
        setPost(postData);
        // Tasodifiy likes hisoblash
        setLikeCount(Math.floor(Math.abs(Math.sin(numericId) * 45)) + 8);
        return fetchUserById(postData.userId);
      })
      .then((userData) => {
        if (!isMounted) return;
        if (userData) setUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Post maʼlumotlarini yuklashda xatolik yuz berdi');
          setLoading(false);
        }
      });

    // Izohlarni oldindan yuklash
    fetchPostComments(id)
      .then((commentsData) => {
        if (isMounted) {
          setComments(commentsData || []);
          setLoadingComments(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingComments(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, numericId]);

  const handleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      showToast(next ? 'Postga like bosildi! ❤️' : 'Like bekor qilindi');
      return next;
    });
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      showToast(next ? 'Post saqlanganlarga qoʻshildi! 🔖' : 'Post saqlanganlardan olib tashlandi');
      return next;
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Havola buferga nusxalandi! 📋');
    } else {
      showToast('Havolani nusxalash imkoni boʻlmadi');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentBody.trim()) {
      showToast('Iltimos, ism va izoh matnini toʻldiring');
      return;
    }

    const newCommentObj = {
      id: Date.now(),
      postId: numericId,
      name: newCommentName.trim(),
      email: newCommentEmail.trim() || 'user@example.com',
      body: newCommentBody.trim(),
    };

    setComments([newCommentObj, ...comments]);
    setNewCommentName('');
    setNewCommentEmail('');
    setNewCommentBody('');
    showToast('Izohingiz muvaffaqiyatli qoʻshildi! 💬');
  };

  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p>Post va muallif maʼlumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="status-container error">
        <div className="error-icon">⚠️</div>
        <h3>Post topilmadi yoki xatolik yuz berdi</h3>
        <p>{error || 'Soʻralgan post mavjud emas.'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          ← Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  const readingTime = Math.max(1, Math.ceil(post.body.split(' ').length / 20));

  return (
    <div className="detail-page-wrapper">
      {/* Toast Bildirishnoma */}
      {toastMessage && (
        <div className="toast-notification">
          <span>🔔</span> {toastMessage}
        </div>
      )}

      {/* Yuqori navigatsiya paneli */}
      <div className="detail-top-bar">
        <button 
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }} 
          className="btn-back"
          title="Orqaga qaytish"
        >
          ← Orqaga qaytish
        </button>

        <div className="post-nav-controls">
          <Link
            to={`/posts/${numericId - 1}`}
            className={`btn-nav-step ${numericId <= 1 ? 'disabled' : ''}`}
            title="Oldingi post"
          >
            ← Oldingi
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>
            Post #{numericId}
          </span>
          <Link
            to={`/posts/${numericId + 1}`}
            className={`btn-nav-step ${numericId >= 100 ? 'disabled' : ''}`}
            title="Keyingi post"
          >
            Keyingi →
          </Link>
        </div>
      </div>

      {/* Asosiy Post Kartochkasi */}
      <article className="post-detail-main-card">
        {/* Post metama'lumotlari & asboblar */}
        <div className="post-detail-header-meta">
          <div className="detail-badges">
            <span className="badge-id">ID: #{post.id}</span>
            <span className="badge-tag">Mavzu: Texnologiya</span>
            <span className="reading-time">⏱️ {readingTime} daqiqa oʻqish</span>
          </div>

          <div className="post-interaction-tools">
            <button 
              onClick={handleLike} 
              className={`tool-btn ${isLiked ? 'active-like' : ''}`}
              title="Like"
            >
              {isLiked ? '❤️' : '🤍'} {likeCount}
            </button>
            <button 
              onClick={handleBookmark} 
              className={`tool-btn ${isBookmarked ? 'active-bookmark' : ''}`}
              title="Saqlab qoʻyish"
            >
              {isBookmarked ? '🔖 Saqlandi' : '📑 Saqlash'}
            </button>
            <button 
              onClick={handleShare} 
              className="tool-btn"
              title="Havolani nusxalash"
            >
              🔗 Ulashish
            </button>
          </div>
        </div>

        {/* Post Sarlavhasi */}
        <h1 className="detail-title">{post.title}</h1>

        {/* Muallifning toʻliq profili kartochkasi */}
        {user ? (
          <div className="author-profile-card">
            <div className="author-profile-top">
              <div className="author-avatar-gradient">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="author-main-info">
                <div className="author-title-row">
                  <span className="author-full-name">{user.name}</span>
                  <span className="author-username-badge">@{user.username}</span>
                </div>
                {user.company && (
                  <p className="author-company-phrase">
                    🏢 <strong>{user.company.name}</strong>
                    {user.company.catchPhrase && ` — "${user.company.catchPhrase}"`}
                  </p>
                )}
              </div>
            </div>

            <div className="author-details-grid">
              <div className="author-detail-item">
                <span className="author-detail-icon">✉️</span>
                <span>
                  Email:{' '}
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </span>
              </div>
              {user.phone && (
                <div className="author-detail-item">
                  <span className="author-detail-icon">📞</span>
                  <span>
                    Tel: <a href={`tel:${user.phone}`}>{user.phone}</a>
                  </span>
                </div>
              )}
              {user.website && (
                <div className="author-detail-item">
                  <span className="author-detail-icon">🌐</span>
                  <span>
                    Veb-sayt:{' '}
                    <a href={`https://${user.website}`} target="_blank" rel="noreferrer">
                      {user.website}
                    </a>
                  </span>
                </div>
              )}
              {user.address && (
                <div className="author-detail-item">
                  <span className="author-detail-icon">📍</span>
                  <span>
                    Manzil: {user.address.city}, {user.address.street}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="author-profile-card">
            <p style={{ color: 'var(--text-muted)' }}>Muallif: Foydalanuvchi #{post.userId}</p>
          </div>
        )}

        {/* Post Mazmuni */}
        <div className="post-detail-content">
          <p>{post.body}</p>
        </div>

        {/* Post ostidagi tugmalar */}
        <div className="detail-actions-footer">
          <button 
            onClick={() => setShowComments(!showComments)} 
            className="btn btn-secondary"
          >
            💬 Izohlar ({comments.length}) {showComments ? '▲ Yashirish' : '▼ Koʻrish'}
          </button>

          <Link to={`/posts/${post.id}/comments`} className="btn btn-ghost">
            Toʻliq izohlar sahifasiga oʻtish →
          </Link>
        </div>
      </article>

      {/* Ichki Izohlar Boʻlimi (Embedded Comments) */}
      {showComments && (
        <section className="detail-comments-section">
          <div className="detail-comments-header">
            <h3>
              <span>💬</span> Fikr-mulohazalar va izohlar
              <span className="comment-count-pill">{comments.length} ta izoh</span>
            </h3>
          </div>

          {/* Yangi izoh qoʻshish formasi */}
          <div className="add-comment-box">
            <h4>Yangi fikr bildirish:</h4>
            <form onSubmit={handleAddComment} className="add-comment-form">
              <div className="comment-input-row">
                <input
                  type="text"
                  placeholder="Ismingiz*"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Elektron pochtangiz"
                  value={newCommentEmail}
                  onChange={(e) => setNewCommentEmail(e.target.value)}
                  className="form-input"
                />
              </div>
              <textarea
                placeholder="Fikringiz yoki savolingizni yozing...*"
                value={newCommentBody}
                onChange={(e) => setNewCommentBody(e.target.value)}
                className="form-input form-textarea"
                rows={3}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">
                  Yuborish ✈️
                </button>
              </div>
            </form>
          </div>

          {/* Izohlar roʻyxati */}
          {loadingComments ? (
            <div className="status-container" style={{ minHeight: '150px' }}>
              <div className="spinner"></div>
              <p>Izohlar yuklanmoqda...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="empty-state">
              <p>Hozircha hech qanday izoh mavjud emas. Birinchi boʻlib fikr qoldiring!</p>
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
                      <div className="comment-user-email">{comment.email}</div>
                    </div>
                  </div>
                  <p className="comment-body-text">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
