import React from 'react';

// ─────────────────────────────────────────────────────────────
// SliderControl — Labeled range slider with value display
// Replaces 8+ copy-pasted slider patterns in BuilderControls.
// ─────────────────────────────────────────────────────────────

interface SliderControlProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  formatValue?: (value: number) => string;
  id?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = '',
  formatValue,
  id,
}) => {
  const sliderId = id || `slider-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label
          htmlFor={sliderId}
          style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
        >
          {label}
        </label>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-gold)' }}>
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        id={sliderId}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{ width: '100%' }}
      />
    </div>
  );
};
