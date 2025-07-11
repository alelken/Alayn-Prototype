import React, { useState } from 'react';

const exercises = [
  { title: 'Breathing Basics', free: true, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', video: 'https://www.w3schools.com/html/mov_bbb.mp4', pic: 'https://via.placeholder.com/120x80?text=Breathing' },
  { title: 'Guided Chakra Meditation', free: false, video: 'https://www.w3schools.com/html/movie.mp4', pic: 'https://via.placeholder.com/120x80?text=Chakra' },
  { title: 'Morning Yoga Flow', free: false, video: 'https://www.w3schools.com/html/movie.mp4', pic: 'https://via.placeholder.com/120x80?text=Yoga' },
];

const plans = [30, 60, 180];

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 16, maxWidth: 340, width: '90%', boxShadow: '0 4px 24px rgba(58,90,64,0.2)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 22, color: 'var(--color-peacock)', cursor: 'pointer' }}>&times;</button>
        {children}
      </div>
    </div>
  );
}

export default function MindfulExercises() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<typeof exercises[0] | null>(null);
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState<{ [title: string]: number }>({});
  const [day, setDay] = useState<{ [title: string]: number }>({});

  const handleStart = (item: typeof exercises[0]) => {
    setCurrentExercise(item);
    setModalOpen(true);
  };

  const handlePlanSelect = (exerciseTitle: string, days: number) => {
    setPlan(prev => ({ ...prev, [exerciseTitle]: days }));
    setDay(prev => ({ ...prev, [exerciseTitle]: 1 }));
  };

  const handleNextDay = (exerciseTitle: string) => {
    setDay(prev => ({ ...prev, [exerciseTitle]: Math.min((prev[exerciseTitle] || 1) + 1, plan[exerciseTitle]) }));
  };

  const filteredExercises = exercises.filter(ex => ex.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container fade-in">
      <h1>Mindful Exercises</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: 'var(--color-peacock)', marginRight: 8, fontSize: 18 }}>🔍</span>
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
            border: '1px solid var(--color-lilac)',
            outline: 'none',
            background: 'var(--color-sand)',
            color: 'var(--color-charcoal)'
          }}
        />
      </div>
      <div className="list">
        {filteredExercises.length === 0 && <div style={{ color: '#888', padding: 16 }}>No exercises found.</div>}
        {filteredExercises.map((ex) => (
          <div key={ex.title} className="item-card">
            <div className="avatar-placeholder" />
            <div className="item-info">
              <h2>{ex.title}
                <span className={`badge ${ex.free ? 'badge-free' : 'badge-premium'}`}>{ex.free ? 'Free' : 'Premium'}</span>
              </h2>
              {plan[ex.title] ? (
                <>
                  <div style={{ margin: '0.5em 0' }}>
                    <b>Day {day[ex.title] || 1} of {plan[ex.title]}</b>
                    <div style={{ margin: '0.5em 0' }}>
                      <img src={ex.pic} alt={ex.title} style={{ width: 120, borderRadius: 8, marginBottom: 8 }} />
                      <video controls style={{ width: '100%', borderRadius: 12, marginBottom: 8 }} src={ex.video} />
                    </div>
                    <div style={{ height: 8, background: '#eee', borderRadius: 6, width: '100%', marginBottom: 8 }}>
                      <div style={{ width: `${((day[ex.title] || 1) / plan[ex.title]) * 100}%`, height: 8, background: 'var(--color-gradient)', borderRadius: 6, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                  <button className="btn" style={{ marginRight: 8 }} disabled={(day[ex.title] || 1) >= plan[ex.title]} onClick={() => handleNextDay(ex.title)}>
                    Next Day
                  </button>
                  <button className="btn" onClick={() => { setPlan(prev => ({ ...prev, [ex.title]: 0 })); setDay(prev => ({ ...prev, [ex.title]: 1 })); }}>Change Plan</button>
                </>
              ) : (
                <>
                  <div style={{ margin: '0.5em 0' }}>
                    <b>Choose your plan:</b>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      {plans.map(days => (
                        <button key={days} className="btn" style={{ minWidth: 60 }} onClick={() => handlePlanSelect(ex.title, days)}>{days} days</button>
                      ))}
                    </div>
                  </div>
                  <button className="btn" disabled={!ex.free} onClick={ex.free ? () => handleStart(ex) : undefined}>
                    {ex.free ? 'Preview' : 'Locked'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {currentExercise && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{currentExercise.title}</h2>
            <video controls style={{ width: '100%', borderRadius: 12 }} src={currentExercise.video} />
            <img src={currentExercise.pic} alt={currentExercise.title} style={{ width: 120, borderRadius: 8, margin: '12px auto 0 auto', display: 'block' }} />
          </div>
        )}
      </Modal>
    </div>
  );
}
