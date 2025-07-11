import { FaHome, FaVideo, FaBook, FaDumbbell, FaStar } from 'react-icons/fa';
import React from 'react';

export interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

export const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Home', icon: FaHome },
  { path: '/therapy', label: 'Therapy', icon: FaVideo },
  { path: '/library', label: 'Library', icon: FaBook },
  { path: '/exercises', label: 'Exercises', icon: FaDumbbell },
  { path: '/analysis', label: 'Analysis', icon: FaStar }
];
