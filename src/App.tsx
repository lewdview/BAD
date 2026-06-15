import { useState } from 'react';
import { Header } from './components/Header';
import { ThreeCanvas } from './components/ThreeCanvas';
import { BuilderControls } from './components/BuilderControls';
import { Storefront } from './components/Storefront';
import { SocialFeed } from './components/SocialFeed';
import { Smartphone, Leaf } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  isCustom?: boolean;
  parameters?: any;
  quantity: number;
}

interface BuilderParams {
  baseGeometry: string;
  length: number;
  shaftGirth: number;
  baseGirth: number;
  curvature: number;
  texture: string;
  suctionCup: boolean;
  vibrationCore: boolean;
  colorMode: number; // 0 = Solid, 1 = Marble, 2 = Gradient, 3 = Split Pour
  color1: string;
  color2: string;
  isVibrating: boolean;
  showScaleRef: boolean;
  shapeType: string; // 'classic' | 'realistic' | 'fantasy' | 'targeted'
  realisticVeins: number; // 0.0 to 1.0
  realisticGlans: boolean;
  hasBalls: boolean;
  fantasyType: string; // 'dragon' | 'alien' | 'tentacle'
  baseType: string; // 'flared' | 'flat' | 'harness'
  taper: number; // 0.0 to 1.0
  firmness: string; // 'soft' | 'medium' | 'firm' | 'dual-density'
  inclusions: string; // 'none' | 'glitter' | 'metallic' | 'glow'
  thermochromic: boolean;
  internalTube: boolean;
  blacklightMode: boolean;
  arMode: boolean;
  sceneEnvironment: string; // 'studio' | 'shower' | 'case'
}

function App() {
  const [activeTab, setActiveTab] = useState<string>('storefront');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discretionMode, setDiscretionMode] = useState<boolean>(false);
  const [isPOS, setIsPOS] = useState<boolean>(false);

  // 3D Builder Parametric parameters
  const [builderParams, setBuilderParams] = useState<BuilderParams>({
    baseGeometry: 'classic',
    length: 6.0,
    shaftGirth: 1.20,
    baseGirth: 1.40,
    curvature: 0.2,
    texture: 'smooth',
    suctionCup: true,
    vibrationCore: false,
    colorMode: 1, // Default to Marble
    color1: '#a62b2b', // Crimson Kiss
    color2: '#d4af37', // Satin Gold
    isVibrating: false,
    showScaleRef: false,
    shapeType: 'classic',
    realisticVeins: 0.0,
    realisticGlans: false,
    hasBalls: false,
    fantasyType: 'dragon',
    baseType: 'flared',
    taper: 0.0,
    firmness: 'medium',
    inclusions: 'none',
    thermochromic: false,
    internalTube: false,
    blacklightMode: false,
    arMode: false,
    sceneEnvironment: 'studio'
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (customToy: any) => {
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
  };

  const handleShareToSocial = (customToy: any) => {
    alert(`"${customToy.name}" has been shared to the BAD Social Feed gallery successfully!`);
    setActiveTab('social');
  };

  const handleLoadRecipe = (recipeParams: BuilderParams) => {
    setBuilderParams(recipeParams);
    setActiveTab('builder');
  };

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
              />
            )}

            {activeTab === 'builder' && (
              <div className="builder-layout animate-fade-in">
                {/* 3D WebGL Canvas Rendering */}
                <ThreeCanvas params={builderParams} />
                
                {/* Parameter Control Panel Sidebar */}
                <BuilderControls 
                  params={builderParams} 
                  setParams={setBuilderParams}
                  onAddToCart={handleAddToCart}
                  onShareToSocial={handleShareToSocial}
                />
              </div>
            )}

            {activeTab === 'social' && (
              <SocialFeed onLoadRecipe={handleLoadRecipe} />
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
            <span>© {new Date().getFullYear()} BAD Wellness LLC. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Discreet Billing Policy</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
