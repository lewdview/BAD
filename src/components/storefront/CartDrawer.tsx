import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import type { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  isPOS: boolean;
  subtotal: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  isPOS,
  subtotal
}) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        bottom: 0, 
        left: 0, 
        backgroundColor: 'rgba(0,0,0,0.75)', 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000, 
        display: 'flex', 
        justifyContent: 'flex-end' 
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel"
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '28px',
          borderLeft: '1px solid var(--border-color)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
            <ShoppingBag size={20} color="var(--accent-gold)" /> Shopping Cart
          </h2>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '8px', borderRadius: '50%', width: '34px', height: '34px' }}
            onClick={onClose}
            aria-label="Close Shopping Cart"
          >
            <X size={14} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '60px', fontSize: '13px' }}>
              Your cart is empty.
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  padding: '18px', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  gap: '14px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{item.name}</span>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '14px' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  {item.isCustom && item.parameters && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      Length: {item.parameters.length.toFixed(1)}" | Girth: {item.parameters.shaftGirth.toFixed(2)}x
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '2px 10px', backgroundColor: 'var(--bg-secondary)' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '2px 4px', border: 'none', background: 'transparent', minWidth: 'auto', height: 'auto' }}
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '2px 4px', border: 'none', background: 'transparent', minWidth: 'auto', height: 'auto' }}
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-crimson)', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => onRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Subtotal & Checkout */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Subtotal:</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-gold)' }}>${subtotal.toFixed(2)}</span>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px' }}
              onClick={onCheckout}
            >
              {isPOS ? "Proceed to In-Store Payment" : "Proceed to discreet Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
