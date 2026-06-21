import React from 'react';
import { Star } from 'lucide-react';
import type { Product } from '../../types';

interface ProductGridProps {
  productsList: Product[];
  onAddToCart: (product: Product) => void;
  demoMode: boolean;
  isPOS: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  productsList,
  onAddToCart,
  demoMode,
  isPOS
}) => {
  return (
    <section style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '28px', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', fontWeight: 700 }}>
        {demoMode ? "Explore Custom Craft Molds" : (isPOS ? "BAD Floor Catalog: Pre-Made Basics" : "Explore BAD Basics")}
      </h2>
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {productsList.map((prod) => (
          <div 
            key={prod.id} 
            className="card animate-fade-in" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px',
              padding: '24px'
            }}
          >
            <div 
              style={{ 
                width: '100%', 
                height: '240px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-color)',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${prod.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{prod.name}</h3>
                <span style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '16px' }}>${prod.price.toFixed(2)}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{prod.description}</p>
              <div style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Star size={12} fill="var(--accent-gold)" stroke="none" /> {prod.rating}
              </div>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: 'auto', padding: '11px 20px', fontWeight: 700 }}
              onClick={() => onAddToCart(prod)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
