import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostComments from './components/PostComments';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/:id/comments" element={<PostComments />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-inner">
            <p>© 2026 PostHub — Clean React & Modern UI Application.</p>
            <div className="footer-badges">
              <span className="footer-pill">React 19</span>
              <span className="footer-pill">Vite</span>
              <span className="footer-pill">Clean Design</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
