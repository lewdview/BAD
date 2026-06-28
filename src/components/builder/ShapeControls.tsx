import type { BuilderParams, UpdateParamFn, ShapeType, FantasyType, BaseType, TextureType } from '../../types';
import { SliderControl } from '../ui/SliderControl';

interface ShapeControlsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
  demoMode: boolean;
}

export const ShapeControls: React.FC<ShapeControlsProps> = ({
  params,
  updateParam,
  demoMode
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
      {demoMode ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'candle', label: 'Spiral Candle' },
              { id: 'soap', label: 'Honeycomb Soap' },
              { id: 'kitchen', label: 'Baking Cup' },
              { id: 'collectible', label: 'Chibi Figurine' }
            ].map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`btn ${params.shapeType === scenario.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 4px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                onClick={() => {
                  updateParam('shapeType', scenario.id as ShapeType);
                  if (scenario.id === 'candle') {
                    updateParam('texture', 'swirled');
                    updateParam('baseGeometry', 'classic');
                  } else if (scenario.id === 'soap') {
                    updateParam('texture', 'smooth');
                    updateParam('baseGeometry', 'classic');
                  } else if (scenario.id === 'kitchen') {
                    updateParam('texture', 'ribbed');
                    updateParam('baseGeometry', 'classic');
                  } else if (scenario.id === 'collectible') {
                    updateParam('texture', 'smooth');
                    updateParam('baseGeometry', 'classic');
                  }
                }}
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            {[
              { id: 'classic', label: 'Classic Shaft' },
              { id: 'realistic', label: 'Anatomical' },
              { id: 'fantasy', label: 'Fantasy/Sci-Fi' },
              { id: 'targeted', label: 'Targeted G-Spot' }
            ].map((shape) => (
              <button
                key={shape.id}
                type="button"
                className={`btn ${params.shapeType === shape.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 4px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                onClick={() => {
                  updateParam('shapeType', shape.id as ShapeType);
                  if (shape.id === 'targeted') {
                    updateParam('baseGeometry', 'ergonomic');
                    updateParam('curvature', 0.85);
                  } else {
                    updateParam('baseGeometry', 'classic');
                  }
                }}
              >
                {shape.label}
              </button>
            ))}
          </div>

          {params.shapeType === 'realistic' && (
            <div className="animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>REALISTIC CONTROLS</span>
              <SliderControl
                label="Vein Prominence"
                min={0.0}
                max={1.0}
                step={0.05}
                value={params.realisticVeins}
                onChange={(val) => updateParam('realisticVeins', val)}
                formatValue={(val) => `${Math.round(val * 100)}%`}
              />

            </div>
          )}

          {params.shapeType === 'fantasy' && (
            <div className="animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
              <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '10px', letterSpacing: '0.05em' }}>FANTASY STYLE OPTIONS</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { id: 'dragon', label: 'Dragon', icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 3.5-3 3.5 3 3.5-3 3.5-3-3.5 3-3.5-3-3.5zM6 5.5h12M6 12.5h12"/></svg>
                  )},
                  { id: 'alien', label: 'Alien', icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="5" ry="8"/><path d="M8 11.5s1-1 4-1 4 1 4 1"/></svg>
                  )},
                  { id: 'tentacle', label: 'Tentacle', icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-3 4-3 12 0 20M12 6c-2 0-3 1-3 2s1 2 3 2M12 14c-2 0-3 1-3 2s1 2 3 2"/></svg>
                  )}
                ].map((fan) => (
                  <button
                    key={fan.id}
                    type="button"
                    className={`btn ${params.fantasyType === fan.id ? 'btn-primary' : 'btn-secondary'}`}
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
                    onClick={() => updateParam('fantasyType', fan.id as FantasyType)}
                  >
                    {fan.icon}
                    <span style={{ fontSize: '9px', fontWeight: 700 }}>{fan.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Base Style Selection */}
      <div style={{ marginTop: '14px', borderTop: '1px dashed var(--border-color)', paddingTop: '14px' }}>
        <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Base Style
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {[
            { id: 'flared', label: 'Flared Cup' },
            { id: 'flat', label: 'Flat B2B' },
            { id: 'harness', label: 'Harness Collar' }
          ].map((base) => (
            <button
              key={base.id}
              type="button"
              className={`btn ${params.baseType === base.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                padding: '8px 4px', 
                fontSize: '10px', 
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700
              }}
              onClick={() => updateParam('baseType', base.id as BaseType)}
            >
              {base.label}
            </button>
          ))}
        </div>
      </div>

      {/* Surface Texture Selection */}
      <div style={{ marginTop: '14px', borderTop: '1px dashed var(--border-color)', paddingTop: '14px' }}>
        <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Surface Texture
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { id: 'smooth', label: 'Smooth' },
            { id: 'ribbed', label: 'Ribbed' },
            { id: 'swirled', label: 'Swirl' },
            { id: 'studded', label: 'Studded' }
          ].map((tex) => (
            <button
              key={tex.id}
              type="button"
              className={`btn ${params.texture === tex.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                padding: '8px 2px', 
                fontSize: '10px', 
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700
              }}
              onClick={() => updateParam('texture', tex.id as TextureType)}
            >
              {tex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
