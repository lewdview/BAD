import React, { useEffect } from 'react';
import { ShoppingBag, EyeOff, Eye, Users, Hammer, Smartphone } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  discretionMode: boolean;
  setDiscretionMode: (mode: boolean) => void;
  isPOS: boolean;
  setIsPOS: (isPOS: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  discretionMode,
  setDiscretionMode,
  isPOS,
  setIsPOS
}) => {

  // Synchronize document title and body class for discretion mode
  useEffect(() => {
    if (discretionMode) {
      document.body.classList.add('discretion-mode');
      document.title = "Healthy Living | Wellness & Organic Lifestyle Blog";
    } else {
      document.body.classList.remove('discretion-mode');
      document.title = isPOS ? "BAD Floor | POS Terminal" : "BAD | buildadil.do";
    }
  }, [discretionMode, isPOS]);

  const toggleDiscretion = () => {
    setDiscretionMode(!discretionMode);
  };

  return (
    <header className="glass-header">
      <div className="container header-container">
        {/* Brand Logo */}
        <a 
          href="#" 
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            if (!discretionMode) setActiveTab('storefront');
          }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: discretionMode ? 'center' : 'flex-start' }}
        >
          {discretionMode ? (
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, letterSpacing: '0.05em' }}>
              HEALTHY LIVING
            </span>
          ) : (
            <>
              <span className="logo-main">BAD</span>
              <span className="logo-sub">buildadil.do</span>
            </>
          )}
        </a>

        {/* Navigation Tabs (Hidden in Discretion Mode, except standard wellness link placeholders) */}
        {!discretionMode ? (
          <nav>
            <ul className="nav-links">
              <li>
                <a 
                  href="#storefront" 
                  className={activeTab === 'storefront' ? 'active' : ''} 
                  onClick={() => setActiveTab('storefront')}
                >
                  Storefront
                </a>
              </li>
              <li>
                <a 
                  href="#builder" 
                  className={activeTab === 'builder' ? 'active' : ''} 
                  onClick={() => setActiveTab('builder')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Hammer size={14} /> BAD Builder
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="#social" 
                  className={activeTab === 'social' ? 'active' : ''} 
                  onClick={() => setActiveTab('social')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> Social
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="#admin" 
                  className={activeTab === 'admin' ? 'active' : ''} 
                  onClick={() => setActiveTab('admin')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Hammer size={14} /> Admin
                  </span>
                </a>
              </li>
              <li>
                <button 
                  className={`btn ${isPOS ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => {
                    setIsPOS(!isPOS);
                    setActiveTab('storefront'); // Return to shop index in POS view
                  }}
                >
                  <Smartphone size={13} /> {isPOS ? "Exit POS Mode" : "POS Kiosk"}
                </button>
              </li>
            </ul>
          </nav>
        ) : (
          <nav>
            <ul className="nav-links">
              <li><a href="#" className="active" onClick={(e) => e.preventDefault()}>Organic Recipes</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Diet Plans</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Fitness Advice</a></li>
            </ul>
          </nav>
        )}

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Panic / Discretion Button */}
          <button 
            className="btn" 
            style={{ 
              backgroundColor: discretionMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)', 
              color: discretionMode ? '#1e293b' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              padding: '8px 14px',
              fontSize: '12px'
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
                justifyContent: 'center' 
              }}
              onClick={() => setActiveTab('storefront')} // Open storefront and trigger cart view
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
