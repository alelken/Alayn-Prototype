import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VideoTherapy from './pages/VideoTherapy';
import Workshops from './pages/Workshops';
import PersonalityAnalysis from './pages/PersonalityAnalysis';
import MediaLibrary from './pages/MediaLibrary';
import MindfulExercises from './pages/MindfulExercises';
import Header from './Header';
import './App.css';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/therapy" element={<VideoTherapy />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/analysis" element={<PersonalityAnalysis />} />
        <Route path="/library" element={<MediaLibrary />} />
        <Route path="/exercises" element={<MindfulExercises />} />
      </Routes>
    </Router>
  );
}
