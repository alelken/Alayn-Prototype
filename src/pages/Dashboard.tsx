import React from 'react';
import { Link } from 'react-router-dom';

interface Session {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  date: string;
  time: string;
}

const sessions: Session[] = [
  { id: 1, name: 'Jane Doe', age: 28, diagnosis: 'Anxiety', date: 'Today', time: '09:00 AM' },
  { id: 2, name: 'John Smith', age: 34, diagnosis: 'Depression', date: 'Today', time: '11:00 AM' },
  { id: 3, name: 'Priya Patel', age: 25, diagnosis: 'Burnout', date: 'Today', time: '02:00 PM' },
];

export default function Dashboard() {
  const today = new Date().toLocaleDateString();
  return (
    <div className="container">
      <div className="dash-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="avatar-placeholder" />
        <span style={{ color: 'var(--color-peacock)' }}>{today}</span>
      </div>
      <h1 style={{ marginBottom: 4 }}>Good morning Dr. Kim</h1>
      <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>You have {sessions.length} sessions today.</p>

      <div className="calendar-strip" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem' }}>
        {[...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          const label = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
          return (
            <div key={i} className={i === 0 ? 'calendar-day active' : 'calendar-day'}>{label}</div>
          );
        })}
      </div>

      <div className="list">
        {sessions.map(s => (
          <Link to="/session" key={s.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="avatar-placeholder" />
            <div className="item-info">
              <h2>{s.name}</h2>
              <p>{s.age} yrs · {s.diagnosis}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-peacock)' }}>{s.date} at {s.time}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
