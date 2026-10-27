import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../services/api';

const CATEGORIES = ['Barchasi', 'Texnologiya', 'Dasturlash', 'Dizayn', 'Biznes'];

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Barchasi');

  useEffect(() => {
    let isMounted = true;
    fetchPosts()
      .then((data) => {
        if (isMounted) {
          setPosts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Postlarni yuklashda xatolik yuz berdi');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeCategory === 'Barchasi') return matchesSearch;
    // Categorize pseudo-deterministically by post ID modulo
    const categoryIndex = (post.id % (CATEGORIES.length - 1)) + 1;
    return matchesSearch && CATEGORIES[categoryIndex] === activeCategory;
  });

  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p>Maqolalar toʻplami yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error">
        <div className="error-icon">⚠️</div>
        <h3>Xatolik yuz berdi</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Qayta urinib koʻrish
        </button>
      </div>
    );
  }

  return (
    <div className="posts-page-wrapper">
      {/* Hero boʻlimi */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>✨</span> Zamonaviy Maqolalar Portali
        </div>
        <h1 className="hero-title">
          Fikrlar va Maqolalar <span>Olamiga</span> Xush Kelibsiz
        </h1>
        <p className="hero-subtitle">
          Dunyo boʻylab ishlab chiquvchilar va mualliflarning qiziqarli maqolalarini oʻqing, 
          tahlil qiling va oʻz fikrlaringizni qoldiring.
        </p>

        {/* Statistikalar */}
        <div className="hero-stats-row">
          <div className="stat-item">
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">Jami Maqolalar</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10</span>
            <span className="stat-label">Mualliflar</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Izohlar</span>
          </div>
        </div>

        {/* Qidiruv va Filterlar */}
        <div className="controls-container">
          <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Maqola sarlavhasi yoki kalit soʻz boʻyicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="clear-search-btn"
                title="Tozalash"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-tags">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`tag-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Postlar Toʻri */}
      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔎</div>
          <h3>Mos keluvchi maqola topilmadi</h3>
          <p>Qidiruv soʻzini oʻzgartirib yoki boshqa kategoriyani tanlab koʻring.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => {
            const readingTime = Math.max(1, Math.ceil(post.body.split(' ').length / 20));
            return (
              <article key={post.id} className="post-card">
                <div>
                  <div className="post-card-header">
                    <span className="post-meta-badge">#{post.id} Post</span>
                    <span className="reading-time">⏱️ {readingTime} daqiqa</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.body}</p>
                </div>

                <div className="post-card-footer">
                  <Link to={`/posts/${post.id}`} className="btn btn-primary">
                    Batafsil oʻqish →
                  </Link>
                  <Link to={`/posts/${post.id}/comments`} className="btn btn-secondary">
                    💬 Izohlar
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
