import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaChalkboardTeacher } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import BottomNav from '../components/BottomNav';
import SearchInput from '../components/SearchInput';
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
          <SearchInput
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
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
      <BottomNav />
    </div>
  );
}
