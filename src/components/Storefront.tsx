import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

import type { CartItem, OrderItem, Product } from '../types';
import { PREMADE_PRODUCTS, DEMO_PREMADE_PRODUCTS } from '../data/products';
import { ProductGrid } from './storefront/ProductGrid';
import { CartDrawer } from './storefront/CartDrawer';
import { CheckoutForm } from './storefront/CheckoutForm';

interface StorefrontProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onLaunchBuilder: () => void;
  isPOS: boolean;
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  demoMode: boolean;
}

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

export const Storefront: React.FC<StorefrontProps> = ({
  cart,
  setCart,
  onLaunchBuilder,
  isPOS,
  setOrders,
  demoMode
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [hook, setHook] = useState<'consumer' | 'retailer' | 'medical' | 'creator'>('consumer');

  const currentHooksContent = demoMode ? demoHooksContent : hooksContent;
  const productsList = demoMode ? DEMO_PREMADE_PRODUCTS : PREMADE_PRODUCTS;

  const addToCart = (product: Product) => {
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

  const subtotal = calculateSubtotal();

  const handleOrderSubmitted = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      
      {/* Target Audience Selector (Capsule tabs) */}
      <div className="capsule-tabs" style={{ margin: '0 auto 40px auto' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', padding: '0 16px', letterSpacing: '0.05em' }}>
          Persona:
        </span>
        {(['consumer', 'retailer', 'medical', 'creator'] as const).map((h) => (
          <button
            key={h}
            onClick={() => setHook(h)}
            className={`capsule-tab ${hook === h ? 'active' : ''}`}
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
          background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(212, 175, 55, 0.04) 100%)',
          borderLeft: '4px solid var(--accent-gold)',
          padding: '70px 48px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          marginBottom: '40px'
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
            <Sparkles size={12} /> {currentHooksContent[hook].tagline}
          </span>
          <h1 className="text-gradient-gold" style={{ fontSize: '46px', margin: '16px 0', fontFamily: 'var(--font-serif)', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {currentHooksContent[hook].title}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.65 }}>
            {currentHooksContent[hook].description}
          </p>
          <button 
            className="btn btn-primary" 
            style={{ padding: '14px 36px', fontSize: '13px' }}
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
            <div key={idx} className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
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

      {/* Product Catalog Grid */}
      <ProductGrid 
        productsList={productsList}
        onAddToCart={addToCart}
        demoMode={demoMode}
        isPOS={isPOS}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        isPOS={isPOS}
        subtotal={subtotal}
      />

      {/* Checkout Form Modal */}
      <CheckoutForm 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        subtotal={subtotal}
        isPOS={isPOS}
        demoMode={demoMode}
        onSubmitOrder={handleOrderSubmitted}
      />

    </div>
  );
};
