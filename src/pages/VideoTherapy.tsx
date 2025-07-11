import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaChalkboardTeacher, FaSearch, FaBookOpen, FaDumbbell, FaUserCircle, FaHome, FaStar } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Navbar from '../components/Navbar';
import { colors } from '../theme';

const therapists = [
  { id: 'asha', name: 'Dr. Asha Singh', specialty: 'Career Counselling', fee: 1500 },
  { id: 'ravi', name: 'Dr. Ravi Kumar', specialty: 'Parental Advice', fee: 1200 },
  { id: 'meera', name: 'Dr. Meera Das', specialty: 'Stress Management', fee: 1000 },
];

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

function TherapistCard({ id, name, specialty, fee }: { id: string; name: string; specialty: string; fee: number }) {
  return (
    <Link to={`/therapist/${id}`} style={{ textDecoration: 'none' }}>
      <Card style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div className="avatar-placeholder"><FaUserMd /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ color: colors.gray }}>{specialty}</div>
          <div style={{ color: colors.green, fontWeight: 600 }}>₹{fee}</div>
        </div>
        <button className="btn" type="button">View Profile</button>
      </Card>
    </Link>
  );
}

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

export default function VideoTherapy() {
  const [search, setSearch] = useState('');
  const filteredTherapists = therapists.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-bg">
      <div className="container">
        <SectionTitle>Therapist Videos & Workshops</SectionTitle>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <FaSearch style={{ color: colors.green, marginRight: 8 }} />
            <input
              type="text"
              placeholder="Search by name or specialty..."
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
        <SectionTitle>Therapists</SectionTitle>
        {filteredTherapists.length === 0 && <Card><div style={{ color: colors.gray, padding: 16 }}>No therapists found.</div></Card>}
        {filteredTherapists.map((t) => (
          <TherapistCard key={t.id} {...t} />
        ))}
        <SectionTitle>Workshops</SectionTitle>
        {workshops.map((w) => (
          <WorkshopCard key={w.title} {...w} />
        ))}
        <div style={{ height: 72 }} />
      </div>
      <Navbar items={navItems} />
    </div>
  );
}
