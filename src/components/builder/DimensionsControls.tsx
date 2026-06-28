import React from 'react';
import type { BuilderParams, UpdateParamFn } from '../../types';
import { SliderControl } from '../ui/SliderControl';

interface DimensionsControlsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
  demoMode: boolean;
}

export const DimensionsControls: React.FC<DimensionsControlsProps> = ({
  params,
  updateParam,
  demoMode
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
      {/* Length Slider */}
      <SliderControl
        label={demoMode ? "Height" : "Insertable Length"}
        min={4.0}
        max={8.0}
        step={0.1}
        value={params.length}
        onChange={(val) => updateParam('length', val)}
        unit='"'
      />

      {/* Shaft Girth Slider */}
      <SliderControl
        label={demoMode ? "Body Width" : "Shaft Diameter (Girth)"}
        min={0.8}
        max={2.2}
        step={0.05}
        value={params.shaftGirth}
        onChange={(val) => updateParam('shaftGirth', val)}
        unit="x"
      />

      {/* Base Girth Slider */}
      <SliderControl
        label={demoMode ? "Base Width" : "Base Flange Width"}
        min={1.0}
        max={2.5}
        step={0.05}
        value={params.baseGirth}
        onChange={(val) => updateParam('baseGirth', val)}
        unit="x"
      />

      {/* Taper Slider */}
      <SliderControl
        label={demoMode ? "Taper Angle" : "Widening Taper Profile"}
        min={0.0}
        max={1.0}
        step={0.05}
        value={params.taper}
        onChange={(val) => updateParam('taper', val)}
        formatValue={(val) => demoMode ? `${Math.round(val * 100)}%` : (val === 0 ? 'Straight cylindrical' : val < 0.4 ? 'Soft Taper' : 'Steep/Cone Taper')}
      />

      {/* Curvature Slider */}
      <SliderControl
        label={demoMode ? "Sweep Curvature" : "Shaft Curvature"}
        min={-1.5}
        max={1.5}
        step={0.1}
        value={params.curvature}
        onChange={(val) => updateParam('curvature', val)}
        formatValue={(val) => val === 0 ? 'Straight' : val > 0 ? 'Forward Bend' : 'Reverse Bend'}
      />

      {/* Curvature Angle Slider (Bend Direction) */}
      <SliderControl
        label="Bend Direction (360°)"
        min={0}
        max={360}
        step={5}
        value={params.curvatureAngle || 0}
        onChange={(val) => updateParam('curvatureAngle', val)}
        formatValue={(val) => {
          if (val === 0 || val === 360) return "Forward (0°)";
          if (val === 90) return "Right (90°)";
          if (val === 180) return "Backward (180°)";
          if (val === 270) return "Left (270°)";
          return `${val}°`;
        }}
      />
    </div>
  );
};
