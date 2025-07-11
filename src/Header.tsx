import { Link } from 'react-router-dom';
import { GiFeather } from 'react-icons/gi';

export default function Header() {
  return (
    <header className="top-bar">
      <Link to="/" className="logo">
        <GiFeather className="logo-icon" />
        Alayn
      </Link>
    </header>
  );
}
