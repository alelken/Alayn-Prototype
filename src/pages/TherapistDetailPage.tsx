import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserMd, FaStar, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { colors } from '../theme';

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
    return <div className="dashboard-bg"><div className="container"><SectionTitle>Therapist Not Found</SectionTitle></div></div>;
  }

  // Calculate experience (years) from bio if present
  let experience = '';
  const expMatch = therapist.bio.match(/(\d+)\+? years?/i);
  if (expMatch) experience = expMatch[1];
  // Calculate average rating
  const avgRating = therapist.reviews.length ? (therapist.reviews.reduce((a, r) => a + r.rating, 0) / therapist.reviews.length).toFixed(1) : null;

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
    <div className="dashboard-bg">
      <div className="container">
        <div style={{ margin: '24px 0 16px 0' }}><BackButton /></div>
        <Card style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 20, marginBottom: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%' }}>
            <div className="avatar-placeholder" style={{ fontSize: 40, minWidth: 56 }}><FaUserMd style={{ fontSize: 32, verticalAlign: 'middle' }} /></div>
            <div style={{ flex: 1 }}>
              <SectionTitle>{therapist.name}</SectionTitle>
              <div style={{ color: colors.green, fontWeight: 600, fontSize: 16 }}>{therapist.specialty}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, margin: '10px 0', width: '100%' }}>
            {experience && <div style={{ color: colors.text, fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}><FaCalendarAlt style={{ fontSize: 24, verticalAlign: 'middle', color: colors.accent }} />{experience} yrs exp</div>}
            {avgRating && <div style={{ color: colors.text, fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}><FaStar style={{ fontSize: 24, verticalAlign: 'middle', color: '#FFD700' }} />{avgRating} <span style={{ color: colors.gray, fontSize: 14, marginLeft: 2 }}>/5</span></div>}
          </div>
          <div style={{ color: colors.gray, fontSize: 15, margin: '8px 0 0 0', width: '100%' }}>{therapist.bio}</div>
          <div style={{ color: colors.accent, fontWeight: 700, fontSize: 18, margin: '10px 0 0 0', width: '100%' }}>₹{therapist.fee} per session</div>
          <button className="btn" style={{ fontSize: '1.1rem', padding: '0.7rem 1.5rem', marginTop: 12 }} onClick={() => { setModalOpen(true); setConfirmed(false); setDate(''); setSlot(''); }}>Book</button>
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle>Reviews</SectionTitle>
          {therapist.reviews.length === 0 && <div style={{ color: colors.gray }}>No reviews yet.</div>}
          {therapist.reviews.map((r, i) => (
            <div key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: colors.accent, fontWeight: 600 }}>{r.user}</span>
              <span style={{ marginLeft: 8, color: '#FFD700', display: 'flex', alignItems: 'center', gap: 2 }}>{Array.from({length: 5}).map((_, idx) => <FaStar key={idx} style={{ fontSize: 18, verticalAlign: 'middle', color: idx < r.rating ? '#FFD700' : '#eee' }} />)}</span>
              <div style={{ color: '#444', marginTop: 2 }}>{r.text}</div>
            </div>
          ))}
        </Card>
        {/* Booking Modal unchanged */}
        {modalOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Card style={{ background: colors.card, borderRadius: 16, padding: 16, maxWidth: 340, width: '90%', boxShadow: '0 4px 24px rgba(58,90,64,0.2)', position: 'relative' }}>
              <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 22, color: colors.green, cursor: 'pointer' }}>&times;</button>
              {!confirmed ? (
                <form onSubmit={handleConfirm} style={{ textAlign: 'center' }}>
                  <SectionTitle>Book {therapist.name}</SectionTitle>
                  <div style={{ margin: '1em 0' }}>
                    <label style={{ fontWeight: 500, color: colors.green }}>Date:</label><br />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ fontSize: 16, padding: 6, borderRadius: 8, border: `1px solid ${colors.lavender}`, marginTop: 4 }} />
                  </div>
                  <div style={{ margin: '1em 0' }}>
                    <label style={{ fontWeight: 500, color: colors.green }}>Time Slot:</label><br />
                    <select value={slot} onChange={e => setSlot(e.target.value)} required style={{ fontSize: 16, padding: 6, borderRadius: 8, border: `1px solid ${colors.lavender}`, marginTop: 4 }}>
                      <option value="">Select</option>
                      {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                    </select>
                  </div>
                  <button className="btn mt-md" type="submit" style={{ fontSize: '1.1rem', padding: '0.7rem 1.5rem' }}>Confirm Booking</button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', color: colors.green }}>
                  <SectionTitle>Booking Confirmed!</SectionTitle>
                  <p>Your session with <b>{therapist.name}</b> is booked for <b>{date}</b> at <b>{slot}</b>.</p>
                  <button className="btn mt-md" style={{ fontSize: '1.1rem', padding: '0.7rem 1.5rem' }} onClick={() => setModalOpen(false)}>Close</button>
                  <button className="btn mt-md" style={{ marginLeft: 8, fontSize: '1.1rem', padding: '0.7rem 1.5rem' }} onClick={() => downloadICS({ therapist: therapist.name, date, time: slot })}>Add to Calendar</button>
                </div>
              )}
            </Card>
          </div>
        )}
        <div style={{ height: 72 }} />
      </div>
      <BottomNav />
    </div>
  );
}