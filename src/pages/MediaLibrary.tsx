import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaDumbbell, FaUserCircle, FaHome, FaPlayCircle, FaStar } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Navbar from '../components/Navbar';
import { colors } from '../theme';

const media = [
  { id: 'gandhi', title: 'Gandhi: Power of Persistence', free: true, url: 'https://www.w3schools.com/html/mov_bbb.mp4', description: 'A documentary on Gandhi’s philosophy and persistence.', thumbnail: '' },
  { id: 'chanakya', title: 'Chanakya: Strategy and Wisdom', free: true, url: 'https://www.w3schools.com/html/movie.mp4', description: 'Explore the strategies and wisdom of Chanakya.', thumbnail: '' },
  { id: 'teresa', title: 'Mother Teresa: Compassion in Action', free: false, description: 'The life and work of Mother Teresa.', thumbnail: '' },
];

const navItems = [
  { icon: <FaHome />, label: 'Home', onClick: () => window.location.pathname = '/' },
  { icon: <FaDumbbell />, label: 'Exercises', onClick: () => window.location.pathname = '/mindful-exercises' },
  { icon: <FaBookOpen />, label: 'Library', active: true, onClick: () => window.location.pathname = '/media-library' },
  { icon: <FaStar />, label: 'Analysis', onClick: () => window.location.pathname = '/personality-analysis' },
];

function VideoCard({ id, title, free, thumbnail, onClick }: { id: string; title: string; free: boolean; thumbnail?: string; onClick: () => void }) {
  return (
    <Card style={{ marginBottom: 16, padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={onClick}>
        <div style={{ width: 64, height: 40, borderRadius: 8, background: colors.lavender, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {thumbnail ? (
            <img src={thumbnail} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FaPlayCircle size={28} color={colors.gray} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <div style={{ color: colors.gray, fontSize: 14 }}>{free ? 'Free' : 'Premium'}</div>
        </div>
        <span style={{ background: free ? colors.green : colors.lavender, color: colors.text, borderRadius: 12, padding: '2px 10px', fontSize: 13, fontWeight: 500 }}>{free ? 'Free' : 'Premium'}</span>
      </div>
    </Card>
  );
}

export default function MediaLibrary() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredMedia = media.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard-bg">
      <div className="container">
        <SectionTitle>Media Library</SectionTitle>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: colors.green, marginRight: 8, fontSize: 18 }}>🔍</span>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                fontSize: 16,
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${colors.lavender}`,
                outline: 'none',
                background: colors.background,
                color: colors.text
              }}
            />
          </div>
        </Card>
        {filteredMedia.length === 0 && <Card><div style={{ color: colors.gray, padding: 16 }}>No media found.</div></Card>}
        {filteredMedia.map((m) => (
          <VideoCard key={m.id} id={m.id} title={m.title} free={m.free} thumbnail={m.thumbnail} onClick={() => navigate(`/video/${m.id}`)} />
        ))}
        <div style={{ height: 72 }} />
      </div>
      <Navbar items={navItems} />
    </div>
  );
}
