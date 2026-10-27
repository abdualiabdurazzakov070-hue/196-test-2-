import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <span>⚡</span>
          </div>
          <span className="brand-text">PostHub</span>
        </Link>

        <div className="navbar-actions">
          <nav>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Bosh sahifa
            </Link>
          </nav>

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title="Mavzuni almashtirish (Dark / Light)"
          >
            {theme === 'dark' ? (
              <>
                <span>☀️</span> Kun rejimi
              </>
            ) : (
              <>
                <span>🌙</span> Tun rejimi
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
