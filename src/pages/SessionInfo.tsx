import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function SessionInfo() {
  const tags = ['Bad mood', 'Insomnia', 'Apathy'];
  return (
    <div className="container">
      <header className="session-header">
        <Link to="/dashboard" className="back-btn"><FaArrowLeft /></Link>
        <h1>Session Info</h1>
      </header>
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="profile" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="avatar-placeholder" />
          <div style={{ marginLeft: '1rem' }}>
            <h2 style={{ marginBottom: '0.2rem' }}>Patient Name</h2>
            <p>Age 30 · Anxiety</p>
          </div>
        </div>
        <div className="chips-row" style={{ marginBottom: '1rem' }}>
          {tags.map(t => <span key={t} className="chip">{t}</span>)}
        </div>
        <div className="tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button className="tab active">Information</button>
          <button className="tab">Medicine</button>
          <button className="tab">Diagnoses</button>
        </div>
        <div className="info-section">
          <p>General information about the session goes here.</p>
        </div>
      </div>
    </div>
  );
}
