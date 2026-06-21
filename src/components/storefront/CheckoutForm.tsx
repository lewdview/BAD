import React, { useState } from 'react';
import { X, Truck, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { CartItem, OrderItem } from '../../types';
import { ModalOverlay } from '../ui/ModalOverlay';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  isPOS: boolean;
  demoMode: boolean;
  onSubmitOrder: (newOrder: OrderItem) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isOpen,
  onClose,
  cart,
  subtotal,
  isPOS,
  demoMode,
  onSubmitOrder
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');
  const [orderNumber, setOrderNumber] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNum: '',
    cardExp: '',
    cardCVV: '',
    discreetShipping: true,
    discreetBilling: true
  });

  if (!isOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');
    
    // Simulate gateway auth
    setTimeout(() => {
      const generatedOrderNumber = `BAD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrderNumber);
      
      const newOrder: OrderItem = {
        orderNumber: generatedOrderNumber,
        customerName: form.name || 'Anonymous Customer',
        customerEmail: form.email || 'guest@buildadil.do',
        customerAddress: form.address || 'In-Store Pickup',
        customerCity: form.city || 'BAD Flagship Store',
        customerZip: form.zip || 'N/A',
        items: [...cart],
        subtotal: subtotal,
        date: new Date().toISOString(),
        status: 'Pending Mold'
      };

      onSubmitOrder(newOrder);
      setCheckoutStep('success');
    }, 2000);
  };

  return (
    <ModalOverlay onClose={onClose} zIndex={2000} blur={10}>
      <div 
        className="glass-panel"
        style={{ 
          width: '100%', 
          maxWidth: '550px', 
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {checkoutStep === 'details' && (
          <form onSubmit={handleCheckoutSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                {isPOS ? "In-Store Terminal POS Billing" : "Secure Checkout"}
              </h2>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '8px', borderRadius: '50%', width: '34px', height: '34px' }}
                onClick={onClose}
                aria-label="Close Checkout"
              >
                <X size={14} />
              </button>
            </div>

            {/* Privacy Notices */}
            {!isPOS && (
              <div 
                style={{ 
                  backgroundColor: 'rgba(212, 175, 55, 0.06)', 
                  border: '1px solid rgba(212, 175, 55, 0.25)', 
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 18px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 700 }}>
                  <ShieldCheck size={16} /> {demoMode ? "Order Processing Secure" : "Discrete Billing Enabled"}
                </div>
                <div style={{ lineHeight: 1.5 }}>
                  {demoMode ? (
                    <>This transaction will appear on your card statement as <strong>"BAD MOLD STUDIO"</strong>.</>
                  ) : (
                    <>This transaction will appear on your card statement as <strong>"BAD WELLNESS LLC"</strong>. No adult references will be shown on any statement.</>
                  )}
                </div>
              </div>
            )}

            {/* Billing Details fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label 
                  htmlFor="checkout-name"
                  style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                >
                  Full Name
                </label>
                <input 
                  id="checkout-name"
                  type="text" 
                  required 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label 
                  htmlFor="checkout-email"
                  style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                >
                  Email Address
                </label>
                <input 
                  id="checkout-email"
                  type="email" 
                  required 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              
              {!isPOS && (
                <div>
                  <label 
                    htmlFor="checkout-address"
                    style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                  >
                    Shipping Address
                  </label>
                  <input 
                    id="checkout-address"
                    type="text" 
                    required 
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                {!isPOS ? (
                  <div>
                    <label 
                      htmlFor="checkout-city"
                      style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                    >
                      City
                    </label>
                    <input 
                      id="checkout-city"
                      type="text" 
                      required 
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                ) : (
                  <div>
                    <label 
                      htmlFor="checkout-store"
                      style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                    >
                      Store Location
                    </label>
                    <input 
                      id="checkout-store"
                      type="text" 
                      disabled 
                      style={{ color: 'var(--text-muted)' }}
                      value="BAD Flagship - New York"
                    />
                  </div>
                )}
                <div>
                  <label 
                    htmlFor="checkout-zip"
                    style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                  >
                    Zip Code
                  </label>
                  <input 
                    id="checkout-zip"
                    type="text" 
                    required 
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  />
                </div>
              </div>

              <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />

              {/* Card Billing info */}
              <div>
                <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <CreditCard size={15} color="var(--accent-gold)" /> Payment Details
                </h4>
                <label 
                  htmlFor="checkout-card"
                  style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                >
                  {isPOS ? "Scan Card / Input Card Number" : "Credit Card Number"}
                </label>
                <input 
                  id="checkout-card"
                  type="text" 
                  required 
                  placeholder={isPOS ? "Waiting for Terminal Swipe..." : "•••• •••• •••• ••••"}
                  value={form.cardNum}
                  onChange={(e) => setForm({ ...form, cardNum: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label 
                    htmlFor="checkout-exp"
                    style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                  >
                    Expiration
                  </label>
                  <input 
                    id="checkout-exp"
                    type="text" 
                    required 
                    placeholder="MM/YY"
                    value={form.cardExp}
                    onChange={(e) => setForm({ ...form, cardExp: e.target.value })}
                  />
                </div>
                <div>
                  <label 
                    htmlFor="checkout-cvv"
                    style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                  >
                    CVV
                  </label>
                  <input 
                    id="checkout-cvv"
                    type="text" 
                    required 
                    placeholder="•••"
                    value={form.cardCVV}
                    onChange={(e) => setForm({ ...form, cardCVV: e.target.value })}
                  />
                </div>
              </div>

              {/* Discreet Checkboxes */}
              {!isPOS && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  <label 
                    htmlFor="checkout-discreet-shipping"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  >
                    <input 
                      id="checkout-discreet-shipping"
                      type="checkbox" 
                      checked={form.discreetShipping} 
                      onChange={(e) => setForm({ ...form, discreetShipping: e.target.checked })} 
                      style={{ accentColor: 'var(--accent-gold)' }}
                    />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <Truck size={14} /> Pack in plain, unbranded packaging
                    </span>
                  </label>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary animate-fade-in" 
                style={{ width: '100%', marginTop: '16px' }}
              >
                Submit Payment of ${subtotal.toFixed(2)}
              </button>
            </div>
          </form>
        )}

        {checkoutStep === 'processing' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div 
              className="spinner"
              style={{
                width: '44px',
                height: '44px',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent-gold)',
                borderRadius: '50%',
                margin: '0 auto 24px auto',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 700 }}>Processing Payment...</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Encrypting credentials via PCI-compliant gateway.</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <CheckCircle2 size={64} color="var(--accent-gold)" style={{ margin: '0 auto 24px auto', filter: 'drop-shadow(0 0 8px var(--accent-gold-glow))' }} />
            <h3 style={{ fontSize: '24px', marginBottom: '12px', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>Order Confirmed!</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Thank you for your order. Your receipt code is:
            </p>
            <div 
              style={{ 
                fontFamily: 'monospace', 
                fontSize: '20px', 
                fontWeight: 700, 
                backgroundColor: 'var(--bg-tertiary)', 
                padding: '12px 24px', 
                borderRadius: 'var(--radius-sm)',
                display: 'inline-block',
                marginBottom: '28px',
                border: '1px solid var(--border-color)',
                color: 'var(--accent-gold)',
                boxShadow: 'var(--shadow-inset)',
                letterSpacing: '0.05em'
              }}
            >
              {orderNumber}
            </div>
            
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 28px auto', lineHeight: 1.65 }}>
              {isPOS ? (
                "Receipt has been printed. The physical custom order vector paths have been pushed to the CAD manufacturing queue."
              ) : demoMode ? (
                "Blueprinted and billed as 'BAD MOLD STUDIO'. A shipping confirmation containing your custom mold blueprints and order tracking information will be emailed to you shortly."
              ) : (
                "Blueprinted and billed as 'BAD Wellness LLC'. A shipping confirmation containing discrete tracking information will be emailed to you shortly."
              )}
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '12px 20px', fontWeight: 700 }}
              onClick={onClose}
            >
              Return to Storefront
            </button>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
};
