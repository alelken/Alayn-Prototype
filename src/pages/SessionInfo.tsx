import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { colors } from '../theme';


export default function SessionInfo() {
  const tags = ['Bad mood', 'Insomnia', 'Apathy'];
  return (
    <div className="dashboard-bg">
      <div className="container">
        <div style={{ margin: '24px 0 16px 0' }}><BackButton /></div>
        <SectionTitle>Session Info</SectionTitle>
        <Card>
          <div className="profile" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="avatar-placeholder" />
            <div style={{ marginLeft: '1rem' }}>
              <h2 style={{ marginBottom: '0.2rem' }}>Patient Name</h2>
              <p>Age 30 · Anxiety</p>
            </div>
          </div>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: 8 }}>
            {tags.map(t => <span key={t} style={{ background: colors.lavender, color: colors.text, borderRadius: 16, padding: '4px 12px', fontSize: 14 }}>{t}</span>)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button style={{ background: colors.green, color: colors.text, border: 'none', borderRadius: 16, padding: '6px 16px', fontWeight: 600 }}>Information</button>
            <button style={{ background: colors.lavender, color: colors.text, border: 'none', borderRadius: 16, padding: '6px 16px' }}>Medicine</button>
            <button style={{ background: colors.lavender, color: colors.text, border: 'none', borderRadius: 16, padding: '6px 16px' }}>Diagnoses</button>
          </div>
          <div className="info-section">
            <p>General information about the session goes here.</p>
          </div>
        </Card>
        <div style={{ height: 72 }} />
      </div>
      <BottomNav />
    </div>
  );
}
