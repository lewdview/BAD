import React from 'react';
import type { BuilderParams, UpdateParamFn } from '../../types';
import { SliderControl } from '../ui/SliderControl';

interface TesticleControlsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
}

export const TesticleControls: React.FC<TesticleControlsProps> = ({
  params,
  updateParam
}) => {
  const hasBalls = params.hasBalls;
  const ballSize = params.ballSize !== undefined ? params.ballSize : 1.0;
  const ballAsymmetry = params.ballAsymmetry !== undefined ? params.ballAsymmetry : 0.0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
      <label className="switch-label">
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Enable Anatomical Testicles</span>
          <p style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>Adds dual base spheres (+ $20.00)</p>
        </div>
        <div className="switch">
          <input 
            type="checkbox" 
            checked={hasBalls} 
            onChange={(e) => updateParam('hasBalls', e.target.checked)} 
          />
          <span className="slider"></span>
        </div>
      </label>

      {hasBalls && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          <SliderControl
            label="Gonad Size Multiplier"
            min={0.8}
            max={1.8}
            step={0.05}
            value={ballSize}
            onChange={(val) => updateParam('ballSize', val)}
            formatValue={(val) => `${Math.round(val * 100)}%`}
          />

          <SliderControl
            label="Sack Swivel Offset"
            min={-90}
            max={90}
            step={5}
            value={ballAsymmetry}
            onChange={(val) => updateParam('ballAsymmetry', val)}
            formatValue={(val) => val === 0 ? "Centered (Rear)" : val > 0 ? `Swiveled Right (+${val}°)` : `Swiveled Left (${val}°)`}
          />
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '-4px' }}>
            🔄 Swiveling the scrotal sack to one side angles the base stimulation node. Position it left or right to target the clitoris directly during use.
          </p>
        </div>
      )}
    </div>
  );
};
