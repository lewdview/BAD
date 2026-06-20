import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  Target, 
  Coins, 
  Sliders, 
  Calendar, 
  Award, 
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface SlideWrapperProps {
  index: number;
  currentSlide: number;
  textAlign?: 'center' | 'left';
  children: React.ReactNode;
}

const SlideWrapper: React.FC<SlideWrapperProps> = ({ 
  index, 
  currentSlide, 
  textAlign = 'left', 
  children 
}) => {
  return (
    <div 
      className={`card slide-print-page animate-fade-in ${currentSlide === index ? 'slide-screen-active' : 'slide-screen-hidden'}`}
      style={{
        flex: 1,
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '50px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        minHeight: '520px',
        textAlign: textAlign,
        boxSizing: 'border-box',
        transition: 'all var(--transition-normal)'
      }}
    >
      {children}
    </div>
  );
};

export const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 10;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div 
      className="pitch-deck-container animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 80px)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        padding: '30px 24px',
        boxSizing: 'border-box',
        justifyContent: 'space-between'
      }}
    >
      {/* Slide Content Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Slide 1: Title & Vision */}
        <SlideWrapper index={0} currentSlide={currentSlide} textAlign="center">
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
              <Sparkles size={12} /> B2B & B2C Parametric Manufacturing Platform
            </span>
            <h1 style={{ fontSize: '72px', margin: '0 0 8px 0', fontFamily: 'var(--font-serif)', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--text-primary)' }}>
              BAD
            </h1>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '24px', letterSpacing: '0.05em' }}>
              buildadil.do
            </h2>
            <p style={{ fontSize: '16.5px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 48px auto', lineHeight: 1.7 }}>
              The first fully-integrated parametric CAD customization engine, digital storefront, and automated split-mold manufacturing pipeline for medical-grade silicone pleasure products.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="badge" style={{ padding: '8px 18px', fontSize: '11px', fontWeight: 700 }}>WebGL Parametric Engine</span>
              <span className="badge" style={{ padding: '8px 18px', fontSize: '11px', fontWeight: 700 }}>Web-AR Simulator</span>
              <span className="badge" style={{ padding: '8px 18px', fontSize: '11px', fontWeight: 700 }}>CNC/3D Print Split-Molds</span>
              <span className="badge" style={{ padding: '8px 18px', fontSize: '11px', fontWeight: 700, borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}>87% Gross Margins</span>
            </div>
          </div>
        </SlideWrapper>

        {/* Slide 2: The Problem & The Solution */}
        <SlideWrapper index={1} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '30px', marginBottom: '32px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <Target size={26} color="var(--accent-gold)" /> The Problem & The Solution
          </h2>
          <div className="grid-2" style={{ gap: '32px' }}>
            <div style={{ padding: '28px', backgroundColor: 'rgba(200, 50, 50, 0.02)', border: '1px solid rgba(200, 50, 50, 0.12)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '17px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', fontWeight: 700 }}>
                <XCircle size={18} /> Traditional Tooling Bottlenecks
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '13.5px' }}>
                <li><strong>Steel Mold Tooling:</strong> Tooling up a single steel mold costs $20,000+ upfront.</li>
                <li><strong>Time-to-Market:</strong> Iterations and shipment from overseas tooling take 4 to 6 months.</li>
                <li><strong>Inventory Risk:</strong> Static retail catalog requires high volume commitments, resulting in overstock and capital lockups.</li>
              </ul>
            </div>

            <div style={{ padding: '28px', backgroundColor: 'rgba(34, 197, 94, 0.02)', border: '1px solid rgba(34, 197, 94, 0.12)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '17px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', fontWeight: 700 }}>
                <CheckCircle2 size={18} /> The BAD Parametric Pipeline
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '13.5px' }}>
                <li><strong>Instant Custom Molds:</strong> Split mold blocks are compiled in real-time, 3D printed for $1.20 in hours.</li>
                <li><strong>Time-to-Market:</strong> Time from browser customization to medical silicone pouring is under 24 hours.</li>
                <li><strong>Zero-Inventory Retail:</strong> Orders are manufactured on-demand in flagship stores or express hubs.</li>
              </ul>
            </div>
          </div>
        </SlideWrapper>

        {/* Slide 3: Early Traction & Product Demo Metrics */}
        <SlideWrapper index={2} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '30px', marginBottom: '32px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <TrendingUp size={26} color="var(--accent-gold)" /> Early Traction & Demo KPIs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>+38%</div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginTop: '8px', letterSpacing: '0.05em' }}>Conversion Uplift</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>Realized during user testing of the 3D Builder interface.</div>
            </div>
            <div className="card" style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>$142.50</div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginTop: '8px', letterSpacing: '0.05em' }}>Average Order Value</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>60% uplift over premade flagship baseline ($89.00).</div>
            </div>
            <div className="card" style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>42 Sec</div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginTop: '8px', letterSpacing: '0.05em' }}>Avg. Customizer Time</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>Low cognitive friction results in high funnel completion.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }}></span>
              <span><strong>🚀 Waiting List Count:</strong> 12,500+ organic consumer sign-ups.</span>
            </div>
            <div style={{ padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }}></span>
              <span><strong>✍️ Signed B2B Letters of Intent:</strong> 3 LOIs with LoveHoney, Adam & Eve, and Wellness SAS.</span>
            </div>
          </div>
        </SlideWrapper>

        {/* Slide 4: Interactive Systems & Data Architecture SVG Diagram */}
        <SlideWrapper index={3} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '30px', marginBottom: '20px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <Layers size={26} color="var(--accent-gold)" /> Systems & Data Architecture
          </h2>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 800 320" width="100%" height="100%" style={{ maxHeight: '270px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
              {/* Nodes */}
              {/* 1. Client App */}
              <rect x="25" y="105" width="130" height="70" rx="10" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
              <text x="90" y="136" fill="var(--text-primary)" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">Consumer Web /</text>
              <text x="90" y="156" fill="var(--text-primary)" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">POS Kiosk App</text>

              {/* Arrow 1 */}
              <line x1="155" y1="140" x2="195" y2="140" stroke="var(--accent-gold)" strokeWidth="2.5" markerEnd="url(#arrow)" />

              {/* 2. Core API */}
              <rect x="205" y="105" width="130" height="70" rx="10" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
              <text x="270" y="140" fill="var(--text-primary)" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">Core API Gateway</text>
              <text x="270" y="156" fill="var(--text-muted)" fontSize="9.5" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">Vite / Node.js Router</text>

              {/* Arrow 2 */}
              <line x1="335" y1="140" x2="375" y2="140" stroke="var(--accent-gold)" strokeWidth="2.5" />

              {/* 3. CAD engine */}
              <rect x="385" y="105" width="130" height="70" rx="10" fill="var(--bg-tertiary)" stroke="var(--accent-gold)" strokeWidth="2" />
              <text x="450" y="136" fill="var(--accent-gold)" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">stlGenerator</text>
              <text x="450" y="156" fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-sans)">Parametric CAD Compiler</text>

              {/* Arrow 3 */}
              <line x1="515" y1="140" x2="555" y2="140" stroke="var(--accent-gold)" strokeWidth="2.5" />

              {/* 4. Manufacturing Queue */}
              <rect x="565" y="105" width="130" height="70" rx="10" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
              <text x="630" y="136" fill="var(--text-primary)" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">Split-Mold Slicer &</text>
              <text x="630" y="156" fill="var(--text-primary)" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">3D Print Queue</text>

              {/* Arrow 4 */}
              <line x1="695" y1="140" x2="725" y2="140" stroke="var(--accent-gold)" strokeWidth="2.5" />

              {/* 5. Factory */}
              <rect x="735" y="105" width="45" height="70" rx="10" fill="rgba(34, 197, 94, 0.08)" stroke="#4ade80" strokeWidth="1.5" />
              <text x="7575" y="140" fill="#4ade80" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">Shop</text>
              <text x="757" y="156" fill="#4ade80" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">Floor</text>

              {/* Database below */}
              <rect x="205" y="240" width="130" height="40" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
              <text x="270" y="264" fill="var(--text-secondary)" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">PostgreSQL / Redis</text>
              <line x1="270" y1="175" x2="270" y2="240" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />

              {/* Arrow definitions */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-gold)" />
                </marker>
              </defs>
            </svg>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
            Watertight STL compiler translates mathematical vectors into physical split molds locally without server overhead.
          </p>
        </SlideWrapper>

        {/* Slide 5: Market Opportunity (TAM/SAM/SOM Concentric Circles) */}
        <SlideWrapper index={4} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '30px', marginBottom: '32px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <Target size={26} color="var(--accent-gold)" /> Market Opportunity (TAM)
          </h2>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
            
            {/* Left Circular concentric model */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '230px', height: '230px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.02)', border: '2px solid rgba(212, 175, 55, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}>
                <span style={{ position: 'absolute', top: '12px', fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>TAM: $42.8B</span>
                
                <div style={{ width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '2px solid rgba(212, 175, 55, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ position: 'absolute', top: '48px', fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>SAM: $8.5B</span>
                  
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000000', fontWeight: 800, boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SOM</span>
                    <span style={{ fontSize: '15px', fontWeight: 900 }}>$420M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right text legends */}
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>Total Addressable Market (TAM): $42.8 Billion</strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Global adult novelty & pleasure hardware market valuation expected by 2028.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>Serviceable Addressable Market (SAM): $8.5 Billion</strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>The premium digital e-commerce subset of customized and anatomically scanned novelty sectors.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>Serviceable Obtainable Market (SOM): $420 Million</strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Target Year-3 obtainable volume capturing 5% of digital customizable channels.</span>
              </div>
            </div>

          </div>
        </SlideWrapper>

        {/* Slide 6: Business Model Options & Unit Economics */}
        <SlideWrapper index={5} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '30px', marginBottom: '32px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <Coins size={26} color="var(--accent-gold)" /> Monetization & Unit Economics
          </h2>
          <div className="grid-2" style={{ gap: '40px', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px' }}>Multi-Channel Streams</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)', fontSize: '12.5px', lineHeight: 1.5 }}>
                  <strong>Direct-to-Consumer (D2C):</strong> Retail pricing from $129 to $249 per customized item.
                </div>
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)', fontSize: '12.5px', lineHeight: 1.5 }}>
                  <strong>B2B SaaS Licensing:</strong> $4,999/month for factory operators to run the automated STL mold compiler.
                </div>
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)', fontSize: '12.5px', lineHeight: 1.5 }}>
                  <strong>B2B Take-Rate:</strong> $2.50 licensing transaction fee per custom printed split-mold.
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px' }}>Unit Economics (Custom Toy)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 0', color: 'var(--text-secondary)' }}>Average Selling Price (AOV):</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700 }}>$142.50</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 0', color: 'var(--text-secondary)' }}>Medical Silicone + Pigment COGS:</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700 }}>$12.50</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 0', color: 'var(--text-secondary)' }}>3D Printed Mold Filament COGS:</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700 }}>$1.20</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 0', color: 'var(--text-secondary)' }}>Packaging & Shipping Boxes:</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700 }}>$4.80</td>
                  </tr>
                  <tr style={{ color: 'var(--accent-gold)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 700, fontSize: '14px' }}>Gross Profit Margin:</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 800, fontSize: '14.5px' }}>$124.00 (87%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SlideWrapper>

        {/* Slide 7: Competitor Matrix Comparison Table */}
        <SlideWrapper index={6} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '30px', marginBottom: '28px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <Sliders size={26} color="var(--accent-gold)" /> Competitive Landscape
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Features</th>
                  <th style={{ padding: '12px', color: 'var(--accent-gold)', fontWeight: 800 }}>BAD Platform</th>
                  <th style={{ padding: '12px' }}>Shopify Customizers</th>
                  <th style={{ padding: '12px' }}>Traditional Tooling</th>
                  <th style={{ padding: '12px' }}>Build-From-Scratch</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Setup Tooling Costs</td>
                  <td style={{ padding: '12px', color: '#4ade80', fontWeight: 700, backgroundColor: 'rgba(34, 197, 94, 0.03)' }}>$1.20 (FDM print)</td>
                  <td style={{ padding: '12px' }}>N/A (static assets)</td>
                  <td style={{ padding: '12px', color: '#f87171' }}>$20,000+ (Steel molds)</td>
                  <td style={{ padding: '12px' }}>$150k+ (development)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Time-to-Manufacture</td>
                  <td style={{ padding: '12px', color: '#4ade80', fontWeight: 700, backgroundColor: 'rgba(34, 197, 94, 0.03)' }}>&lt; 24 Hours</td>
                  <td style={{ padding: '12px' }}>Static stock only</td>
                  <td style={{ padding: '12px', color: '#f87171' }}>4-6 Months</td>
                  <td style={{ padding: '12px' }}>9-12 Months (build)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>CAD File Output</td>
                  <td style={{ padding: '12px', color: '#4ade80', fontWeight: 700, backgroundColor: 'rgba(34, 197, 94, 0.03)' }}>Instant 2-Part STL</td>
                  <td style={{ padding: '12px', color: '#f87171' }}>None (mock image only)</td>
                  <td style={{ padding: '12px' }}>Manual solidworks</td>
                  <td style={{ padding: '12px' }}>Variable (high complexity)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Volumetric Silicone HUD</td>
                  <td style={{ padding: '12px', color: '#4ade80', fontWeight: 700, backgroundColor: 'rgba(34, 197, 94, 0.03)' }}>Yes (Auto-Calculated)</td>
                  <td style={{ padding: '12px', color: '#f87171' }}>No</td>
                  <td style={{ padding: '12px', color: '#f87171' }}>No</td>
                  <td style={{ padding: '12px', color: '#f87171' }}>No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SlideWrapper>

        {/* Slide 8: Go-to-Market Milestone Timeline */}
        <SlideWrapper index={7} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '30px', marginBottom: '32px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <Calendar size={26} color="var(--accent-gold)" /> Go-To-Market Roadmap
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', position: 'relative' }}>
            
            <div className="card" style={{ padding: '20px', borderTop: '4px solid var(--accent-gold)', backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.05em' }}>Q1: FOUNDATION</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
                Finalize browser CAD compiler. Integrate local hardware SDKs for POS store deployment in NY flagship.
              </p>
            </div>

            <div className="card" style={{ padding: '20px', borderTop: '4px solid var(--accent-gold)', backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.05em' }}>Q2: INTEGRATION</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
                Deploy private APIs with LoveHoney and Adam & Eve. Scale split-mold factory production queue tests.
              </p>
            </div>

            <div className="card" style={{ padding: '20px', borderTop: '4px solid var(--accent-gold)', backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.05em' }}>Q3: BETA LAUNCH</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
                Invite waitlist members to Web Builder. Deploy phone mold-impression scans (BAD Fit) for direct-to-home orders.
              </p>
            </div>

            <div className="card" style={{ padding: '20px', borderTop: '4px solid var(--accent-gold)', backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.05em' }}>Q4: SCALE UP</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
                Add B2B SaaS dashboard licensing. Launch creator network tipping/royalties structure.
              </p>
            </div>

          </div>
        </SlideWrapper>

        {/* Slide 9: Executive Team Bios & Advisors */}
        <SlideWrapper index={8} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '30px', marginBottom: '28px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <Users size={26} color="var(--accent-gold)" /> Executive Team & Advisors
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
            
            {/* Executive founders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', borderLeft: '3px solid var(--accent-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>Arthur Vance — Co-Founder & CEO</strong>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>LELO PRODUCT</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
                  Former VP Product at <strong>LELO</strong>. 12+ years track record scaling luxury adult novelty hardware lines.
                </div>
              </div>
              
              <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', borderLeft: '3px solid var(--accent-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>Dr. Elena Rostova — Co-Founder & CTO</strong>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>MIT GEOMETRY</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
                  PhD in Computational Geometry from <strong>MIT</strong>. Expert in parametric mesh cleanups & openCASCADE Kernels.
                </div>
              </div>
            </div>

            {/* Advisors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                  <Award size={14} color="var(--accent-gold)" /> Marcus Thorne — B2B Retail Advisor
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                  Former CEO of <strong>Adam & Eve</strong>. 20+ years of sector credibility and supply chain connections.
                </div>
              </div>
              
              <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                  <Award size={14} color="var(--accent-gold)" /> Dr. Sarah Jenkins — Bio-Safety Advisor
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                  Professor of Gynecology at <strong>Stanford</strong>. Oversees medical certification and FDA material audits.
                </div>
              </div>
            </div>

          </div>
        </SlideWrapper>

        {/* Slide 10: The Ask & Funding Allocation Chart */}
        <SlideWrapper index={9} currentSlide={currentSlide} textAlign="center">
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
            <ShieldAlert size={12} fill="var(--accent-gold)" stroke="var(--bg-secondary)" /> Strategic Seed Ask
          </span>
          <h2 style={{ fontSize: '38px', marginBottom: '12px', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>Seeking $2,500,000 Seed Round</h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
            To scale automated CNC routing pipelines, patent custom stlGenerator APIs, and expand D2C flagship POS kiosks.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1, minWidth: '150px', boxShadow: 'var(--shadow-sm)' }}>
              <strong style={{ fontSize: '20px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>50%</strong>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Shop Floor Automation</span>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1, minWidth: '150px', boxShadow: 'var(--shadow-sm)' }}>
              <strong style={{ fontSize: '20px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>30%</strong>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>API & Platform Dev</span>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1, minWidth: '150px', boxShadow: 'var(--shadow-sm)' }}>
              <strong style={{ fontSize: '20px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>20%</strong>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Marketing & GTM</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', fontSize: '11px', marginTop: '40px', fontWeight: 600 }}>
            <span>Equity Round | Flexible Licensing Terms</span>
          </div>
        </SlideWrapper>

      </div>

      {/* Slide Controls & Progress Bar */}
      <div 
        className="no-print"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '1000px',
          width: '100%',
          margin: '24px auto 0 auto'
        }}
      >
        {/* Progress Bar */}
        <div 
          className="progress-bar-container"
          style={{
            height: '4px',
            width: '100%',
            backgroundColor: 'var(--border-color)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              backgroundColor: 'var(--accent-gold)',
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>

        {/* Buttons Panel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="pitch-controls-panel">
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '10px 20px', fontWeight: 700 }}
            >
              <ArrowLeft size={14} /> Previous Slide
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '10px 20px', borderColor: 'var(--accent-gold)', fontWeight: 700 }}
            >
              <TrendingUp size={14} color="var(--accent-gold)" /> Export PDF
            </button>
          </div>

          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.08em' }}>
            SLIDE {currentSlide + 1} OF {totalSlides}
          </span>

          <button 
            className="btn btn-primary"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '10px 20px', fontWeight: 700 }}
          >
            Next Slide <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};
