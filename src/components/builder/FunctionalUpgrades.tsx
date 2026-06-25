import React from 'react';
import type { BuilderParams, UpdateParamFn } from '../../types';
import { SliderControl } from '../ui/SliderControl';

interface FunctionalUpgradesProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
}

export const FunctionalUpgrades: React.FC<FunctionalUpgradesProps> = ({
  params,
  updateParam
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
      <label className="switch-label">
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Ejaculation Tube</span>
          <p style={{ fontSize: '9.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Internal fluid delivery core (+ $25.00)</p>
        </div>
        <div className="switch">
          <input 
            type="checkbox" 
            checked={params.internalTube} 
            onChange={(e) => {
              updateParam('internalTube', e.target.checked);
              if (e.target.checked) {
                updateParam('hasOrifice', false);
              }
            }} 
          />
          <span className="slider"></span>
        </div>
      </label>

      <label className="switch-label">
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Molded Orifice Cavity</span>
          <p style={{ fontSize: '9.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Internal anatomical negative pocket (+ $35.00)</p>
        </div>
        <div className="switch">
          <input 
            type="checkbox" 
            checked={params.hasOrifice || false} 
            onChange={(e) => {
              updateParam('hasOrifice', e.target.checked);
              if (e.target.checked) {
                updateParam('internalTube', false);
              }
            }} 
          />
          <span className="slider"></span>
        </div>
      </label>

      {params.hasOrifice && (
        <div className="animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>ORIFICE SELECTION</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {[
              { id: 'vaginal', label: 'Vaginal' },
              { id: 'anal', label: 'Anal' },
              { id: 'pocket', label: 'Pocket (Ribs)' }
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                className={`btn ${params.orificeType === o.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 4px', fontSize: '10px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}
                onClick={() => updateParam('orificeType', o.id as 'vaginal' | 'anal' | 'pocket')}
              >
                {o.label}
              </button>
            ))}
          </div>
          <SliderControl
            label="Canal Depth"
            min={Number((0.25 * params.length).toFixed(1))}
            max={Number((0.7 * params.length).toFixed(1))}
            step={0.1}
            value={Number(((params.orificeDepth || 0.4) * params.length).toFixed(1))}
            onChange={(val) => {
              const percentage = val / params.length;
              updateParam('orificeDepth', percentage);
            }}
            formatValue={(val) => `${val.toFixed(1)}"`}
          />
        </div>
      )}

      <label className="switch-label">
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Vibrating Bullet Chamber</span>
          <p style={{ fontSize: '9.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Removable bullet chamber pocket (+ $25.00)</p>
        </div>
        <div className="switch">
          <input 
            type="checkbox" 
            checked={params.vibrationCore} 
            onChange={(e) => {
              updateParam('vibrationCore', e.target.checked);
              if (!e.target.checked) updateParam('isVibrating', false);
            }} 
          />
          <span className="slider"></span>
        </div>
      </label>

      {params.vibrationCore && (
        <button 
          type="button"
          className={`btn ${params.isVibrating ? 'btn-danger' : 'btn-secondary'}`}
          style={{ width: '100%', fontSize: '11px', padding: '10px' }}
          onClick={() => updateParam('isVibrating', !params.isVibrating)}
        >
          {params.isVibrating ? "Stop Test Vibration" : "Test Vibration Signal"}
        </button>
      )}
    </div>
  );
};
