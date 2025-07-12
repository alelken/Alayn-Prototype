import React, { useState } from 'react';
import { GiLotus } from 'react-icons/gi';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import BottomNav from '../components/BottomNav';
import SearchInput from '../components/SearchInput';
import { colors } from '../theme';

const exercises = [
  { title: 'Breathing', free: true, pic: '', video: '', },
  { title: 'Body Scan', free: false, pic: '', video: '', },
];


export default function MindfulExercises() {
  const [search, setSearch] = useState('');
  const filteredExercises = exercises.filter(ex => ex.title.toLowerCase().includes(search.toLowerCase()));
  const [streak] = useState<number>(() => Number(localStorage.getItem('streak') || 0));

  return (
    <div className="dashboard-bg">
      <div className="container">
        <SectionTitle>Mindful Exercises</SectionTitle>
        <div style={{ color: colors.gray, marginBottom: 8 }}>Day streak: {streak}</div>
        <Card style={{ marginBottom: 24 }}>
          <SearchInput
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Card>
        {filteredExercises.length === 0 && <Card><div style={{ color: colors.gray, padding: 16 }}>No exercises found.</div></Card>}
        {filteredExercises.map((ex) => (
          <Card key={ex.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="avatar-placeholder" style={{ fontSize: 28 }}><GiLotus /></div>
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
      <BottomNav />
    </div>
  );
}
