import { Link } from 'react-router-dom';
import { FaHandsHelping } from 'react-icons/fa';

export default function Welcome() {
  return (
    <div className="welcome-screen fade-in">
      <div className="welcome-content">
        <FaHandsHelping className="welcome-illustration" />
        <h1>Therapy &amp; Care</h1>
        <p className="tagline">We help professional therapists and patients find each other.</p>
        <Link to="/dashboard" className="btn" style={{ marginTop: '1.5rem' }}>
          Get started
        </Link>
      </div>
    </div>
  );
}
