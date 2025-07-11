import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaMoon, FaSun, FaStar, FaCalendarAlt, FaEdit, FaCheckCircle } from 'react-icons/fa';

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
  const [darkMode, setDarkMode] = useState(user.preferences.darkMode);
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

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    setUser(u => ({ ...u, preferences: { ...u.preferences, darkMode } }));
  }, [darkMode]);

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
    <div className="container">
      {onboarding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 340, width: '90%', boxShadow: '0 4px 24px #008c7e22', textAlign: 'center' }}>
            <h2>Welcome to Alayn!</h2>
            <p>Explore therapy, exercises, and more. Set your preferences in your profile.</p>
            <button className="btn mt-md" onClick={() => setOnboarding(false)}>Get Started</button>
          </div>
        </div>
      )}
      <div className="card" style={{ alignItems: 'center', flexDirection: 'row', gap: 16, marginBottom: 20 }}>
        <div className="avatar-placeholder" style={{ fontSize: 40 }}>
          {user.avatar ? <img src={user.avatar} alt="avatar" style={{ width: 48, borderRadius: '50%' }} /> : <FaUserCircle />}
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
              <h1 style={{ marginBottom: 4 }}>{user.name}</h1>
              <div style={{ color: '#888', fontSize: 15 }}>{user.email}</div>
            </>
          )}
        </div>
        {!editing && <button className="btn" onClick={handleEdit}><FaEdit /> Edit</button>}
        <button className="btn" onClick={() => setDarkMode(d => !d)}>
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, color: 'var(--color-peacock)', marginBottom: 8 }}>Progress Tracking</div>
        <div style={{ marginBottom: 10 }}>
          <b>Exercises:</b>
          <div style={{ height: 8, background: '#eee', borderRadius: 6, width: '100%', margin: '4px 0' }}>
            <div style={{ width: `${progress.exercises * 100}%`, height: 8, background: 'var(--color-gradient)', borderRadius: 6, transition: 'width 0.5s' }} />
          </div>
          <span style={{ color: 'var(--color-peacock)', fontWeight: 600 }}>{Math.round(progress.exercises * 100)}%</span>
          {progress.exercises === 1 && <span style={{ color: 'var(--color-success)', marginLeft: 8 }}><FaCheckCircle /> Completed!</span>}
        </div>
        <div>
          <b>Personality Analysis:</b>
          <div style={{ height: 8, background: '#eee', borderRadius: 6, width: '100%', margin: '4px 0' }}>
            <div style={{ width: `${progress.analysis * 100}%`, height: 8, background: 'var(--color-gradient)', borderRadius: 6, transition: 'width 0.5s' }} />
          </div>
          <span style={{ color: 'var(--color-peacock)', fontWeight: 600 }}>{Math.round(progress.analysis * 100)}%</span>
          {progress.analysis === 1 && <span style={{ color: 'var(--color-success)', marginLeft: 8 }}><FaCheckCircle /> Completed!</span>}
        </div>
        <button className="btn mt-md" style={{ marginTop: 16 }} onClick={handleClear}>Clear Progress & Bookings</button>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, color: 'var(--color-peacock)', marginBottom: 8 }}>Booking History</div>
        {bookings.length === 0 && <div style={{ color: '#888' }}>No bookings yet.</div>}
        {bookings.map((b, i) => (
          <div key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaCalendarAlt style={{ color: 'var(--color-accent)' }} />
            <span style={{ color: 'var(--color-peacock)', fontWeight: 600 }}>{b.date} at {b.time}</span>
            <span style={{ color: '#888', fontSize: 14 }}>with {b.therapist}</span>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, color: 'var(--color-peacock)', marginBottom: 8 }}>Favorites</div>
        {favorites.length === 0 && <div style={{ color: '#888' }}>No favorites yet.</div>}
        {favorites.map((f, i) => (
          <div key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaStar style={{ color: 'var(--color-accent)' }} />
            <span style={{ color: 'var(--color-peacock)', fontWeight: 600 }}>{f.title || f.name}</span>
            <button className="btn" style={{ marginLeft: 8 }} onClick={() => handleUnfavorite(f)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
} 