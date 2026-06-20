import React, { useEffect } from 'react';
import { ShoppingBag, EyeOff, Eye, Users, Hammer, Smartphone, TrendingUp } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  discretionMode: boolean;
  setDiscretionMode: (mode: boolean) => void;
  isPOS: boolean;
  setIsPOS: (isPOS: boolean) => void;
  demoMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  discretionMode,
  setDiscretionMode,
  isPOS,
  setIsPOS,
  demoMode
}) => {

  // Synchronize document title and body class for discretion mode and demo mode
  useEffect(() => {
    if (discretionMode) {
      document.body.classList.add('discretion-mode');
      document.body.classList.remove('demo-mode');
      document.title = "Healthy Living | Wellness & Organic Lifestyle Blog";
    } else {
      document.body.classList.remove('discretion-mode');
      if (demoMode) {
        document.body.classList.add('demo-mode');
        document.title = "BAD | Parametric Mold Studio";
      } else {
        document.body.classList.remove('demo-mode');
        document.title = isPOS ? "BAD Floor | POS Terminal" : "BAD | buildadil.do";
      }
    }
  }, [discretionMode, isPOS, demoMode]);

  const toggleDiscretion = () => {
    setDiscretionMode(!discretionMode);
  };

  return (
    <header className="glass-header">
      <div className="container header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        {/* Brand Logo */}
        <a 
          href="#" 
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            if (!discretionMode) setActiveTab('storefront');
          }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textDecoration: 'none'
          }}
        >
          {discretionMode ? (
            <span style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '20px', 
              fontWeight: 700, 
              letterSpacing: '0.05em',
              color: 'var(--accent-gold)'
            }}>
              HEALTHY LIVING
            </span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="logo-main">BAD</span>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-gold)', 
                  display: 'inline-block',
                  boxShadow: '0 0 8px var(--accent-gold)'
                }} />
              </div>
              <span className="logo-sub">{demoMode ? "mold-studio (demo)" : "buildadil.do"}</span>
            </div>
          )}
        </a>

        {/* Navigation Tabs (Hidden in Discretion Mode) */}
        {!discretionMode ? (
          <nav>
            <ul className="nav-links" style={{ display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center' }}>
              <li>
                <a 
                  href={demoMode ? "#demo" : "#storefront"} 
                  className={activeTab === 'storefront' ? 'active' : ''} 
                  onClick={() => setActiveTab('storefront')}
                >
                  Storefront
                </a>
              </li>
              <li>
                <a 
                  href={demoMode ? "#demo-builder" : "#builder"} 
                  className={activeTab === 'builder' ? 'active' : ''} 
                  onClick={() => setActiveTab('builder')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Hammer size={14} /> {demoMode ? "Mold Studio" : "BAD Builder"}
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href={demoMode ? "#demo-social" : "#social"} 
                  className={activeTab === 'social' ? 'active' : ''} 
                  onClick={() => setActiveTab('social')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} /> Social
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href={demoMode ? "#demo-admin" : "#admin"} 
                  className={activeTab === 'admin' ? 'active' : ''} 
                  onClick={() => setActiveTab('admin')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Hammer size={14} /> Admin
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href={demoMode ? "#demo-pitch" : "#pitch"} 
                  className={activeTab === 'pitch' ? 'active' : ''} 
                  onClick={() => setActiveTab('pitch')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={14} /> Pitch
                  </span>
                </a>
              </li>
              <li>
                <button 
                  className={`btn ${isPOS ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ 
                    padding: '6px 14px', 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                    fontWeight: 700 
                  }}
                  onClick={() => {
                    setIsPOS(!isPOS);
                    setActiveTab('storefront');
                  }}
                >
                  <Smartphone size={13} /> {isPOS ? "Exit POS Mode" : "POS Kiosk"}
                </button>
              </li>
            </ul>
          </nav>
        ) : (
          <nav>
            <ul className="nav-links" style={{ display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center' }}>
              <li><a href="#" className="active" onClick={(e) => e.preventDefault()}>Organic Recipes</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Diet Plans</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Fitness Advice</a></li>
            </ul>
          </nav>
        )}

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Brand Demo Toggle */}
          {!discretionMode && (
            <button 
              className="btn" 
              style={{ 
                backgroundColor: demoMode ? 'var(--accent-gold)' : 'rgba(255,255,255,0.03)', 
                color: demoMode ? '#000000' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 700,
                boxShadow: demoMode ? '0 4px 12px var(--accent-gold-glow)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
              onClick={() => {
                const newDemoMode = !demoMode;
                let newHash = '';
                if (newDemoMode) {
                  if (activeTab === 'builder') newHash = 'demo-builder';
                  else if (activeTab === 'social') newHash = 'demo-social';
                  else if (activeTab === 'admin') newHash = 'demo-admin';
                  else if (activeTab === 'pitch') newHash = 'demo-pitch';
                  else newHash = 'demo';
                } else {
                  newHash = activeTab;
                }
                window.location.hash = newHash;
              }}
            >
              {demoMode ? "Switch to Adult Brand" : "Demo: Multi-Purpose Molds"}
            </button>
          )}

          {/* Panic / Discretion Button */}
          <button 
            className="btn" 
            style={{ 
              backgroundColor: discretionMode ? '#e2e8f0' : 'rgba(255,255,255,0.03)', 
              color: discretionMode ? '#1e293b' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              padding: '8px 16px',
              fontSize: '11px',
              fontWeight: 700,
              transition: 'all var(--transition-fast)'
            }}
            onClick={toggleDiscretion}
            title="Toggle Panic / Discretion Mode"
          >
            {discretionMode ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} /> Revert Store
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <EyeOff size={14} /> Discreet Mode (Hide)
              </span>
            )}
          </button>

          {/* Cart Icon (Not displayed in discretion mode) */}
          {!discretionMode && (
            <button 
              className="btn btn-secondary" 
              style={{ 
                position: 'relative', 
                padding: '10px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                border: '1px solid var(--border-color)'
              }}
              onClick={() => setActiveTab('storefront')}
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
