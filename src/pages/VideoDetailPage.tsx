import React from 'react';
import { useParams, Link } from 'react-router-dom';

const media = [
  { id: 'gandhi', title: 'Gandhi: Power of Persistence', free: true, url: 'https://www.w3schools.com/html/mov_bbb.mp4', description: 'A documentary on Gandhi’s philosophy and persistence.' },
  { id: 'chanakya', title: 'Chanakya: Strategy and Wisdom', free: true, url: 'https://www.w3schools.com/html/movie.mp4', description: 'Explore the strategies and wisdom of Chanakya.' },
  { id: 'teresa', title: 'Mother Teresa: Compassion in Action', free: false, description: 'The life and work of Mother Teresa.' },
];

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const video = media.find(m => m.id === id);
  const related = media.filter(m => m.id !== id && m.free);

  if (!video) {
    return <div className="container"><h1>Video Not Found</h1></div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: 8 }}>{video.title}</h1>
      <div style={{ color: '#888', marginBottom: 16 }}>{video.description}</div>
      {video.free && video.url ? (
        <video controls style={{ width: '100%', borderRadius: 12, marginBottom: 20 }} src={video.url} />
      ) : (
        <div className="card" style={{ color: 'var(--color-peacock)', textAlign: 'center', marginBottom: 20 }}>
          <b>This is a premium video. Please subscribe to access.</b>
        </div>
      )}
      <div style={{ fontWeight: 600, color: 'var(--color-peacock)', marginBottom: 8 }}>Related Content</div>
      <div className="list">
        {related.map(m => (
          <Link to={`/video/${m.id}`} key={m.id} className="item-card" style={{ textDecoration: 'none' }}>
            <div className="avatar-placeholder" />
            <div className="item-info">
              <h2 style={{ marginBottom: 2 }}>{m.title}</h2>
              <div style={{ color: '#888', fontSize: 14 }}>{m.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 