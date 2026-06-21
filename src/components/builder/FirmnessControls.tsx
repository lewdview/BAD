import React from 'react';
import type { BuilderParams, UpdateParamFn, Firmness } from '../../types';

interface FirmnessControlsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
  demoMode: boolean;
}

export const FirmnessControls: React.FC<FirmnessControlsProps> = ({
  params,
  updateParam,
  demoMode
}) => {
  const modes = demoMode ? [
    { id: 'soft', label: 'Shore 10A', sub: 'Flexible Cups' },
    { id: 'medium', label: 'Shore 20A', sub: 'Standard Molds' },
    { id: 'firm', label: 'Shore 40A', sub: 'Rigid Casings' },
    { id: 'dual-density', label: 'Dual Density', sub: 'High-Density Shell' }
  ] : [
    { id: 'soft', label: 'Shore 10A', sub: 'Flexible/Soft' },
    { id: 'medium', label: 'Shore 20A', sub: 'Realistic Tissue' },
    { id: 'firm', label: 'Shore 40A', sub: 'Rigid/Intense' },
    { id: 'dual-density', label: 'Dual-Density', sub: 'Rigid Core + Soft Shell' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={`btn ${params.firmness === mode.id ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', borderRadius: 'var(--radius-sm)' }}
          onClick={() => updateParam('firmness', mode.id as Firmness)}
        >
          <span style={{ fontSize: '11px', fontWeight: 700 }}>{mode.label}</span>
          <span style={{ fontSize: '9px', color: params.firmness === mode.id ? '#000000' : 'var(--text-muted)' }}>{mode.sub}</span>
        </button>
      ))}
    </div>
  );
};
