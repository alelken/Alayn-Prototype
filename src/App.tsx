import { FaVideo, FaDumbbell, FaBook } from 'react-icons/fa';
import './App.css';

function Card({ title, icon }: { title: string; icon: JSX.Element }) {
  return (
    <div className="card">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

export default function App() {
  return (
    <div className="container">
      <h1>Alayn Dashboard</h1>
      <div className="cards">
        <Card title="Video Therapy" icon={<FaVideo />} />
        <Card title="Mindful Exercises" icon={<FaDumbbell />} />
        <Card title="Media Library" icon={<FaBook />} />
      </div>
    </div>
  );
}
