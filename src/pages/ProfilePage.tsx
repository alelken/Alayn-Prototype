import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaMoon, FaSun, FaStar, FaCalendarAlt, FaEdit, FaCheckCircle, FaBookOpen, FaDumbbell, FaHome } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { colors } from '../theme';

const mockUser = {
  name: 'Aarav',
  email: 'aarav@example.com',
  avatar: '',
  preferences: { darkMode: false },
};

function getBookings() {
  return JSON.parse(localStorage.getItem('bookings') || '[]');
}
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function getProgress() {
  return JSON.parse(localStorage.getItem('progress') || '{"exercises":0.5,"analysis":1}');
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [progress, setProgress] = useState<{ exercises: number; analysis: number }>({ exercises: 0, analysis: 0 });
  const [editing, setEditing] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, email: user.email, avatar: user.avatar });

  useEffect(() => {
    setBookings(getBookings());
    setFavorites(getFavorites());
    setProgress(getProgress());
    if (!localStorage.getItem('onboarded')) {
      setOnboarding(true);
      localStorage.setItem('onboarded', '1');
    }
  }, []);

  const handleEdit = () => {
    setEditing(true);
    setEditForm({ name: user.name, email: user.email, avatar: user.avatar });
  };
  const handleEditSave = () => {
    setUser(u => ({ ...u, ...editForm }));
    setEditing(false);
  };
  const handleFavorite = (item: any) => {
    const updated = [...favorites, item];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };
  const handleUnfavorite = (item: any) => {
    const updated = favorites.filter(f => (f.title || f.name) !== (item.title || item.name));
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };
  const handleClear = () => {
    localStorage.removeItem('bookings');
    localStorage.removeItem('progress');
    setBookings([]);
    setProgress({ exercises: 0, analysis: 0 });
  };

  return (
    <div className="dashboard-bg">
      <div className="container">
        <div style={{ margin: '24px 0 16px 0' }}><BackButton /></div>
        <SectionTitle>Profile</SectionTitle>
        {onboarding && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Card style={{ background: colors.card, borderRadius: 16, padding: 24, maxWidth: 340, width: '90%', boxShadow: '0 4px 24px rgba(58,90,64,0.2)', textAlign: 'center' }}>
              <SectionTitle>Welcome to Alayn!</SectionTitle>
              <p>Explore therapy, exercises, and more. Set your preferences in your profile.</p>
              <button className="btn mt-md" onClick={() => setOnboarding(false)}>Get Started</button>
            </Card>
          </div>
        )}
        <Card style={{ alignItems: 'center', flexDirection: 'row', gap: 16, marginBottom: 20 }}>
          <div className="avatar-placeholder" style={{ fontSize: 40 }}>
            {user.avatar ? <img src={user.avatar} alt="avatar" style={{ width: 48, borderRadius: '50%' }} /> : <FaUserCircle style={{ fontSize: 32, verticalAlign: 'middle' }} />}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <>
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, width: '100%' }} />
                <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} style={{ fontSize: 15, marginBottom: 4, width: '100%' }} />
                <input value={editForm.avatar} onChange={e => setEditForm(f => ({ ...f, avatar: e.target.value }))} style={{ fontSize: 15, marginBottom: 4, width: '100%' }} placeholder="Avatar URL (optional)" />
                <button className="btn" onClick={handleEditSave}>Save</button>
              </>
            ) : (
              <>
                <SectionTitle>{user.name}</SectionTitle>
                <div style={{ color: colors.gray, fontSize: 15 }}>{user.email}</div>
              </>
            )}
          </div>
          {!editing && <button className="btn" onClick={handleEdit}><FaEdit /> Edit</button>}
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle>Progress Tracking</SectionTitle>
          <div style={{ marginBottom: 10 }}>
            <b>Exercises:</b>
            <div style={{ height: 8, background: colors.lavender, borderRadius: 6, width: '100%', margin: '4px 0' }}>
              <div style={{ width: `${progress.exercises * 100}%`, height: 8, background: colors.green, borderRadius: 6, transition: 'width 0.5s' }} />
            </div>
            <span style={{ color: colors.green, fontWeight: 600 }}>{Math.round(progress.exercises * 100)}%</span>
            {progress.exercises === 1 && <span style={{ color: colors.accent, marginLeft: 8 }}><FaCheckCircle /> Completed!</span>}
          </div>
          <div>
            <b>Personality Analysis:</b>
            <div style={{ height: 8, background: colors.lavender, borderRadius: 6, width: '100%', margin: '4px 0' }}>
              <div style={{ width: `${progress.analysis * 100}%`, height: 8, background: colors.green, borderRadius: 6, transition: 'width 0.5s' }} />
            </div>
            <span style={{ color: colors.green, fontWeight: 600 }}>{Math.round(progress.analysis * 100)}%</span>
            {progress.analysis === 1 && <span style={{ color: colors.accent, marginLeft: 8 }}><FaCheckCircle /> Completed!</span>}
          </div>
          <button className="btn mt-md" style={{ marginTop: 16 }} onClick={handleClear}>Clear Progress & Bookings</button>
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle>Booking History</SectionTitle>
          {bookings.length === 0 && <div style={{ color: colors.gray }}>No bookings yet.</div>}
          {bookings.map((b, i) => (
            <div key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaCalendarAlt style={{ color: colors.accent, fontSize: 24, verticalAlign: 'middle' }} />
              <span style={{ color: colors.green, fontWeight: 600 }}>{b.date} at {b.time}</span>
              <span style={{ color: colors.gray, fontSize: 14 }}>with {b.therapist}</span>
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle>Favorites</SectionTitle>
          {favorites.length === 0 && <div style={{ color: colors.gray }}>No favorites yet.</div>}
          {favorites.map((f, i) => (
            <div key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaStar style={{ color: colors.accent, fontSize: 24, verticalAlign: 'middle' }} />
              <span style={{ color: colors.green, fontWeight: 600 }}>{f.title || f.name}</span>
              <button className="btn" style={{ marginLeft: 8 }} onClick={() => handleUnfavorite(f)}>Remove</button>
            </div>
          ))}
        </Card>
        <div style={{ height: 72 }} />
      </div>
      <BottomNav />
    </div>
  );
}