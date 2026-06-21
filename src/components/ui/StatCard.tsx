import React from 'react';

// ─────────────────────────────────────────────────────────────
// StatCard — Metric display card with icon, value, label, color
// Replaces 15+ near-identical stat/KPI cards across pages.
// ─────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color = 'var(--accent-gold)',
}) => (
  <div
    className="card"
    style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      borderLeft: `3px solid ${color}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color, fontSize: '14px' }}>
      {icon}
      <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
    <span style={{ fontSize: '28px', fontWeight: 700 }}>{value}</span>
  </div>
);
