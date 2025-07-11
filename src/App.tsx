import './App.css';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import SessionInfo from './pages/SessionInfo';
import VideoTherapy from './pages/VideoTherapy';
import MediaLibrary from './pages/MediaLibrary';
import MindfulExercises from './pages/MindfulExercises';
import PersonalityAnalysis from './pages/PersonalityAnalysis';
import Workshops from './pages/Workshops';
import VideoDetailPage from './pages/VideoDetailPage';
import TherapistDetailPage from './pages/TherapistDetailPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';


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
