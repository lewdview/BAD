import React from 'react';
import type { BuilderParams, UpdateParamFn, ColorMode, Inclusions } from '../../types';
import { PREMIUM_COLORS } from '../../constants/colors';

interface ColorMaterialControlsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
}

export const ColorMaterialControls: React.FC<ColorMaterialControlsProps> = ({
  params,
  updateParam
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
      {/* Color Pour Mode */}
      <div>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Color Pour Technique</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {['Solid Color', 'Marble Swirl', 'Duo Gradient', 'Split Pour'].map((mode, index) => (
            <button
              key={mode}
              type="button"
              className={`btn ${params.colorMode === index ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 4px', fontSize: '10.5px', borderRadius: 'var(--radius-sm)' }}
              onClick={() => updateParam('colorMode', index as ColorMode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatch A */}
      <div>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {params.colorMode === 0 ? 'Silicone Pigment' : 'Color A (Base)'}
        </label>
        <div className="swatch-group">
          {PREMIUM_COLORS.map((col) => (
            <button 
              key={col.hex}
              type="button"
              className={`swatch ${params.color1 === col.hex ? 'active' : ''}`}
              style={{ backgroundColor: col.hex, border: params.color1 === col.hex ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', padding: 0 }}
              onClick={() => updateParam('color1', col.hex)}
              title={col.name}
              aria-label={`Select ${col.name} color`}
            />
          ))}
        </div>
      </div>

      {/* Color Swatch B */}
      {params.colorMode > 0 && (
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Color B (Blend / Split)</label>
          <div className="swatch-group">
            {PREMIUM_COLORS.map((col) => (
              <button 
                key={col.hex}
                type="button"
                className={`swatch ${params.color2 === col.hex ? 'active' : ''}`}
                style={{ backgroundColor: col.hex, border: params.color2 === col.hex ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', padding: 0 }}
                onClick={() => updateParam('color2', col.hex)}
                title={col.name}
                aria-label={`Select ${col.name} color B`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inclusions Selector */}
      <div>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Material Inclusions & Shimmer</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { id: 'none', label: 'Pure', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" strokeDasharray="3 3"/></svg>
            )},
            { id: 'glitter', label: 'Glitter', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18M7.5 7.5l9 9M7.5 16.5l9-9"/></svg>
            )},
            { id: 'metallic', label: 'Metallic', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21L21 3M9 21L21 9M3 15L15 3"/></svg>
            )},
            { id: 'glow', label: 'Glow', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5l1.5 1.5M5 19l1.5-1.5M17.5 6.5l1.5-1.5"/></svg>
            )}
          ].map((inc) => (
            <button
              key={inc.id}
              type="button"
              className={`btn ${params.inclusions === inc.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                padding: '8px 4px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '4px', 
                borderRadius: 'var(--radius-sm)',
                height: '52px'
              }}
              onClick={() => {
                updateParam('inclusions', inc.id as Inclusions);
                if (inc.id === 'glow') {
                  updateParam('blacklightMode', true);
                }
              }}
            >
              {inc.icon}
              <span style={{ fontSize: '9px', fontWeight: 700 }}>{inc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thermochromic heat color shift toggle */}
      <label className="switch-label">
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Thermochromic Shift</span>
          <p style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Color changes with body heat (+ $18.00)</p>
        </div>
        <div className="switch">
          <input 
            type="checkbox" 
            checked={params.thermochromic} 
            onChange={(e) => updateParam('thermochromic', e.target.checked)} 
          />
          <span className="slider"></span>
        </div>
      </label>

      {/* Blacklight environment view mode toggle */}
      <label className="switch-label" style={{ border: '1px solid rgba(217, 70, 239, 0.15)', padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(217, 70, 239, 0.01)' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-pink)' }}>Toggle Blacklight Mode</span>
          <p style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '2px' }}>View UV reactive pigment glows</p>
        </div>
        <div className="switch">
          <input 
            type="checkbox" 
            checked={params.blacklightMode} 
            onChange={(e) => updateParam('blacklightMode', e.target.checked)} 
          />
          <span className="slider"></span>
        </div>
      </label>
    </div>
  );
};
