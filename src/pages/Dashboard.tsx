import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaUserCircle, FaBookOpen, FaUserMd } from 'react-icons/fa';
import { GiLotus } from 'react-icons/gi';
import { MdAutoAwesome } from 'react-icons/md';
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
const features = [
  { icon: <FaUserMd />, text: 'Therapist Counseling', to: '/therapy' },
  { icon: <FaBookOpen />, text: 'Media Library', to: '/library' },
  { icon: <MdAutoAwesome />, text: 'Personality Analysis', to: '/analysis' },
  { icon: <GiLotus />, text: 'Mindful Exercises', to: '/exercises' },
];

const slides = [
  { title: 'Next session with Dr. Smith', subtitle: 'Tomorrow 3 PM' },
  { title: '“The mind is everything. What you think you become.”', subtitle: 'Buddha' },
  { title: 'Resume Breathing Exercise', subtitle: '' },
];

export default function Dashboard() {
  const [slide, setSlide] = useState(0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="dashboard-bg">
      <div className="container">
        {/* Greeting and notification */}
        <div className="dash-header" style={{ marginBottom: 24 }}>
          <Link to="/profile" className="avatar-wrap" style={{ cursor: 'pointer' }}>{avatarUrl ? <img src={avatarUrl} alt="avatar" /> : <FaUserCircle size={36} />}</Link>
          <div className="greeting">
            <div className="greet-text">{greeting}, <b>{clientName}</b>!</div>
          </div>
          <button className="notif-bell" aria-label="Notifications" type="button">
            <FaBell size={22} />
          </button>
        </div>
        <Card style={{ textAlign: 'center' }}>
          <div>{slides[slide].title}</div>
          {slides[slide].subtitle && <div style={{ color: colors.gray, marginTop: 4 }}>{slides[slide].subtitle}</div>}
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setSlide(s => (s - 1 + slides.length) % slides.length)} className="btn" style={{ marginRight: 8 }}>
              ‹
            </button>
            <button onClick={() => setSlide(s => (s + 1) % slides.length)} className="btn">
              ›
            </button>
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
        <div className="grid-list" style={{ marginTop: 16 }}>
          {features.map(f => (
            <Link key={f.text} to={f.to} className="card" style={{ textAlign: 'center' }}>
              <div className="card-icon">{f.icon}</div>
              <h2 style={{ fontSize: '1rem' }}>{f.text}</h2>
            </Link>
          ))}
        </div>
        <div style={{ height: 72 }} />
      </div>
      <BottomNav />
    </div>
  );
}
