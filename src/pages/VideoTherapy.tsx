import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaChalkboardTeacher, FaSearch } from 'react-icons/fa';

const therapists = [
  { id: 'asha', name: 'Dr. Asha Singh', specialty: 'Career Counselling', fee: 1500 },
  { id: 'ravi', name: 'Dr. Ravi Kumar', specialty: 'Parental Advice', fee: 1200 },
  { id: 'meera', name: 'Dr. Meera Das', specialty: 'Stress Management', fee: 1000 },
];

const workshops = [
  {
    title: 'Mindful Parenting Basics',
    date: '12 Aug 2025',
    price: 500,
  },
  {
    title: 'Career Growth Strategies',
    date: '20 Aug 2025',
    price: 650,
  },
];

function TherapistCard({ id, name, specialty, fee }: { id: string; name: string; specialty: string; fee: number }) {
  return (
    <Link to={`/therapist/${id}`} className="item-card" style={{ textDecoration: 'none' }}>
      <div className="avatar-placeholder"><FaUserMd /></div>
      <div className="item-info">
        <h2>{name}</h2>
        <p>{specialty}</p>
        <p>₹{fee}</p>
        <button className="btn" type="button">View Profile</button>
      </div>
    </Link>
  );
}

function WorkshopCard({ title, date, price }: { title: string; date: string; price: number }) {
  return (
    <div className="item-card">
      <div className="avatar-placeholder"><FaChalkboardTeacher /></div>
      <div className="item-info">
        <h2>{title} <span className="badge badge-premium">Paid</span></h2>
        <p>{date}</p>
        <p>₹{price}</p>
        <button className="btn">Buy Ticket</button>
      </div>
    </div>
  );
}

export default function VideoTherapy() {
  const [search, setSearch] = useState('');

  const filteredTherapists = therapists.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Therapist Videos & Workshops</h1>
      <h2 style={{fontSize: '1.1rem', color: 'var(--color-peacock)', margin: '1.2rem 0 0.5rem 0'}}>Therapists</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <FaSearch style={{ color: 'var(--color-peacock)', marginRight: 8 }} />
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
            border: '1px solid #b9a5ff',
            outline: 'none',
            background: '#f5e9da',
            color: 'var(--color-charcoal)'
          }}
        />
      </div>
      <div className="grid-list">
        {filteredTherapists.length === 0 && <div style={{ color: '#888', padding: 16 }}>No therapists found.</div>}
        {filteredTherapists.map((t) => (
          <TherapistCard key={t.id} {...t} />
        ))}
      </div>
      <h2 style={{fontSize: '1.1rem', color: 'var(--color-peacock)', margin: '1.2rem 0 0.5rem 0'}}>Workshops</h2>
      <div className="grid-list">
        {workshops.map((w) => (
          <WorkshopCard key={w.title} {...w} />
        ))}
      </div>
    </div>
  );
}
