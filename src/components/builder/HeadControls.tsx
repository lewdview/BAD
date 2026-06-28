import React from 'react';
import type { BuilderParams, UpdateParamFn, HeadType } from '../../types';
import { SliderControl } from '../ui/SliderControl';

interface HeadControlsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
}

export const HeadControls: React.FC<HeadControlsProps> = ({
  params,
  updateParam
}) => {
  const headType = params.headType || 'classic';
  const headScale = params.headScale !== undefined ? params.headScale : 1.0;

  const headTypes: { value: HeadType; label: string; labelShort: string; description: string; icon: React.ReactNode }[] = [
    { 
      value: 'classic', 
      label: 'Classic Domed', 
      labelShort: 'Classic',
      description: 'Traditional round shape with corona ridge',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18a8 8 0 0 1 16 0" />
          <line x1="2" y1="18" x2="22" y2="18" />
        </svg>
      )
    },
    { 
      value: 'realistic', 
      label: 'Realistic Anatomical', 
      labelShort: 'Realistic',
      description: 'True-to-life detailing with cleft and slit',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18c0-4.5 3.5-8 8-8s8 3.5 8 8" />
          <line x1="2" y1="18" x2="22" y2="18" />
          <line x1="12" y1="10" x2="12" y2="14" />
        </svg>
      )
    },
    { 
      value: 'bulbous', 
      label: 'Bulbous Swollen', 
      labelShort: 'Bulbous',
      description: 'Flares outward for increased g-spot contact',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18c0-1.5.5-2 2-3a5 5 0 0 1 8 0c1.5 1 2 1.5 2 3" />
          <path d="M9 11a3 3 0 0 1 6 0c0 1.5-1 2.5-3 3" />
          <line x1="2" y1="18" x2="22" y2="18" />
        </svg>
      )
    },
    { 
      value: 'tapered', 
      label: 'Smooth Tapered', 
      labelShort: 'Tapered',
      description: 'Gently narrowing tip for easier insertion',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 18C5 10 10 5 12 5s7 5 7 13" />
          <line x1="2" y1="18" x2="22" y2="18" />
        </svg>
      )
    },
    { 
      value: 'alien', 
      label: 'Alien Flared', 
      labelShort: 'Alien',
      description: 'Sci-fi inspired double ridge detailing',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 18a7 7 0 0 1 14 0" />
          <path d="M7 13a5 5 0 0 1 10 0" />
          <path d="M9 8a3 3 0 0 1 6 0" />
          <line x1="2" y1="18" x2="22" y2="18" />
        </svg>
      )
    },
    { 
      value: 'dragon', 
      label: 'Dragon Ribbed', 
      labelShort: 'Dragon',
      description: 'Segmented reptile nodes for intense sensation',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18c1-1 2-2 4-2s3 1 4 1 3-1 4-1 3 1 4 2" />
          <path d="M6 13c1-1 2-1.5 4-1.5s2.5.5 3.5.5 2.5-.5 3.5-.5" />
          <path d="M8 8c1-.5 2-1 4-1s3 .5 4 .5" />
          <line x1="2" y1="18" x2="22" y2="18" />
        </svg>
      )
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Head Style</label>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {headTypes.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`btn ${headType === t.value ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderRadius: 'var(--radius-sm)',
                height: '56px'
              }}
              onClick={() => updateParam('headType', t.value)}
            >
              {t.icon}
              <span style={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', lineHeight: '1.1' }}>{t.labelShort}</span>
            </button>
          ))}
        </div>
        
        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.3', minHeight: '26px' }}>
          💡 <strong>{headTypes.find((t) => t.value === headType)?.label}:</strong> {headTypes.find((t) => t.value === headType)?.description}
        </p>
      </div>

      <SliderControl
        label="Head Size Multiplier"
        min={0.6}
        max={1.8}
        step={0.05}
        value={headScale}
        onChange={(val) => updateParam('headScale', val)}
        formatValue={(val) => `${Math.round(val * 100)}%`}
      />
    </div>
  );
};
