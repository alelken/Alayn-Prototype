import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const media = [
  { id: 'gandhi', title: 'Gandhi: Power of Persistence', free: true, url: 'https://www.w3schools.com/html/mov_bbb.mp4', description: 'A documentary on Gandhi’s philosophy and persistence.' },
  { id: 'chanakya', title: 'Chanakya: Strategy and Wisdom', free: true, url: 'https://www.w3schools.com/html/movie.mp4', description: 'Explore the strategies and wisdom of Chanakya.' },
  { id: 'teresa', title: 'Mother Teresa: Compassion in Action', free: false, description: 'The life and work of Mother Teresa.' },
];

function ListItem({ id, title, free, url, onPlay }: { id: string; title: string; free: boolean; url?: string; onPlay?: () => void }) {
  return (
    <div className="item-card">
      <div className="avatar-placeholder" />
      <div className="item-info">
        <h2>{title}
          <span className={`badge ${free ? 'badge-free' : 'badge-premium'}`}>{free ? 'Free' : 'Premium'}</span>
        </h2>
        <button className="btn" disabled={!free} onClick={free && onPlay ? onPlay : undefined}>
          {free ? 'Play' : 'Locked'}
        </button>
      </div>
    </div>
  );
}

export default function MediaLibrary() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredMedia = media.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  const handlePlay = (item: typeof media[0]) => {
    if (item.free && item.id) {
      navigate(`/video/${item.id}`);
    }
  };

  return (
    <div className="container">
      <h1>Media Library</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: 'var(--color-peacock)', marginRight: 8, fontSize: 18 }}>🔍</span>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            fontSize: 16,
            padding: 8,
            borderRadius: 8,
            border: '1px solid #b9a5ff',
            outline: 'none',
            background: '#f5e9da',
            color: 'var(--color-charcoal)'
          }}
        />
      </div>
      <div className="list">
        {filteredMedia.length === 0 && <div style={{ color: '#888', padding: 16 }}>No media found.</div>}
        {filteredMedia.map((m) => (
          <ListItem key={m.id} id={m.id} title={m.title} free={m.free} url={m.url} onPlay={() => handlePlay(m)} />
        ))}
      </div>
    </div>
  );
}
