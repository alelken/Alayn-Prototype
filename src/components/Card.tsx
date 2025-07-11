import React from 'react';
import { colors, radii, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, style, className }) => (
  <div
    className={className}
    style={{
      background: colors.card,
      borderRadius: radii.card,
      boxShadow: `0 8px 32px ${colors.shadow}`,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...style,
    }}
  >
    {children}
  </div>
);

export default Card; 