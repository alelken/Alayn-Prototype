import Header from './Header';
import './App.css';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import SessionInfo from './pages/SessionInfo';
import VideoTherapy from './pages/VideoTherapy';
import MediaLibrary from './pages/MediaLibrary';
import MindfulExercises from './pages/MindfulExercises';
import PersonalityAnalysis from './pages/PersonalityAnalysis';
import Workshops from './pages/Workshops';
import { FaHome, FaVideo, FaBook, FaDumbbell, FaUser } from 'react-icons/fa';
import VideoDetailPage from './pages/VideoDetailPage';
import TherapistDetailPage from './pages/TherapistDetailPage';
import ProfilePage from './pages/ProfilePage';

function BottomNav() {
  const location = useLocation();
  const navItems = [
    { to: '/dashboard', icon: <FaHome />, label: 'Home' },
    { to: '/therapy', icon: <FaVideo />, label: 'Therapy' },
    { to: '/library', icon: <FaBook />, label: 'Library' },
    { to: '/exercises', icon: <FaDumbbell />, label: 'Exercises' },
    { to: '/profile', icon: <FaUser />, label: 'Profile' },
  ];
  if (location.pathname === '/') return null;
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={
            'bottom-nav-item' + (location.pathname === item.to ? ' active' : '')
          }
        >
          {item.icon}
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function App() {
  useEffect(() => {
    // Lock orientation to portrait for mobile experience
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lock({ orientation: 'portrait' });
      } catch (error) {
        console.error('Error locking orientation:', error);
      }
    };
    lockOrientation();

    // Optional: Detect non-mobile and show a message
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      alert('This app is optimized for mobile devices only. Please open on a phone or tablet.');
    }
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/therapy" element={<VideoTherapy />} />
        <Route path="/library" element={<MediaLibrary />} />
        <Route path="/exercises" element={<MindfulExercises />} />
        <Route path="/analysis" element={<PersonalityAnalysis />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/video/:id" element={<VideoDetailPage />} />
        <Route path="/therapist/:id" element={<TherapistDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/session" element={<SessionInfo />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}
