import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../navigation';

export default function BottomNav() {
  const location = useLocation();
  if (location.pathname === '/') return null;
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          aria-label={item.label}
          className={({ isActive }) =>
            'bottom-nav-item' + (isActive ? ' active' : '')
          }
        >
          {item.icon}
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
