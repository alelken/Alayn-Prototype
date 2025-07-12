import { FaHome, FaVideo, FaBook } from 'react-icons/fa';
import { GiLotus } from 'react-icons/gi';
import { MdAutoAwesome } from 'react-icons/md';
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
  { path: '/exercises', label: 'Exercises', icon: GiLotus },
  { path: '/analysis', label: 'Analysis', icon: MdAutoAwesome }
];
