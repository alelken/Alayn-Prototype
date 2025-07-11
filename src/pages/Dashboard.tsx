import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaFire, FaStar, FaQuoteLeft } from 'react-icons/fa';

const mockUser = {
  name: 'Aarav',
  streak: 7,
  progress: 0.45,
};

const highlights = [
  { icon: <FaStar />, label: 'New: Mindful Parenting Workshop' },
  { icon: <FaFire />, label: 'You are on a 7-day streak!' },
];

const quote = {
  text: 'The mind is everything. What you think you become.',
  author: 'Buddha',
};

function getUpcomingSession() {
  // For demonstration, get from localStorage (would be global state or API in real app)
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  if (!bookings.length) return null;
  // Find the soonest future session
  const now = new Date();
  const future = bookings.filter((b: any) => new Date(b.date + 'T' + b.time) > now);
  if (!future.length) return null;
  future.sort((a: any, b: any) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
  return future[0];
}

export default function Dashboard() {
  const [upcoming, setUpcoming] = useState<any>(null);

  useEffect(() => {
    setUpcoming(getUpcomingSession());
    window.addEventListener('storage', () => setUpcoming(getUpcomingSession()));
    return () => window.removeEventListener('storage', () => setUpcoming(getUpcomingSession()));
  }, []);

  return (
    <div className="container">
      <h1 style={{ marginBottom: 0 }}>Hi, {mockUser.name} 👋</h1>
      <div style={{ color: 'var(--color-peacock)', fontWeight: 500, marginBottom: 24 }}>
        Welcome back to Alayn. Here’s your progress and what’s next!
      </div>

      {/* Progress Summary */}
      <div className="card" style={{ alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-peacock)', marginBottom: 4 }}>Your Progress</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{Math.round(mockUser.progress * 100)}%</div>
          <div style={{ marginTop: 8, height: 8, background: '#eee', borderRadius: 6, width: '100%' }}>
            <div style={{ width: `${mockUser.progress * 100}%`, height: 8, background: 'var(--color-gradient)', borderRadius: 6, transition: 'width 0.5s' }} />
          </div>
        </div>
        <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <FaFire style={{ color: 'var(--color-accent)', fontSize: 28 }} />
          <div style={{ fontWeight: 600, color: 'var(--color-accent)', marginTop: 4 }}>{mockUser.streak} day streak</div>
        </div>
      </div>

      {/* Upcoming Session */}
      <div className="card" style={{ marginBottom: 20, alignItems: 'center' }}>
        <FaCalendarAlt style={{ color: 'var(--color-peacock)', fontSize: 24, marginRight: 16 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-peacock)' }}>Next Session</div>
          {upcoming ? (
            <>
              <div style={{ fontSize: 15, marginTop: 2 }}>{upcoming.date} at {upcoming.time}</div>
              <div style={{ color: '#888', fontSize: 14 }}>with {upcoming.therapist}</div>
            </>
          ) : (
            <div style={{ color: '#888', fontSize: 14 }}>No upcoming sessions. Book a session with a therapist!</div>
          )}
        </div>
      </div>

      {/* Highlights */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, color: 'var(--color-peacock)', marginBottom: 8 }}>Highlights</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {highlights.map((h, i) => (
            <div key={i} className="card" style={{ flex: 1, minWidth: 140, alignItems: 'center', flexDirection: 'row', gap: 10, padding: '0.8em 1em' }}>
              <span style={{ fontSize: 20 }}>{h.icon}</span>
              <span style={{ fontWeight: 500 }}>{h.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="card" style={{ background: 'var(--color-gradient-accent)', color: '#fff', alignItems: 'center', flexDirection: 'row', gap: 12 }}>
        <FaQuoteLeft style={{ fontSize: 22, opacity: 0.7 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontStyle: 'italic', fontSize: 15 }}>{quote.text}</div>
          <div style={{ fontWeight: 500, marginTop: 4, fontSize: 13, opacity: 0.8 }}>— {quote.author}</div>
        </div>
      </div>
    </div>
  );
}
