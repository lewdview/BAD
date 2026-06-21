import React from 'react';
import type { BuilderParams, UpdateParamFn, SceneEnvironment } from '../../types';

interface SceneryARControlsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
}

export const SceneryARControls: React.FC<SceneryARControlsProps> = ({
  params,
  updateParam
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
      <label className="switch-label">
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Live Webcam AR Mode</span>
          <p style={{ fontSize: '9.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Project model into your room using camera</p>
        </div>
        <div className="switch">
          <input 
            type="checkbox" 
            checked={params.arMode} 
            onChange={(e) => {
              updateParam('arMode', e.target.checked);
              if (e.target.checked) {
                updateParam('sceneEnvironment', 'studio');
              }
            }} 
          />
          <span className="slider"></span>
        </div>
      </label>

      {!params.arMode && (
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Scenery Situation
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { 
                id: 'studio', 
                label: 'Studio', 
                icon: (
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                  </svg>
                )
              },
              { 
                id: 'shower', 
                label: 'Shower', 
                icon: (
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v2H4z" />
                    <path d="M12 6v6" />
                    <path d="M8 12h8v2H8z" />
                  </svg>
                )
              },
              { 
                id: 'case', 
                label: 'Velvet Case', 
                icon: (
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                  </svg>
                )
              }
            ].map((env) => (
              <button
                key={env.id}
                type="button"
                className={`btn ${params.sceneEnvironment === env.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  padding: '8px 4px', 
                  fontSize: '11px', 
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onClick={() => updateParam('sceneEnvironment', env.id as SceneEnvironment)}
              >
                {env.icon}
                <span>{env.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
