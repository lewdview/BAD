import React from 'react';

// ─────────────────────────────────────────────────────────────
// ToggleSwitch — Labeled toggle switch with proper accessibility
// Replaces 7+ copy-pasted toggle patterns in BuilderControls.
// ─────────────────────────────────────────────────────────────

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  id,
}) => {
  const switchId = id || `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <label
      htmlFor={switchId}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        cursor: 'pointer',
        fontSize: '12px',
        color: 'var(--text-secondary)',
      }}
    >
      <span>{label}</span>
      <span className="switch">
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label}
        />
        <span className="slider" />
      </span>
    </label>
  );
};
