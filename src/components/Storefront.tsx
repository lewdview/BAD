import React, { useState } from 'react';
import { ShoppingBag, X, Shield, Truck, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  isCustom?: boolean;
  parameters?: any;
  quantity: number;
}

interface StorefrontProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onLaunchBuilder: () => void;
  isPOS: boolean;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
}

const PREMADE_PRODUCTS = [
  {
    id: 'basic-classic',
    name: 'BAD Basic Classic',
    description: 'Sleek, firm, cylindrical silhouette crafted in pure medical silicone.',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400', // Mock representation
    rating: '4.8 (192 reviews)'
  },
  {
    id: 'basic-wave',
    name: 'BAD Basic Wave',
    description: 'Contoured dual-wave shaft for concentrated internal stimulation.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?auto=format&fit=crop&q=80&w=400',
    rating: '4.9 (340 reviews)'
  },
  {
    id: 'wellness-pulse',
    name: 'BAD Pulse Wand',
    description: 'Equipped with a quiet, rechargeable multi-speed vibration motor.',
    price: 119.00,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    rating: '4.7 (89 reviews)'
  }
];

export const Storefront: React.FC<StorefrontProps> = ({
  cart,
  setCart,
  onLaunchBuilder,
  isPOS,
  orders: _orders,
  setOrders
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');

  // Checkout Form State
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

  const [orderNumber, setOrderNumber] = useState('');

  const addToCart = (product: typeof PREMADE_PRODUCTS[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, amount: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');
    
    // Simulate gateway auth
    setTimeout(() => {
      const generatedOrderNumber = `BAD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrderNumber);
      
      const newOrder = {
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

      setOrders((prev) => [newOrder, ...prev]);
      setCheckoutStep('success');
      setCart([]); // Clear cart
    }, 2000);
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      
      {/* Brand Hero Callout */}
      <section 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(212, 175, 55, 0.05) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          padding: '60px 40px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '48px'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} /> The Custom pleasure Revolution
          </span>
          <h1 style={{ fontSize: '48px', margin: '16px 0', fontFamily: 'var(--font-serif)' }}>
            Designed By You. Crafted By Us.
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Create body-safe, medical-grade silicone pleasure products tailored down to the millimeter. Choose your length, contour, girth, density, and colors.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ padding: '16px 36px', fontSize: '16px', fontWeight: 600 }}
            onClick={onLaunchBuilder}
          >
            Launch BAD Builder Engine
          </button>
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>
          {isPOS ? "BAD Floor Catalog: Pre-Made Basics" : "Explore BAD Basics"}
        </h2>
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {PREMADE_PRODUCTS.map((prod) => (
            <div key={prod.id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${prod.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Visual Placeholder */}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '18px' }}>{prod.name}</h3>
                  <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>${prod.price.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: '13px', marginTop: '6px' }}>{prod.description}</p>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>★ {prod.rating}</div>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => addToCart(prod)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Drawer (Fixed overlay) */}
      {isCartOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            left: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            backdropFilter: 'blur(4px)',
            zIndex: 1000, 
            display: 'flex', 
            justifyContent: 'flex-end' 
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '450px', 
              backgroundColor: 'var(--bg-secondary)', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              borderLeft: '1px solid var(--border-color)',
              padding: '24px' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} /> Shopping Cart
              </h2>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '8px', borderRadius: '50%' }}
                onClick={() => setIsCartOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                  Your cart is empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      padding: '16px', 
                      backgroundColor: 'var(--bg-tertiary)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      gap: '12px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '14px' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {item.isCustom && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Length: {item.parameters.length.toFixed(1)}" | Girth: {item.parameters.shaftGirth.toFixed(2)}x
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '2px 6px', border: 'none', background: 'transparent' }}
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '13px' }}>{item.quantity}</span>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '2px 6px', border: 'none', background: 'transparent' }}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent-crimson)', fontSize: '11px', cursor: 'pointer' }}
                          onClick={() => removeFromCart(item.id)}
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
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                  <span style={{ fontSize: '20px', fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px' }}
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                    setCheckoutStep('details');
                  }}
                >
                  {isPOS ? "Proceed to In-Store Payment" : "Proceed to discreet Checkout"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            left: 0, 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(8px)',
            zIndex: 2000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '550px', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              padding: '32px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {checkoutStep === 'details' && (
              <form onSubmit={handleCheckoutSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-serif)' }}>
                    {isPOS ? "In-Store Terminal POS Billing" : "Secure Checkout"}
                  </h2>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '8px', borderRadius: '50%' }}
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Privacy Notices (Only in Consumer Web Mode) */}
                {!isPOS && (
                  <div 
                    style={{ 
                      backgroundColor: 'rgba(212, 175, 55, 0.05)', 
                      border: '1px solid rgba(212, 175, 55, 0.2)', 
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      <Shield size={14} /> Discrete Billing Enabled
                    </div>
                    This transaction will appear on your card statement as <strong>"BAD WELLNESS LLC"</strong>. No adult toy references will be shown.
                  </div>
                )}

                {/* Billing Details fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  
                  {!isPOS && (
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Shipping Address</label>
                      <input 
                        type="text" 
                        required 
                        style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    {!isPOS ? (
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>City</label>
                        <input 
                          type="text" 
                          required 
                          style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Retail Store Location</label>
                        <input 
                          type="text" 
                          disabled 
                          style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)' }}
                          value="BAD Flagship - New York"
                        />
                      </div>
                    )}
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Zip Code</label>
                      <input 
                        type="text" 
                        required 
                        style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                        value={form.zip}
                        onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      />
                    </div>
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)', margin: '10px 0' }} />

                  {/* Card Billing info */}
                  <div>
                    <h4 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <CreditCard size={16} /> Payment Information
                    </h4>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {isPOS ? "Scan Card / Input Card Number" : "Credit Card Number"}
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder={isPOS ? "Waiting for Terminal Swipe..." : "•••• •••• •••• ••••"}
                      style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                      value={form.cardNum}
                      onChange={(e) => setForm({ ...form, cardNum: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Expiration</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="MM/YY"
                        style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                        value={form.cardExp}
                        onChange={(e) => setForm({ ...form, cardExp: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CVV</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="•••"
                        style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                        value={form.cardCVV}
                        onChange={(e) => setForm({ ...form, cardCVV: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Discreet Checkboxes */}
                  {!isPOS && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={form.discreetShipping} 
                          onChange={(e) => setForm({ ...form, discreetShipping: e.target.checked })} 
                        />
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Truck size={14} /> Pack in plain, unbranded packaging
                        </span>
                      </label>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '14px', marginTop: '12px' }}
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
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--border-color)',
                    borderTopColor: 'var(--accent-gold)',
                    borderRadius: '50%',
                    margin: '0 auto 24px auto',
                    animation: 'spin 1s linear infinite'
                  }}
                />
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Processing Payment...</h3>
                <p style={{ fontSize: '13px' }}>Encrypting credentials via PCI-compliant gateway.</p>
                <style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={60} color="var(--accent-gold)" style={{ margin: '0 auto 20px auto' }} />
                <h3 style={{ fontSize: '24px', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>Order Confirmed!</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Thank you for your order. Your receipt code is:
                </p>
                <div 
                  style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    backgroundColor: 'var(--bg-tertiary)', 
                    padding: '12px', 
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-block',
                    marginBottom: '24px',
                    border: '1px solid var(--border-color)',
                    color: 'var(--accent-gold)'
                  }}
                >
                  {orderNumber}
                </div>
                
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                  {isPOS ? (
                    "Receipt has been printed. The physical custom order vector paths have been pushed to the CAD manufacturing queue."
                  ) : (
                    "Billed as 'BAD Wellness LLC'. A shipping confirmation containing discrete tracking information will be emailed to you shortly."
                  )}
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  Return to Storefront
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
