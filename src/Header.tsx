import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="top-bar">
      <Link to="/" className="logo">Alayn</Link>
    </header>
  );
}
