import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserMd, FaStar, FaCalendarAlt } from 'react-icons/fa';

const therapists = [
  {
    id: 'asha',
    name: 'Dr. Asha Singh',
    specialty: 'Career Counselling',
    fee: 1500,
    bio: 'Expert in career guidance with 15+ years of experience.',
    reviews: [
      { user: 'Riya', rating: 5, text: 'Very helpful and insightful.' },
      { user: 'Amit', rating: 4, text: 'Great advice for my career.' },
    ],
  },
  {
    id: 'ravi',
    name: 'Dr. Ravi Kumar',
    specialty: 'Parental Advice',
    fee: 1200,
    bio: 'Specialist in parenting and family therapy.',
    reviews: [
      { user: 'Priya', rating: 5, text: 'Helped us a lot as new parents.' },
    ],
  },
  {
    id: 'meera',
    name: 'Dr. Meera Das',
    specialty: 'Stress Management',
    fee: 1000,
    bio: 'Focus on stress and anxiety management for all ages.',
    reviews: [
      { user: 'Suresh', rating: 4, text: 'Very calming and practical.' },
    ],
  },
];

const timeSlots = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'];

function downloadICS({ therapist, date, time }: { therapist: string; date: string; time: string }) {
  const dt = date.replace(/-/g, '') + 'T' + time.replace(/:/g, '') + '00';
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Therapy Session with ${therapist}\nDTSTART:${dt}\nDTEND:${dt}\nDESCRIPTION:Your therapy session with ${therapist}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics.replace(/\n/g, '\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `session-${therapist}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function TherapistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const therapist = therapists.find(t => t.id === id);
  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!therapist) {
    return <div className="container"><h1>Therapist Not Found</h1></div>;
  }

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
    // Save booking to localStorage (mock user)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({ therapist: therapist.name, date, time: slot });
    localStorage.setItem('bookings', JSON.stringify(bookings));
    // Mock push notification
    setTimeout(() => {
      alert(`Reminder: Your session with ${therapist.name} is booked for ${date} at ${slot}.`);
    }, 1000);
  };

  return (
    <div className="container">
      <div className="card" style={{ alignItems: 'center', flexDirection: 'row', gap: 16, marginBottom: 20 }}>
        <div className="avatar-placeholder" style={{ fontSize: 32 }}><FaUserMd /></div>
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: 4 }}>{therapist.name}</h1>
          <div style={{ color: 'var(--color-peacock)', fontWeight: 600 }}>{therapist.specialty}</div>
          <div style={{ color: '#888', margin: '6px 0' }}>{therapist.bio}</div>
          <div style={{ color: 'var(--color-accent)', fontWeight: 600 }}>₹{therapist.fee} per session</div>
        </div>
        <button className="btn" onClick={() => { setModalOpen(true); setConfirmed(false); setDate(''); setSlot(''); }}>Book</button>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, color: 'var(--color-peacock)', marginBottom: 8 }}>Reviews</div>
        {therapist.reviews.length === 0 && <div style={{ color: '#888' }}>No reviews yet.</div>}
        {therapist.reviews.map((r, i) => (
          <div key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{r.user}</span>
            <span style={{ marginLeft: 8, color: '#FFD700' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            <div style={{ color: '#444', marginTop: 2 }}>{r.text}</div>
          </div>
        ))}
      </div>
      {/* Booking Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, maxWidth: 340, width: '90%', boxShadow: '0 4px 24px #008c7e22', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#008C7E', cursor: 'pointer' }}>&times;</button>
            {!confirmed ? (
              <form onSubmit={handleConfirm} style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Book {therapist.name}</h2>
                <div style={{ margin: '1em 0' }}>
                  <label style={{ fontWeight: 500, color: 'var(--color-peacock)' }}>Date:</label><br />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ fontSize: 16, padding: 6, borderRadius: 8, border: '1px solid #b9a5ff', marginTop: 4 }} />
                </div>
                <div style={{ margin: '1em 0' }}>
                  <label style={{ fontWeight: 500, color: 'var(--color-peacock)' }}>Time Slot:</label><br />
                  <select value={slot} onChange={e => setSlot(e.target.value)} required style={{ fontSize: 16, padding: 6, borderRadius: 8, border: '1px solid #b9a5ff', marginTop: 4 }}>
                    <option value="">Select</option>
                    {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                  </select>
                </div>
                <button className="btn mt-md" type="submit">Confirm Booking</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-peacock)' }}>
                <h2>Booking Confirmed!</h2>
                <p>Your session with <b>{therapist.name}</b> is booked for <b>{date}</b> at <b>{slot}</b>.</p>
                <button className="btn mt-md" onClick={() => setModalOpen(false)}>Close</button>
                <button className="btn mt-md" style={{ marginLeft: 8 }} onClick={() => downloadICS({ therapist: therapist.name, date, time: slot })}>Add to Calendar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 