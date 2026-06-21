import React from 'react';
import type { BuilderParams, UpdateParamFn, EngraveStyle } from '../../types';
import { SliderControl } from '../ui/SliderControl';

interface EngravingControlsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
}

export const EngravingControls: React.FC<EngravingControlsProps> = ({
  params,
  updateParam
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
      <div>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Engraving Style</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { id: 'none', label: 'None' },
            { id: 'embossed', label: 'Embossed' },
            { id: 'engraved', label: 'Engraved' }
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              className={`btn ${params.engraveStyle === style.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 4px', fontSize: '10.5px', borderRadius: 'var(--radius-sm)' }}
              onClick={() => updateParam('engraveStyle', style.id as EngraveStyle)}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {params.engraveStyle && params.engraveStyle !== 'none' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Text Label (Max 15 Characters)
            </label>
            <input
              type="text"
              value={params.engraveText || ''}
              maxLength={15}
              onChange={(e) => updateParam('engraveText', e.target.value)}
              placeholder="e.g. BRANDNAME"
              style={{ fontFamily: 'monospace', marginTop: 0 }}
            />
          </div>

          <SliderControl
            label="Vertical Position"
            min={0.15}
            max={0.85}
            step={0.01}
            value={params.engravePosition !== undefined ? params.engravePosition : 0.5}
            onChange={(val) => updateParam('engravePosition', val)}
            formatValue={(val) => `${Math.round(val * 100)}%`}
          />

          <SliderControl
            label="Font Size"
            min={24}
            max={64}
            step={1}
            value={params.engraveSize !== undefined ? params.engraveSize : 44}
            onChange={(val) => updateParam('engraveSize', val)}
            unit="px"
          />

          <SliderControl
            label="Displacement Depth"
            min={0.1}
            max={1.0}
            step={0.05}
            value={params.engraveDepth !== undefined ? params.engraveDepth : 0.5}
            onChange={(val) => updateParam('engraveDepth', val)}
            formatValue={(val) => `${(val * 2.5).toFixed(2)} mm`}
          />
        </div>
      )}
    </div>
  );
};
