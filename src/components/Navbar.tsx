import React from 'react';
import { colors, radii } from '../theme';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavbarProps {
  items: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => (
  <nav
    style={{
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '1.5rem',
      height: 68,
      width: 'calc(100% - 2rem)',
      maxWidth: 420,
      background: colors.card,
      borderRadius: radii.nav,
      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      padding: '0.5rem 0',
      margin: '0 auto',
    }}
  >
    {items.map((item, idx) => (
      <button
        key={item.label}
        onClick={item.onClick}
        style={{
          background: item.active ? colors.accent : 'transparent',
          color: item.active ? colors.text : colors.gray,
          fontSize: 22,
          flex: 1,
          padding: '0.3rem 0',
          border: 'none',
          outline: 'none',
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          transition: 'color 0.2s, background 0.2s',
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>{item.icon}</span>
        <span style={{ fontSize: 13, color: item.active ? colors.text : colors.gray, fontWeight: 500, marginTop: 2 }}>{item.label}</span>
      </button>
    ))}
  </nav>
);

export default Navbar; 