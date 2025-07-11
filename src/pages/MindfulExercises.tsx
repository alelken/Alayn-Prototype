import React, { useState } from 'react';
import { FaBookOpen, FaDumbbell, FaUserCircle, FaHome, FaStar } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Navbar from '../components/Navbar';
import { colors } from '../theme';

const exercises = [
  { title: 'Breathing', free: true, pic: '', video: '', },
  { title: 'Body Scan', free: false, pic: '', video: '', },
];

const navItems = [
  { icon: <FaHome />, label: 'Home', onClick: () => window.location.pathname = '/' },
  { icon: <FaDumbbell />, label: 'Exercises', active: true, onClick: () => window.location.pathname = '/mindful-exercises' },
  { icon: <FaBookOpen />, label: 'Library', onClick: () => window.location.pathname = '/media-library' },
  { icon: <FaStar />, label: 'Analysis', onClick: () => window.location.pathname = '/personality-analysis' },
];

export default function MindfulExercises() {
  const [search, setSearch] = useState('');
  const filteredExercises = exercises.filter(ex => ex.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="dashboard-bg">
      <div className="container">
        <SectionTitle>Mindful Exercises</SectionTitle>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: colors.green, marginRight: 8, fontSize: 18 }}>🔍</span>
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
                border: `1px solid ${colors.lavender}`,
                outline: 'none',
                background: colors.background,
                color: colors.text
              }}
            />
          </div>
        </Card>
        {filteredExercises.length === 0 && <Card><div style={{ color: colors.gray, padding: 16 }}>No exercises found.</div></Card>}
        {filteredExercises.map((ex) => (
          <Card key={ex.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="avatar-placeholder" style={{ fontSize: 28 }}><FaDumbbell /></div>
              <div>
                <div style={{ fontWeight: 600 }}>{ex.title}</div>
                <div style={{ color: colors.gray, fontSize: 14 }}>{ex.free ? 'Free' : 'Premium'}</div>
              </div>
            </div>
            <button className="btn" disabled={!ex.free}>Start</button>
          </Card>
        ))}
        <div style={{ height: 72 }} />
      </div>
      <Navbar items={navItems} />
    </div>
  );
}
