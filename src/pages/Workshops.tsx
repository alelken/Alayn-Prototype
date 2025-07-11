import React from 'react';
import { FaChalkboardTeacher, FaBookOpen, FaDumbbell, FaUserCircle, FaHome, FaStar } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Navbar from '../components/Navbar';
import { colors } from '../theme';

const workshops = [
  { title: 'Mindful Parenting Basics', date: '12 Aug 2025', price: 500 },
  { title: 'Career Growth Strategies', date: '20 Aug 2025', price: 650 },
];

const navItems = [
  { icon: <FaHome />, label: 'Home', onClick: () => window.location.pathname = '/' },
  { icon: <FaDumbbell />, label: 'Exercises', onClick: () => window.location.pathname = '/mindful-exercises' },
  { icon: <FaBookOpen />, label: 'Library', onClick: () => window.location.pathname = '/media-library' },
  { icon: <FaStar />, label: 'Analysis', onClick: () => window.location.pathname = '/personality-analysis' },
];

function WorkshopCard({ title, date, price }: { title: string; date: string; price: number }) {
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
      <div className="avatar-placeholder"><FaChalkboardTeacher /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div style={{ color: colors.gray }}>{date}</div>
        <div style={{ color: colors.green, fontWeight: 600 }}>₹{price}</div>
      </div>
      <button className="btn">Buy Ticket</button>
    </Card>
  );
}

export default function Workshops() {
  return (
    <div className="dashboard-bg">
      <div className="container">
        <SectionTitle>Therapist Videos & Workshops</SectionTitle>
        {workshops.map((w) => (
          <WorkshopCard key={w.title} {...w} />
        ))}
        <div style={{ height: 72 }} />
      </div>
      <Navbar items={navItems} />
    </div>
  );
}
