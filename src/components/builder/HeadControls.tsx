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

  const headTypes: { value: HeadType; label: string; description: string }[] = [
    { value: 'classic', label: 'Classic Domed', description: 'Traditional round shape with corona ridge' },
    { value: 'realistic', label: 'Realistic Anatomical', description: 'True-to-life detailing with cleft and slit' },
    { value: 'bulbous', label: 'Bulbous Swollen', description: 'Flares outward for increased g-spot contact' },
    { value: 'tapered', label: 'Smooth Tapered', description: 'Gently narrowing tip for easier insertion' },
    { value: 'alien', label: 'Alien Flared', description: 'Sci-fi inspired double ridge detailing' },
    { value: 'dragon', label: 'Dragon Ribbed', description: 'Segmented reptile nodes for intense sensation' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Head Style</label>
        <select
          value={headType}
          onChange={(e) => updateParam('headType', e.target.value as HeadType)}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none'
          }}
        >
          {headTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
          💡 {headTypes.find((t) => t.value === headType)?.description}
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
