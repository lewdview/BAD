import React, { useState } from 'react';
import { ShoppingBag, X, Truck, CreditCard, Sparkles, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

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
  demoMode: boolean;
}

const PREMADE_PRODUCTS = [
  {
    id: 'basic-classic',
    name: 'BAD Basic Classic',
    description: 'Sleek, firm, cylindrical silhouette crafted in pure medical silicone.',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400',
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

const DEMO_PREMADE_PRODUCTS = [
  {
    id: 'basic-candle',
    name: 'Vanilla Spiral Candle',
    description: 'A beautifully twisted paraffin-free soy wax candle with therapeutic essential oils.',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=400',
    rating: '4.8 (120 reviews)'
  },
  {
    id: 'basic-soap',
    name: 'Honeycomb Soap Bar',
    description: 'All-natural organic glycerin soap bar cast from a custom CAD honeycomb geometry.',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1607006342446-b5eb29fa24ad?auto=format&fit=crop&q=80&w=400',
    rating: '4.9 (95 reviews)'
  },
  {
    id: 'basic-cups',
    name: 'Silicone Muffin Baking Cups',
    description: 'Heat-resistant, BPA-free, non-stick fluted silicone baking cups.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
    rating: '4.7 (74 reviews)'
  },
  {
    id: 'basic-figurine',
    name: 'Low-Poly Figurine Base',
    description: 'Collectible high-density resin figurine base ready for custom painting.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1566134052345-316279f7e52a?auto=format&fit=crop&q=80&w=400',
    rating: '4.9 (42 reviews)'
  }
];

export const Storefront: React.FC<StorefrontProps> = ({
  cart,
  setCart,
  onLaunchBuilder,
  isPOS,
  orders: _orders,
  setOrders,
  demoMode
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');
  const [hook, setHook] = useState<'consumer' | 'retailer' | 'medical' | 'creator'>('consumer');

  const hooksContent = {
    consumer: {
      tagline: 'The Custom Pleasure Revolution',
      title: 'Designed By You. Crafted By Us.',
      description: 'Create body-safe, medical-grade silicone pleasure products tailored down to the millimeter. Choose your length, contour, girth, density, and colors.',
      cta: 'Launch BAD Builder Engine',
      features: [
        { title: 'Parametric CAD Scaling', desc: 'Adjust lengths and contours on the fly with real-time volumetric calculations.' },
        { title: 'Dual-Density Silicone', desc: 'Encapsulate a rigid inner core inside super-soft medical outer gel.' },
        { title: '100% Discrete Packaging', desc: 'Shipped in completely plain cardboard box billed as BAD Wellness LLC.' }
      ],
      testimonial: {
        quote: "Best product I've ever owned. Being able to choose the curve and dual firmness makes it a perfect fit.",
        author: "Aria S. — Verified Buyer"
      }
    },
    retailer: {
      tagline: 'Infinite SKU Capacity',
      title: 'Zero Inventory. 87% Gross Margins.',
      description: 'Empower your retail customers to compile custom CAD molds in-store or online. Manufactured on-demand with zero steel tooling upfront costs.',
      cta: 'Launch B2B Partner Portal',
      features: [
        { title: '24-Hour Lead Times', desc: 'No more waiting 6 months for steel molds. Print FDM molds instantly for $1.20.' },
        { title: 'Direct-to-Factory API', desc: 'Sync customer configurations straight to your print beds and curing floors.' },
        { title: 'Higher AOV Uplift', desc: 'D2C custom items command a 60% price premium over premade stock shelves.' }
      ],
      testimonial: {
        quote: "Syncing our e-commerce platform with the BAD CAD API eliminated all overstock. AOV rose to $142.50.",
        author: "Marcus Thorne — VP Innovation at LoveHoney"
      }
    },
    medical: {
      tagline: 'Hypoallergenic Pelvic Health',
      title: 'Anatomically Fit Wellness Devices.',
      description: 'Prescribe or customize FDA-compliant pelvic floor therapeutic dilators matched directly to patient physiology. Body-safe and non-porous.',
      cta: 'Open Medical Builder',
      features: [
        { title: 'Medical-Grade Silicone', desc: '100% Platinum-cure Class VI medical silicone. Free of phthalates and latex.' },
        { title: 'Graduated Taper Controls', desc: 'Smoothly adjust insertion curves and taper thresholds for therapeutic comfort.' },
        { title: 'Hygienic Solid Molds', desc: 'Manufactured with seamless split-mold lines to prevent micro-bacterial traps.' }
      ],
      testimonial: {
        quote: "This allows us to calibrate dilator shapes specific to post-operative patients. It is a game-changer for pelvic therapy.",
        author: "Dr. Sarah Jenkins — Stanford Pelvic Wellness Lab"
      }
    },
    creator: {
      tagline: 'Zero-Overhead Merchandising',
      title: 'Monetize Your Influence: Sell Custom Designs.',
      description: 'Design custom shapes, launch your catalog page to your fans, and collect high-margin CAD licensing royalties on every print. We handle the rest.',
      cta: 'Apply for Creator Portal',
      features: [
        { title: 'Vanity CAD URLs', desc: 'Give your community a direct link to buy or tweak your signature geometries.' },
        { title: 'Lifetime Royalties', desc: 'Earn 25% of gross checkout value on every custom item cast from your STL templates.' },
        { title: 'Zero Logistics Hassle', desc: 'No inventories, no shipping labels, no pouring silicone. We do the work, you get paid.' }
      ],
      testimonial: {
        quote: "My fans love buying my custom designs. The builder was super simple to use, and my royalty checks get paid weekly.",
        author: "Elena R. — Content Creator & Artist"
      }
    }
  };

  const demoHooksContent = {
    consumer: {
      tagline: 'The Custom Craft Revolution',
      title: 'Designed By You. Molded at Home.',
      description: 'Create custom parametric molds for candles, soaps, and home items. Calibrate dimensions, shapes, and textures to output flawless casing blueprints.',
      cta: 'Launch Custom Mold Studio',
      features: [
        { title: 'Parametric CAD Scaling', desc: 'Adjust shapes and flutes on the fly with real-time volumetric calculations.' },
        { title: 'Food-Safe Silicone', desc: 'Produce heat-resistant, non-toxic molds perfect for baking and kitchen crafts.' },
        { title: '100% Watertight STL Files', desc: 'Export solid models and two-part casing split molds ready for FDM/SLA printing.' }
      ],
      testimonial: {
        quote: "Designing my own custom candle molds has transformed my boutique candle line. The customizer gives me instant STL outputs.",
        author: "Elena Vance — Artisanal Candlemaker"
      }
    },
    retailer: {
      tagline: 'Fast-Track Custom Manufacturing',
      title: 'Zero Tooling Cost. Instant Prototypes.',
      description: 'Empower your craft brand or custom confectionery shop to compile custom CAD molds. Speed up production and bypass expensive CNC machinery.',
      cta: 'Launch B2B Craft Portal',
      features: [
        { title: 'FDM-Optimized Geometry', desc: 'Generated casings feature integrated snap-locking tabs and vent holes for easy casting.' },
        { title: 'High-Yield Production', desc: 'Use our generated casing STL files to print production-grade silicone cast liners.' },
        { title: 'Rapid Iteration', desc: 'Design, adjust, and print new soap or baking cup configurations in under 24 hours.' }
      ],
      testimonial: {
        quote: "Using BAD's CAD engine for custom chocolate and soap molds saved our brand thousands in tooling fees.",
        author: "David Choi — Operations Director at OrganicSoap Co."
      }
    },
    medical: {
      tagline: 'Precision Lab Casings',
      title: 'Custom Containers & Labware Molds.',
      description: 'Compile specialized scientific silicone casings, chemical containers, and microfluidic trays matched to custom specifications.',
      cta: 'Open Lab Customization',
      features: [
        { title: 'Biocompatible Polymers', desc: 'Cast utilizing high-grade FDA platinum silicones with clean, seamless split lines.' },
        { title: 'Zero Draft Angle Geometry', desc: 'Perfect cylindrical or faceted geometry outputs ensure seamless object extraction.' },
        { title: 'Volumetric Precision', desc: 'Ensure precise liquid containment measurements with parametric cylinder calculations.' }
      ],
      testimonial: {
        quote: "We print custom silicone sample trays daily. The CAD compiler generates watertight STL split casings with zero hassle.",
        author: "Dr. Alan Mercer — BioTech Lab Supplies"
      }
    },
    creator: {
      tagline: 'Sell Your Custom Shapes',
      title: 'Monetize Your Craft: Licensing Made Simple.',
      description: 'Upload and license your custom candle, soap, or collectible figurine shapes. Earn royalties when users customize and download your geometries.',
      cta: 'Apply for Creator License',
      features: [
        { title: 'Digital Rights DRM', desc: 'Your core parameters are securely compiled on the fly, preventing unauthorized STL extraction.' },
        { title: 'Passive Revenue Streams', desc: 'Earn royalty commissions on every customized STL download or printed mold casing.' },
        { title: 'Seamless Portfolio Sync', desc: 'List your shape templates directly on the storefront catalog for custom adjustment.' }
      ],
      testimonial: {
        quote: "I license my low-poly chibi figurines on the platform. The customizer is a huge hit with 3D painters.",
        author: "Chloe Park — Character Artist"
      }
    }
  };

  const currentHooksContent = demoMode ? demoHooksContent : hooksContent;
  const productsList = demoMode ? DEMO_PREMADE_PRODUCTS : PREMADE_PRODUCTS;

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

  const addToCart = (product: any) => {
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
      
      {/* Target Audience Selector (Glass Capsule style) */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '40px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-secondary)',
          padding: '6px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          maxWidth: '680px',
          margin: '0 auto 40px auto',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 16px', letterSpacing: '0.05em' }}>
          Persona:
        </span>
        {(['consumer', 'retailer', 'medical', 'creator'] as const).map((h) => (
          <button
            key={h}
            onClick={() => setHook(h)}
            style={{
              padding: '8px 18px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all var(--transition-fast)',
              backgroundColor: hook === h ? 'var(--accent-gold)' : 'transparent',
              color: hook === h ? '#000000' : 'var(--text-secondary)',
              boxShadow: hook === h ? '0 4px 10px var(--accent-gold-glow)' : 'none'
            }}
          >
            {h === 'consumer' ? 'Consumer' :
             h === 'retailer' ? 'B2B Retail' :
             h === 'medical' ? 'Medical/Health' : 'Creators'}
          </button>
        ))}
      </div>

      {/* Brand Hero Callout */}
      <section 
        className="card animate-fade-in" 
        key={hook}
        style={{ 
          background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(212, 175, 55, 0.06) 100%)',
          border: '1px solid var(--border-color)',
          borderLeft: '4px solid var(--accent-gold)',
          padding: '70px 48px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={12} /> {currentHooksContent[hook].tagline}
          </span>
          <h1 style={{ fontSize: '46px', margin: '16px 0', fontFamily: 'var(--font-serif)', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {currentHooksContent[hook].title}
          </h1>
          <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.65 }}>
            {currentHooksContent[hook].description}
          </p>
          <button 
            className="btn btn-primary" 
            style={{ padding: '14px 36px', fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}
            onClick={onLaunchBuilder}
          >
            {currentHooksContent[hook].cta}
          </button>
        </div>
      </section>

      {/* Dynamic Features Cards */}
      <section style={{ marginBottom: '40px' }} className="animate-fade-in" key={`feat-${hook}`}>
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {currentHooksContent[hook].features.map((feat, idx) => (
            <div key={idx} className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--accent-gold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Sparkles size={14} /> {feat.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Hook Testimonial Card */}
      <section style={{ marginBottom: '56px' }} className="animate-fade-in" key={`test-${hook}`}>
        <div 
          className="card" 
          style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--accent-gold)', 
            padding: '32px 40px',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '18px', lineHeight: 1.65 }}>
            "{currentHooksContent[hook].testimonial.quote}"
          </p>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            — {currentHooksContent[hook].testimonial.author}
          </div>
        </div>
      </section>

      {/* Product Grid */}
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
              >
              </div>
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
                onClick={() => addToCart(prod)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Drawer (Fixed glass overlay) */}
      {isCartOpen && (
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
              padding: '28px',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.3)'
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
                onClick={() => setIsCartOpen(false)}
              >
                <X size={14} />
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '60px', fontSize: '13px' }}>
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
                      {item.isCustom && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                          Length: {item.parameters.length.toFixed(1)}" | Girth: {item.parameters.shaftGirth.toFixed(2)}x
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '2px 10px', backgroundColor: 'var(--bg-secondary)' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '2px 4px', border: 'none', background: 'transparent', minWidth: 'auto', height: 'auto' }}
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '2px 4px', border: 'none', background: 'transparent', minWidth: 'auto', height: 'auto' }}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent-crimson)', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
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
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Subtotal:</span>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-gold)' }}>${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px', letterSpacing: '0.05em' }}
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

      {/* Checkout Modal (Glass theme) */}
      {isCheckoutOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            left: 0, 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
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
              padding: '36px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)'
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
                    onClick={() => setIsCheckoutOpen(false)}
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
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      style={{ 
                        width: '100%', 
                        padding: '11px 14px', 
                        marginTop: '6px', 
                        border: '1px solid var(--border-color)', 
                        backgroundColor: 'var(--bg-tertiary)', 
                        color: 'var(--text-primary)', 
                        borderRadius: 'var(--radius-sm)', 
                        outline: 'none',
                        transition: 'border-color var(--transition-fast)',
                        fontSize: '13px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      style={{ 
                        width: '100%', 
                        padding: '11px 14px', 
                        marginTop: '6px', 
                        border: '1px solid var(--border-color)', 
                        backgroundColor: 'var(--bg-tertiary)', 
                        color: 'var(--text-primary)', 
                        borderRadius: 'var(--radius-sm)', 
                        outline: 'none',
                        transition: 'border-color var(--transition-fast)',
                        fontSize: '13px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  
                  {!isPOS && (
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipping Address</label>
                      <input 
                        type="text" 
                        required 
                        style={{ 
                          width: '100%', 
                          padding: '11px 14px', 
                          marginTop: '6px', 
                          border: '1px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-tertiary)', 
                          color: 'var(--text-primary)', 
                          borderRadius: 'var(--radius-sm)', 
                          outline: 'none',
                          transition: 'border-color var(--transition-fast)',
                          fontSize: '13px' 
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    {!isPOS ? (
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</label>
                        <input 
                          type="text" 
                          required 
                          style={{ 
                            width: '100%', 
                            padding: '11px 14px', 
                            marginTop: '6px', 
                            border: '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-tertiary)', 
                            color: 'var(--text-primary)', 
                            borderRadius: 'var(--radius-sm)', 
                            outline: 'none',
                            transition: 'border-color var(--transition-fast)',
                            fontSize: '13px' 
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Store Location</label>
                        <input 
                          type="text" 
                          disabled 
                          style={{ width: '100%', padding: '11px 14px', marginTop: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}
                          value="BAD Flagship - New York"
                        />
                      </div>
                    )}
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zip Code</label>
                      <input 
                        type="text" 
                        required 
                        style={{ 
                          width: '100%', 
                          padding: '11px 14px', 
                          marginTop: '6px', 
                          border: '1px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-tertiary)', 
                          color: 'var(--text-primary)', 
                          borderRadius: 'var(--radius-sm)', 
                          outline: 'none',
                          transition: 'border-color var(--transition-fast)',
                          fontSize: '13px' 
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
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
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isPOS ? "Scan Card / Input Card Number" : "Credit Card Number"}
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder={isPOS ? "Waiting for Terminal Swipe..." : "•••• •••• •••• ••••"}
                      style={{ 
                        width: '100%', 
                        padding: '11px 14px', 
                        marginTop: '6px', 
                        border: '1px solid var(--border-color)', 
                        backgroundColor: 'var(--bg-tertiary)', 
                        color: 'var(--text-primary)', 
                        borderRadius: 'var(--radius-sm)', 
                        outline: 'none',
                        transition: 'border-color var(--transition-fast)',
                        fontSize: '13px' 
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                      value={form.cardNum}
                      onChange={(e) => setForm({ ...form, cardNum: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expiration</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="MM/YY"
                        style={{ 
                          width: '100%', 
                          padding: '11px 14px', 
                          marginTop: '6px', 
                          border: '1px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-tertiary)', 
                          color: 'var(--text-primary)', 
                          borderRadius: 'var(--radius-sm)', 
                          outline: 'none',
                          transition: 'border-color var(--transition-fast)',
                          fontSize: '13px' 
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        value={form.cardExp}
                        onChange={(e) => setForm({ ...form, cardExp: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CVV</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="•••"
                        style={{ 
                          width: '100%', 
                          padding: '11px 14px', 
                          marginTop: '6px', 
                          border: '1px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-tertiary)', 
                          color: 'var(--text-primary)', 
                          borderRadius: 'var(--radius-sm)', 
                          outline: 'none',
                          transition: 'border-color var(--transition-fast)',
                          fontSize: '13px' 
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        value={form.cardCVV}
                        onChange={(e) => setForm({ ...form, cardCVV: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Discreet Checkboxes */}
                  {!isPOS && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <input 
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
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '14px', marginTop: '16px', letterSpacing: '0.05em' }}
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
