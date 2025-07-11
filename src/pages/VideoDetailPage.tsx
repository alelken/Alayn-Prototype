import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBookOpen, FaDumbbell, FaUserCircle, FaHome, FaPlayCircle, FaStar } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
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

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const video = media.find(m => m.id === id);
  const related = media.filter(m => m.id !== id && m.free);

  if (!video) {
    return <div className="dashboard-bg"><div className="container"><SectionTitle>Video Not Found</SectionTitle></div></div>;
  }

  return (
    <div className="dashboard-bg">
      <div className="container">
        <div style={{ margin: '24px 0 16px 0' }}><BackButton /></div>
        <SectionTitle>{video.title}</SectionTitle>
        <Card>
          <div style={{ color: colors.gray, marginBottom: 16 }}>{video.description}</div>
          {video.free && video.url ? (
            <video controls style={{ width: '100%', borderRadius: 12, marginBottom: 20 }} src={video.url} />
          ) : (
            <div style={{ color: colors.green, textAlign: 'center', marginBottom: 20 }}>
              <b>This is a premium video. Please subscribe to access.</b>
            </div>
          )}
        </Card>
        <SectionTitle>Related Content</SectionTitle>
        {related.map(m => (
          <Link to={`/video/${m.id}`} key={m.id} style={{ textDecoration: 'none' }}>
            <Card style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div className="avatar-placeholder" />
              <div>
                <div style={{ fontWeight: 600 }}>{m.title}</div>
                <div style={{ color: colors.gray, fontSize: 14 }}>{m.description}</div>
              </div>
            </Card>
          </Link>
        ))}
        <div style={{ height: 72 }} />
      </div>
      <Navbar items={navItems} />
    </div>
  );
} 