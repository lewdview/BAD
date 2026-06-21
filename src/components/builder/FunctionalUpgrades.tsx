import React from 'react';
import type { BuilderParams, UpdateParamFn } from '../../types';

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
            onChange={(e) => updateParam('internalTube', e.target.checked)} 
          />
          <span className="slider"></span>
        </div>
      </label>

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
