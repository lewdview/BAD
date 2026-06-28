import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ThreeCanvas } from './components/ThreeCanvas';
import { BuilderControls } from './components/BuilderControls';
import { Storefront } from './components/Storefront';
import { SocialFeed } from './components/SocialFeed';
import { AdminDashboard } from './components/AdminDashboard';
import { PitchDeck } from './components/PitchDeck';
import { AcquisitionPortal } from './components/AcquisitionPortal';
import { Smartphone, Leaf } from 'lucide-react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

import type { ActiveTab, BuilderParams, CartItem, OrderItem } from './types';
import { SAMPLE_ORDERS } from './data/sampleOrders';


function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('storefront');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discretionMode, setDiscretionMode] = useState<boolean>(false);
  const [isPOS, setIsPOS] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Synchronize hash routing and brand demoMode
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.substring(1);
      if (hash.startsWith('demo')) {
        setDemoMode(true);
        if (hash === 'demo-builder') setActiveTab('builder');
        else if (hash === 'demo-social') setActiveTab('social');
        else if (hash === 'demo-admin') setActiveTab('admin');
        else if (hash === 'demo-pitch') setActiveTab('pitch');
        else if (hash === 'demo-acquisition') setActiveTab('acquisition');
        else setActiveTab('storefront');
      } else {
        setDemoMode(false);
        const validTabs: ActiveTab[] = ['storefront', 'builder', 'social', 'admin', 'pitch', 'acquisition'];
        if (validTabs.includes(hash as ActiveTab)) {
          setActiveTab(hash as ActiveTab);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Pre-populated B2B high-volume corporate manufacturing orders
  const [orders, setOrders] = useState<OrderItem[]>(SAMPLE_ORDERS);

  // 3D Builder Parametric parameters
  const [builderParams, setBuilderParams] = useState<BuilderParams>({
    baseGeometry: 'classic',
    length: 7.5,
    shaftGirth: 1.35,
    baseGirth: 1.60,
    curvature: 0.3,
    texture: 'swirled',
    suctionCup: true,
    vibrationCore: false,
    colorMode: 2, // Gradient
    color1: '#ff007f', // Hot Pink
    color2: '#00e5ff', // Cyan
    isVibrating: false,
    showScaleRef: false,
    shapeType: 'fantasy',
    headType: 'dragon',
    headScale: 1.1,
    realisticVeins: 0.0,
    hasBalls: true,
    fantasyType: 'dragon',
    baseType: 'flared',
    taper: 0.1,
    firmness: 'dual-density',
    inclusions: 'glitter',
    thermochromic: true,
    internalTube: false,
    blacklightMode: true,
    arMode: false,
    sceneEnvironment: 'studio',
    engraveText: '',
    engraveStyle: 'none',
    engravePosition: 0.5,
    engraveSize: 44,
    engraveDepth: 0.5,
    ballSize: 1.2,
    ballAsymmetry: 0.1,
    hasOrifice: false,
    orificeType: 'vaginal',
    orificeDepth: 0.4
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = useCallback((customToy: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === customToy.id);
      if (existing) {
        return prev.map((item) => 
          item.id === customToy.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...customToy, quantity: 1 }];
    });
    alert(`${customToy.name} added to cart! Open cart in Storefront to checkout.`);
    setActiveTab('storefront'); // Navigate to storefront to view cart
  }, []);

  const handleShareToSocial = useCallback((customToy: { name: string; price: number; parameters: BuilderParams }) => {
    alert(`"${customToy.name}" has been shared to the BAD Social Feed gallery successfully!`);
    setActiveTab('social');
  }, []);

  const handleLoadRecipe = useCallback((recipeParams: BuilderParams) => {
    setBuilderParams(recipeParams);
    setActiveTab('builder');
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Dynamic POS Banner */}
      {isPOS && !discretionMode && (
        <div 
          style={{ 
            backgroundColor: '#1e3a8a', 
            color: '#93c5fd', 
            fontSize: '11px', 
            fontWeight: 700, 
            padding: '6px 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            letterSpacing: '0.05em' 
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Smartphone size={12} /> IN-STORE SALES FLOOR APP (REGISTER #01)
          </span>
          <span>MOCK PRINTER & STRIPE TERMINAL ONLINE</span>
        </div>
      )}

      {/* Global Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cartCount}
        discretionMode={discretionMode}
        setDiscretionMode={setDiscretionMode}
        isPOS={isPOS}
        setIsPOS={setIsPOS}
        demoMode={demoMode}
      />

      {/* Main Page Layout */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Render Health & Wellness Blog if Discretion Mode is active */}
        {discretionMode ? (
          <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#166534', borderColor: '#166534' }}>
                <Leaf size={12} /> Healthy Eating & Wellness
              </span>
              <h1 style={{ fontSize: '42px', marginTop: '12px' }}>Your Daily Dose of Organic Vitality</h1>
              <p>Explore articles compiled by our fitness and nutritional experts.</p>
            </div>

            <div className="grid-2">
              <div className="card">
                <span className="badge" style={{ marginBottom: '10px', display: 'inline-block' }}>Nutrition</span>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>10 Organic Smoothie Recipes to Boost Immunity</h3>
                <p style={{ fontSize: '13px' }}>
                  Fuel your body with rich antioxidants, plant-based proteins, and vital leafy nutrients. Learn how micro-greens support cell health and recovery.
                </p>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ display: 'inline-block', marginTop: '16px', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '13px' }}>Read Article →</a>
              </div>

              <div className="card">
                <span className="badge" style={{ marginBottom: '10px', display: 'inline-block' }}>Mindfulness</span>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>A Beginner's Guide to Daily Zen Meditation</h3>
                <p style={{ fontSize: '13px' }}>
                  Discover simple breath control cycles to lower cortisol, decrease cognitive fatigue, and improve focus in high-pressure work settings.
                </p>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ display: 'inline-block', marginTop: '16px', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '13px' }}>Read Article →</a>
              </div>
            </div>
          </div>
        ) : (
          /* Normal E-Commerce Store Tabs */
          <>
            {activeTab === 'storefront' && (
              <Storefront 
                cart={cart} 
                setCart={setCart} 
                onLaunchBuilder={() => setActiveTab('builder')}
                isPOS={isPOS}
                orders={orders}
                setOrders={setOrders}
                demoMode={demoMode}
              />
            )}

            {activeTab === 'builder' && (
              <div className="builder-layout animate-fade-in">
                {/* 3D WebGL Canvas Rendering */}
                <ErrorBoundary fallback={
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', minHeight: '400px', color: 'var(--text-muted)' }}>
                    <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>WebGL Canvas Crashed</h3>
                    <p style={{ fontSize: '12px', marginBottom: '16px' }}>Your browser's graphics context was lost or crashed.</p>
                    <button className="btn btn-secondary" onClick={() => window.location.reload()}>Reload Page</button>
                  </div>
                }>
                  <ThreeCanvas params={builderParams} demoMode={demoMode} />
                </ErrorBoundary>
                
                {/* Parameter Control Panel Sidebar */}
                <BuilderControls 
                  params={builderParams} 
                  setParams={setBuilderParams}
                  onAddToCart={handleAddToCart}
                  onShareToSocial={handleShareToSocial}
                  demoMode={demoMode}
                />
              </div>
            )}

            {activeTab === 'social' && (
              <SocialFeed onLoadRecipe={handleLoadRecipe} />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard 
                orders={orders}
                setOrders={setOrders}
              />
            )}

            {activeTab === 'pitch' && (
              <PitchDeck />
            )}

            {activeTab === 'acquisition' && (
              <AcquisitionPortal />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      {!discretionMode && (
        <footer 
          style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            borderTop: '1px solid var(--border-color)', 
            padding: '24px 0', 
            fontSize: '12px', 
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}
        >
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <span>© {new Date().getFullYear()} {demoMode ? "BAD Parametric Mold Studio" : "BAD Wellness LLC"}. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              {demoMode ? (
                <>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Licensing Terms</a>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>CAD API Documentation</a>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Industrial Materials</a>
                </>
              ) : (
                <>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Discreet Billing Policy</a>
                </>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
