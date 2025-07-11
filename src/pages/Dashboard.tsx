import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCalendarAlt, FaBookOpen, FaPlayCircle, FaUserMd } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { colors } from '../theme';

const clientName = 'Alex';
const avatarUrl = '';
const nextSession = {
  therapist: 'Dr. Smith',
  photo: '',
  date: 'Today',
  time: '3:00 PM',
  id: 1,
};
const quickActions = [
  { icon: <FaUserMd />, text: 'Therapy', to: '/therapy' },
  { icon: <FaPlayCircle />, text: 'Start Exercise', to: '/mindful-exercises' },
  { icon: <FaBookOpen />, text: 'Library', to: '/media-library' },
  { icon: <FaCalendarAlt />, text: 'Book', to: '/therapy' },
];

export default function Dashboard() {
  const [mood, setMood] = useState(1);
  const moods = ['😔', '😐', '😊'];
  return (
    <div className="dashboard-bg">
      <div className="container">
        {/* Greeting and notification */}
        <div className="dash-header" style={{ marginBottom: 24 }}>
          <Link to="/profile" className="avatar-wrap" style={{ cursor: 'pointer' }}>{avatarUrl ? <img src={avatarUrl} alt="avatar" /> : <FaUserCircle size={36} />}</Link>
          <div className="greeting">
            <div className="greet-text">Good morning, <b>{clientName}</b>!</div>
          </div>
          <button className="notif-bell" aria-label="Notifications" type="button">
            <FaBell size={22} />
          </button>
        </div>
        <SectionTitle>What's your mood?</SectionTitle>
        <Card>
          <div className="mood-emojis" style={{ justifyContent: 'center', gap: 24 }}>
            {moods.map((m, i) => (
              <button key={i} className={mood === i ? 'mood-btn active' : 'mood-btn'} onClick={() => setMood(i)}>{m}</button>
            ))}
          </div>
        </Card>
        <SectionTitle>Next Session</SectionTitle>
        <Card>
          <div className="session-info" style={{ alignItems: 'center', gap: 16 }}>
            <div className="therapist-pic">{nextSession.photo ? <img src={nextSession.photo} alt="therapist" /> : <FaUserCircle size={32} />}</div>
            <div>
              <div className="therapist-name">{nextSession.therapist}</div>
              <div className="session-datetime">{nextSession.date}, {nextSession.time}</div>
            </div>
            <Link to="/therapy" className="btn">Book</Link>
          </div>
        </Card>
        {/* Quick Actions removed as per request */}
        <div style={{ height: 72 }} />
      </div>
      <BottomNav />
    </div>
  );
}
