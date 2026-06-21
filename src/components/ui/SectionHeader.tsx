import React from 'react';

// ─────────────────────────────────────────────────────────────
// SectionHeader — Reusable centered page header with badge
// Replaces 5+ duplicated hero/header sections across pages.
// ─────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badgeStyle?: React.CSSProperties;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  badgeStyle,
}) => (
  <div style={{ textAlign: 'center', marginBottom: '40px' }}>
    {badge && (
      <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', ...badgeStyle }}>
        {badgeIcon}
        {badge}
      </span>
    )}
    <h1 style={{ fontSize: '42px', marginTop: badge ? '12px' : 0 }}>{title}</h1>
    {subtitle && <p>{subtitle}</p>}
  </div>
);
