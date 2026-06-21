import React, { useState } from 'react';
import { Heart, Coins, ShoppingCart, User, Award, ShieldAlert } from 'lucide-react';

import type { BuilderParams, SocialPost } from '../types';
import { INITIAL_MOCK_POSTS } from '../data/socialPosts';
import { ModalOverlay } from './ui/ModalOverlay';

interface SocialFeedProps {
  onLoadRecipe: (recipeParams: BuilderParams) => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ onLoadRecipe }) => {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_MOCK_POSTS);
  const [tipOpen, setTipOpen] = useState(false);
  const [activePost, setActivePost] = useState<SocialPost | null>(null);
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
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(212, 175, 55, 0.25)'
                  }}
                >
                  <User size={16} color="var(--accent-gold)" />
                </div>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>@{post.creator}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Creator Partner</span>
                </div>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '9px', padding: '4px 8px' }}>Shared Design</span>
            </div>

            {/* Simulated 3D Thumbnail Render with custom color reflection */}
            <div 
              style={{ 
                height: '240px', 
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
                transition: 'border-color var(--transition-normal)'
              }}
            >
              {/* Blurred color reflection backdrop */}
              <div 
                style={{
                  position: 'absolute',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: post.parameters.colorMode > 0
                    ? `linear-gradient(135deg, ${post.parameters.color1}, ${post.parameters.color2})`
                    : post.parameters.color1,
                  filter: 'blur(40px)',
                  opacity: 0.3,
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              />
              
              {/* Content overlay */}
              <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {/* Colored circles representing the palette used */}
                <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: post.parameters.color1, border: '1px solid rgba(255,255,255,0.2)' }} />
                  {post.parameters.colorMode > 0 && (
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: post.parameters.color2, border: '1px solid rgba(255,255,255,0.2)' }} />
                  )}
                </div>
                
                <span style={{ fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {post.designName}
                </span>
                
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                  {post.parameters.length.toFixed(1)}" • {post.parameters.baseGeometry.toUpperCase()} • Curve: {Math.abs(post.parameters.curvature * 15).toFixed(0)}°
                </span>
              </div>

              {/* Tag for features */}
              <div style={{ display: 'flex', gap: '6px', position: 'absolute', bottom: '12px', right: '12px', zIndex: 1 }}>
                {post.parameters.suctionCup && (
                  <span style={{ fontSize: '9px', background: 'var(--bg-glass)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                    Suction Cup
                  </span>
                )}
                {post.parameters.vibrationCore && (
                  <span style={{ fontSize: '9px', background: 'rgba(224, 76, 224, 0.15)', color: 'var(--accent-pink)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(224, 76, 224, 0.25)', fontWeight: 600 }}>
                    Vibe Core
                  </span>
                )}
              </div>
              
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  zIndex: 1, 
                  backgroundColor: 'rgba(0,0,0,0.4)', 
                  backdropFilter: 'blur(4px)', 
                  fontSize: '9px', 
                  fontWeight: 700, 
                  color: 'var(--accent-gold)', 
                  padding: '3px 8px', 
                  borderRadius: '4px', 
                  border: '1px solid var(--border-color)',
                  letterSpacing: '0.05em' 
                }}
              >
                {post.parameters.colorMode === 0 ? 'SOLID SILICONE' : post.parameters.colorMode === 1 ? 'MARBLE SPLIT' : 'GRADIENT BLEND'}
              </div>
            </div>

            {/* Description & Action details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>Recipe Blueprint Price: ${post.price.toFixed(2)}</h4>
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
                  fontSize: '12px', 
                  color: post.hasLiked ? 'var(--accent-crimson)' : 'var(--text-secondary)',
                  borderColor: post.hasLiked ? 'var(--accent-crimson)' : 'var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={() => handleLike(post.id)}
              >
                <Heart size={14} fill={post.hasLiked ? 'var(--accent-crimson)' : 'transparent'} /> {post.likes}
              </button>

              {/* Tip Creator Button */}
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => openTipModal(post)}
              >
                <Coins size={14} color="var(--accent-gold)" /> Tip Creator
              </button>

              {/* Load Recipe in Builder Button */}
              <button 
                className="btn btn-primary" 
                style={{ flex: 1.5, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => onLoadRecipe(post.parameters)}
              >
                <ShoppingCart size={14} /> Buy Recipe
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Tip Creator Modal */}
      {tipOpen && (
        <ModalOverlay onClose={() => setTipOpen(false)} zIndex={3000} blur={16}>
          <div 
            className="card animate-fade-in"
            style={{ 
              width: '100%', 
              maxWidth: '420px', 
              backgroundColor: 'var(--bg-glass)', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid rgba(212, 175, 55, 0.2)', 
              padding: '32px', 
              textAlign: 'center',
              boxShadow: 'var(--shadow-glow), var(--shadow-lg)'
            }}
          >
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(212, 175, 55, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px auto',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <Coins size={22} color="var(--accent-gold)" />
            </div>

            <h3 style={{ fontSize: '24px', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Tip Creator</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Support <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>@{activePost?.creator}</span> and their custom designs. 100% of tips are disbursed directly.
            </p>

            {!tipSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {[2, 5, 10, 20].map((amt) => (
                    <button 
                      key={amt} 
                      className="btn btn-secondary" 
                      style={{ 
                        flex: 1,
                        padding: '12px 0', 
                        fontSize: '15px', 
                        fontWeight: 700,
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        color: 'var(--accent-gold)'
                      }}
                      onClick={() => handleSendTip(amt)}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                
                <div style={{ position: 'relative', marginTop: '8px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>$</span>
                  <input 
                    type="number" 
                    placeholder="Custom amount" 
                    min="1"
                    aria-label="Custom tip amount"
                    style={{ 
                      width: '100%', 
                      padding: '12px 12px 12px 28px', 
                      backgroundColor: 'var(--bg-tertiary)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color var(--transition-fast)'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = Number((e.target as HTMLInputElement).value);
                        if (val > 0) handleSendTip(val);
                      }
                    }}
                  />
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '8px' }}
                  onClick={() => setTipOpen(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ padding: '24px 0' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '3px solid rgba(212, 175, 55, 0.1)', 
                  borderTopColor: 'var(--accent-gold)', 
                  borderRadius: '50%', 
                  margin: '0 auto 16px auto', 
                  animation: 'spin 1s linear infinite' 
                }} />
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '16px', fontWeight: 600 }}>Authorizing micro-royalty...</h4>
              </div>
            )}
          </div>
        </ModalOverlay>
      )}

    </div>
  );
};
