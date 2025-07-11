import { FaVideo, FaDumbbell, FaBook, FaUser, FaChalkboardTeacher } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Card({ title, icon, to }: { title: string; icon: JSX.Element; to: string }) {
  return (
    <Link to={to} className="card">
      {icon}
      <h2>{title}</h2>
    </Link>
  );
}

export default function Dashboard() {
  return (
    <div className="container">
      <h1>Alayn Dashboard</h1>
      <div className="cards">
        <Card title="Video Therapy" icon={<FaVideo />} to="/therapy" />
        <Card title="Workshops" icon={<FaChalkboardTeacher />} to="/workshops" />
        <Card title="Personality Analysis" icon={<FaUser />} to="/analysis" />
        <Card title="Mindful Exercises" icon={<FaDumbbell />} to="/exercises" />
        <Card title="Media Library" icon={<FaBook />} to="/library" />
      </div>
    </div>
  );
}
