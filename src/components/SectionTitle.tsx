import React from 'react';
import { colors, font, spacing } from '../theme';

interface SectionTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, style, className }) => (
  <h2
    className={className}
    style={{
      color: colors.text,
      fontWeight: font.heading,
      fontSize: '1.2rem',
      margin: `${spacing.lg} 0 ${spacing.sm} 0`,
      letterSpacing: '-0.5px',
      ...style,
    }}
  >
    {children}
  </h2>
);

export default SectionTitle; 