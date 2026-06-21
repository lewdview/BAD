import React from 'react';

// ─────────────────────────────────────────────────────────────
// AccordionSection — Collapsible section with header and content
// Replaces 7+ copy-pasted accordion patterns in BuilderControls.
// ─────────────────────────────────────────────────────────────

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}) => (
  <div style={{ borderBottom: '1px solid var(--border-color)' }}>
    <button
      id={`accordion-header-${id}`}
      type="button"
      aria-expanded={isExpanded}
      aria-controls={`accordion-panel-${id}`}
      onClick={() => onToggle(id)}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0',
        background: 'none',
        border: 'none',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        {title}
      </span>
      <span
        style={{
          transition: 'transform 0.2s ease',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          fontSize: '16px',
        }}
      >
        ▾
      </span>
    </button>
    {isExpanded && (
      <div
        id={`accordion-panel-${id}`}
        role="region"
        aria-labelledby={`accordion-header-${id}`}
        style={{ paddingBottom: '16px' }}
      >
        {children}
      </div>
    )}
  </div>
);
