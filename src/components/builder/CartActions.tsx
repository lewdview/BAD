import React from 'react';
import { Share2, Layers, Camera, ShoppingCart, ShieldCheck } from 'lucide-react';
import type { BuilderParams, UpdateParamFn } from '../../types';

interface CartActionsProps {
  params: BuilderParams;
  updateParam: UpdateParamFn;
  currentPrice: number;
  demoMode: boolean;
  onShareToSocial: () => void;
  onExportSTL: () => void;
  onAddToCart: () => void;
}

export const CartActions: React.FC<CartActionsProps> = ({
  params,
  updateParam,
  currentPrice,
  demoMode,
  onShareToSocial,
  onExportSTL,
  onAddToCart
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Compare Scale toggle notice */}
      <div style={{ marginBottom: '8px' }}>
        <label className="switch-label">
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Compare Physical Scale</span>
            <p style={{ fontSize: '9.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>Overlay 5.8" smartphone next to model.</p>
          </div>
          <div className="switch">
            <input 
              type="checkbox" 
              checked={params.showScaleRef} 
              onChange={(e) => updateParam('showScaleRef', e.target.checked)} 
            />
            <span className="slider"></span>
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Calculated Cost:</span>
        <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
          ${currentPrice.toFixed(2)}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          type="button"
          className="btn btn-secondary" 
          style={{ padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onClick={onShareToSocial}
          title="Share Design to BAD Gallery"
        >
          <Share2 size={16} />
        </button>
        <button 
          type="button"
          className="btn btn-secondary" 
          style={{ padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700 }}
          onClick={onExportSTL}
          title="Export STL Schematic for Home 3D Printing"
        >
          <Layers size={16} /> Export STL
        </button>
        <button 
          type="button"
          className="btn btn-glow" 
          style={{ padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700 }}
          onClick={() => window.dispatchEvent(new CustomEvent('export-hires'))}
          title="Export Hi-Res Render Spec Sheet Card"
        >
          <Camera size={16} /> Render
        </button>
        <button 
          type="button"
          className="btn btn-primary" 
          style={{ flex: 1, padding: '12px', gap: '6px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 700 }}
          onClick={onAddToCart}
        >
          <ShoppingCart size={16} /> Add to Order
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
        <ShieldCheck size={14} color="var(--accent-gold)" /> {demoMode ? "Food-Safe Platinum Silicone | Heat Resistant" : "Medical-Grade Platinum Silicone | Body Safe"}
      </div>
    </div>
  );
};
