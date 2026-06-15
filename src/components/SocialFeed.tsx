import React, { useState } from 'react';
import { Heart, Coins, ShoppingCart, User, Award, ShieldAlert } from 'lucide-react';

interface SocialFeedProps {
  onLoadRecipe: (recipeParams: any) => void;
}

const INITIAL_MOCK_POSTS = [
  {
    id: 'post-1',
    creator: 'SatinSiren',
    designName: 'The Royal Wave',
    likes: 542,
    hasLiked: false,
    price: 135.00,
    parameters: {
      baseGeometry: 'wave',
      length: 6.8,
      shaftGirth: 1.4,
      baseGirth: 1.8,
      curvature: 0.8,
      texture: 'smooth',
      suctionCup: true,
      vibrationCore: true,
      colorMode: 1, // Marble
      color1: '#482060', // Royal Plum
      color2: '#d4af37', // Satin Gold
      isVibrating: false
    },
    commentsCount: 18
  },
  {
    id: 'post-2',
    creator: 'NeonVixen',
    designName: 'Electric G-Spot',
    likes: 821,
    hasLiked: false,
    price: 149.00,
    parameters: {
      baseGeometry: 'ergonomic',
      length: 7.2,
      shaftGirth: 1.6,
      baseGirth: 1.9,
      curvature: 1.2,
      texture: 'smooth',
      suctionCup: false,
      vibrationCore: true,
      colorMode: 2, // Gradient
      color1: '#d946ef', // Orchid Pink
      color2: '#a62b2b', // Crimson
      isVibrating: false
    },
    commentsCount: 42
  },
  {
    id: 'post-3',
    creator: 'VelvetLover',
    designName: 'Minimalist Slate',
    likes: 219,
    hasLiked: false,
    price: 109.00,
    parameters: {
      baseGeometry: 'classic',
      length: 5.5,
      shaftGirth: 1.1,
      baseGirth: 1.3,
      curvature: 0.0,
      texture: 'smooth',
      suctionCup: true,
      vibrationCore: false,
      colorMode: 0, // Solid
      color1: '#242426', // Midnight Slate
      color2: '#e2e8f0',
      isVibrating: false
    },
    commentsCount: 7
  }
];

export const SocialFeed: React.FC<SocialFeedProps> = ({ onLoadRecipe }) => {
  const [posts, setPosts] = useState(INITIAL_MOCK_POSTS);
  const [tipOpen, setTipOpen] = useState(false);
  const [activePost, setActivePost] = useState<typeof INITIAL_MOCK_POSTS[0] | null>(null);
  const [tipSuccess, setTipSuccess] = useState(false);

  const handleLike = (id: string) => {
    setPosts((prev) => 
      prev.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked
          };
        }
        return post;
      })
    );
  };

  const openTipModal = (post: typeof INITIAL_MOCK_POSTS[0]) => {
    setActivePost(post);
    setTipSuccess(false);
    setTipOpen(true);
  };

  const handleSendTip = (amount: number) => {
    // Simulate tipping payment
    setTipSuccess(true);
    setTimeout(() => {
      setTipOpen(false);
      alert(`Successfully tipped $${amount}.00 to @${activePost?.creator}! They will receive 100% of this royalty credit.`);
    }, 1500);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      
      {/* Social Title Banner */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Award size={12} /> Community Shared Designs
        </span>
        <h1 style={{ fontSize: '36px', marginTop: '12px', fontFamily: 'var(--font-serif)' }}>BAD Social Gallery</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Discover designs created by other members. Load their specs to modify them, purchase replicas, or tip the creator.
        </p>
      </div>

      {/* Safety Notice */}
      <div 
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-md)', 
          padding: '16px 20px', 
          fontSize: '12px', 
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}
      >
        <ShieldAlert size={20} color="var(--accent-gold)" />
        <div>
          <strong>Strict Privacy & Safety Guardrails Active:</strong> All creator profiles use pseudonyms. Shipping details, billing names, and real identities are strictly decoupled from social interactions to guarantee 100% user anonymity.
        </div>
      </div>

      {/* Grid Feed of custom posts */}
      <div className="grid-2">
        {posts.map((post) => (
          <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <User size={16} color="var(--accent-gold)" />
                </div>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>@{post.creator}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Creator Partner</span>
                </div>
              </div>
              <span className="badge" style={{ fontSize: '10px' }}>Shared Design</span>
            </div>

            {/* Simulated 3D Thumbnail Render */}
            <div 
              style={{ 
                height: '220px', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '8px',
                border: '1px solid var(--border-color)',
                position: 'relative',
                overflow: 'hidden',
                background: `radial-gradient(circle, ${post.parameters.color1}44 0%, var(--bg-tertiary) 100%)`
              }}
            >
              {/* Colored circles representing the palette used */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: post.parameters.color1, border: '1px solid white' }} />
                {post.parameters.colorMode > 0 && (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: post.parameters.color2, border: '1px solid white' }} />
                )}
              </div>
              <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                {post.designName}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Length: {post.parameters.length.toFixed(1)}" | Curve: {post.parameters.curvature > 0 ? "Curved" : "Straight"}
              </span>

              {/* Tag for features */}
              <div style={{ display: 'flex', gap: '6px', position: 'absolute', bottom: '12px', right: '12px' }}>
                {post.parameters.suctionCup && <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>Suction Cup</span>}
                {post.parameters.vibrationCore && <span style={{ fontSize: '9px', background: 'rgba(217, 70, 239, 0.1)', color: 'var(--accent-pink)', padding: '2px 6px', borderRadius: '4px' }}>Vibe</span>}
              </div>
            </div>

            {/* Description & Action details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <h4 style={{ fontSize: '16px' }}>Recipe Price: ${post.price.toFixed(2)}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Purchase rewards @{post.creator} with 10% royalty.
                </p>
              </div>
            </div>

            {/* Engagement buttons */}
            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
              {/* Like Button */}
              <button 
                className="btn btn-secondary" 
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  fontSize: '13px', 
                  color: post.hasLiked ? 'var(--accent-crimson)' : 'var(--text-secondary)',
                  borderColor: post.hasLiked ? 'var(--accent-crimson)' : 'var(--border-color)'
                }}
                onClick={() => handleLike(post.id)}
              >
                <Heart size={15} fill={post.hasLiked ? 'var(--accent-crimson)' : 'transparent'} /> {post.likes}
              </button>

              {/* Tip Creator Button */}
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                onClick={() => openTipModal(post)}
              >
                <Coins size={15} color="var(--accent-gold)" /> Tip Creator
              </button>

              {/* Load Recipe in Builder Button */}
              <button 
                className="btn btn-primary" 
                style={{ flex: 1.5, padding: '8px', fontSize: '13px' }}
                onClick={() => onLoadRecipe(post.parameters)}
              >
                <ShoppingCart size={15} /> Buy Recipe
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Tip Creator Modal */}
      {tipOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            left: 0, 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(6px)', 
            zIndex: 3000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-color)', 
              padding: '28px', 
              textAlign: 'center' 
            }}
          >
            <h3 style={{ fontSize: '20px', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Tip @{activePost?.creator}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Show support for their design templates. Tips are disbursed instantly as cash credit.
            </p>

            {!tipSuccess ? (
              <div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                  {[2, 5, 10].map((amt) => (
                    <button 
                      key={amt} 
                      className="btn btn-primary" 
                      style={{ padding: '12px 20px', fontSize: '16px', fontWeight: 600 }}
                      onClick={() => handleSendTip(amt)}
                    >
                      ${amt}.00
                    </button>
                  ))}
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                  onClick={() => setTipOpen(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <div className="spinner" style={{ width: '30px', height: '30px', border: '2px solid var(--border-color)', borderTopColor: 'var(--accent-gold)', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }} />
                <h4>Processing tip...</h4>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
