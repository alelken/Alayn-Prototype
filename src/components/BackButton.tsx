import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { colors } from '../theme';
let AppCapacitor: any = undefined;
try {
  AppCapacitor = require('@capacitor/app').App;
} catch {}

export default function BackButton({ style = {}, label = 'Back' }: { style?: React.CSSProperties; label?: string }) {
  const handleBack = async () => {
    if (AppCapacitor && AppCapacitor.goBack) {
      try {
        await AppCapacitor.goBack();
        return;
      } catch {}
    }
    window.history.back();
  };
  return (
    <button
      className="btn"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}
      onClick={handleBack}
      type="button"
    >
      <IoArrowBack style={{ color: colors.text, fontSize: 18 }} />
      <span>{label}</span>
    </button>
  );
} 