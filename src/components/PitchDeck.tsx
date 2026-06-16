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
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        boxShadow: 'var(--shadow-lg)',
        minHeight: '480px',
        textAlign: textAlign,
        boxSizing: 'border-box'
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
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
            <Sparkles size={12} /> B2B & B2C Novelty Manufacturing Platform
          </span>
          <h1 style={{ fontSize: '64px', margin: '0 0 16px 0', fontFamily: 'var(--font-serif)', letterSpacing: '0.05em' }}>BAD</h1>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: '16px' }}>buildadil.do</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
            The first fully-integrated parametric CAD customization engine, digital storefront, and automated split-mold manufacturing pipeline for medical-grade silicone pleasure products.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ padding: '8px 16px', fontSize: '12px' }}>WebGL Parametric Engine</span>
            <span className="badge" style={{ padding: '8px 16px', fontSize: '12px' }}>Web-AR Simulator</span>
            <span className="badge" style={{ padding: '8px 16px', fontSize: '12px' }}>CNC/3D Print Split-Molds</span>
            <span className="badge" style={{ padding: '8px 16px', fontSize: '12px' }}>87% Gross Margins</span>
          </div>
        </SlideWrapper>

        {/* Slide 2: The Problem & The Solution */}
        <SlideWrapper index={1} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={24} color="var(--accent-gold)" /> The Problem & The Solution
          </h2>
          <div className="grid-2" style={{ gap: '40px' }}>
            <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--accent-crimson)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <XCircle size={18} /> Traditional Tooling Bottlenecks
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li><strong>Steel Mold Tooling:</strong> Tooling up a single steel mold costs $20,000+ upfront.</li>
                <li><strong>Time-to-Market:</strong> Iterations and shipment from overseas tooling take 4 to 6 months.</li>
                <li><strong>Inventory Risk:</strong> Static retail catalog requires high volume commitments, resulting in overstock and capital lockups.</li>
              </ul>
            </div>

            <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <CheckCircle2 size={18} /> The BAD Parametric Pipeline
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li><strong>Instant Custom Molds:</strong> Split mold blocks are compiled in real-time, 3D printed for $1.20 in hours.</li>
                <li><strong>Time-to-Market:</strong> Time from browser customization to medical silicone pouring is under 24 hours.</li>
                <li><strong>Zero-Inventory Retail:</strong> Orders are manufactured on-demand in flagship stores or express hubs.</li>
              </ul>
            </div>
          </div>
        </SlideWrapper>

        {/* Slide 3: Early Traction & Product Demo Metrics */}
        <SlideWrapper index={2} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={24} color="var(--accent-gold)" /> Early Traction & Demo KPIs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>+38%</div>
              <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginTop: '8px' }}>Conversion Uplift</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Realized during user testing of the 3D Builder interface.</div>
            </div>
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>$142.50</div>
              <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginTop: '8px' }}>Average Order Value</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>60% uplift over premade flagship baseline ($89.00).</div>
            </div>
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>42 Sec</div>
              <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginTop: '8px' }}>Avg. Customizer Time</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Low cognitive friction results in high funnel completion.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '13px' }}>
              <strong>🚀 Waiting List Count:</strong> 12,500+ organic consumer sign-ups.
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '13px' }}>
              <strong>✍️ Signed B2B Letters of Intent:</strong> 3 LOIs with LoveHoney, Adam & Eve, and Wellness SAS.
            </div>
          </div>
        </SlideWrapper>

        {/* Slide 4: Interactive Systems & Data Architecture SVG Diagram */}
        <SlideWrapper index={3} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={24} color="var(--accent-gold)" /> Systems & Data Architecture
          </h2>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 800 320" width="100%" height="100%" style={{ maxHeight: '280px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius-md)' }}>
              {/* Nodes */}
              {/* 1. Client App */}
              <rect x="20" y="110" width="130" height="70" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
              <text x="85" y="140" fill="var(--text-primary)" fontSize="12" fontWeight="700" textAnchor="middle">Consumer Web /</text>
              <text x="85" y="160" fill="var(--text-primary)" fontSize="12" fontWeight="700" textAnchor="middle">POS Kiosk App</text>

              {/* Arrow 1 */}
              <line x1="150" y1="145" x2="190" y2="145" stroke="var(--accent-gold)" strokeWidth="2" markerEnd="url(#arrow)" />

              {/* 2. Core API */}
              <rect x="200" y="110" width="130" height="70" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
              <text x="265" y="145" fill="var(--text-primary)" fontSize="12" fontWeight="700" textAnchor="middle">Core API Gateway</text>
              <text x="265" y="160" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Vite / Node.js Router</text>

              {/* Arrow 2 */}
              <line x1="330" y1="145" x2="370" y2="145" stroke="var(--accent-gold)" strokeWidth="2" />

              {/* 3. CAD engine */}
              <rect x="380" y="110" width="130" height="70" rx="8" fill="var(--bg-tertiary)" stroke="var(--accent-gold)" strokeWidth="2" />
              <text x="445" y="140" fill="var(--accent-gold)" fontSize="12" fontWeight="700" textAnchor="middle">stlGenerator</text>
              <text x="445" y="160" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Parametric CAD Engine</text>

              {/* Arrow 3 */}
              <line x1="510" y1="145" x2="550" y2="145" stroke="var(--accent-gold)" strokeWidth="2" />

              {/* 4. Manufacturing Queue */}
              <rect x="560" y="110" width="130" height="70" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
              <text x="625" y="140" fill="var(--text-primary)" fontSize="11" fontWeight="700" textAnchor="middle">Split-Mold Slicer &</text>
              <text x="625" y="160" fill="var(--text-primary)" fontSize="11" fontWeight="700" textAnchor="middle">3D Print Queue</text>

              {/* Arrow 4 */}
              <line x1="690" y1="145" x2="720" y2="145" stroke="var(--accent-gold)" strokeWidth="2" />

              {/* 5. Factory */}
              <rect x="730" y="110" width="50" height="70" rx="8" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="1.5" />
              <text x="755" y="145" fill="#10b981" fontSize="12" fontWeight="700" textAnchor="middle">Shop</text>
              <text x="755" y="160" fill="#10b981" fontSize="12" fontWeight="700" textAnchor="middle">Floor</text>

              {/* Database below */}
              <path d="M 235,260 C 235,250 295,250 295,250 C 295,250 295,280 295,280 C 295,290 235,290 235,290 C 235,290 235,260 235,260" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
              <text x="265" y="275" fill="var(--text-secondary)" fontSize="10" fontWeight="700" textAnchor="middle">PostgreSQL / Redis</text>
              <line x1="265" y1="180" x2="265" y2="245" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />

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
          <h2 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={24} color="var(--accent-gold)" /> Market Opportunity (TAM)
          </h2>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            
            {/* Left Circular concentric model */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '220px', height: '220px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '2px solid rgba(212, 175, 55, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ position: 'absolute', top: '10px', fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700 }}>TAM: $42.8B</span>
                
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '2px solid rgba(212, 175, 55, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ position: 'absolute', top: '45px', fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700 }}>SAM: $8.5B</span>
                  
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000000', fontWeight: 800 }}>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase' }}>SOM</span>
                    <span style={{ fontSize: '14px' }}>$420M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right text legends */}
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Total Addressable Market (TAM): $42.8 Billion</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Global adult novelty & pleasure hardware market valuation expected by 2028.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Serviceable Addressable Market (SAM): $8.5 Billion</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>The premium digital e-commerce subset of customized and anatomically scanned novelty sectors.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Serviceable Obtainable Market (SOM): $420 Million</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Target Year-3 obtainable volume capturing 5% of digital customizable channels.</span>
              </div>
            </div>

          </div>
        </SlideWrapper>

        {/* Slide 6: Business Model Options & Unit Economics */}
        <SlideWrapper index={5} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Coins size={24} color="var(--accent-gold)" /> Monetization & Unit Economics
          </h2>
          <div className="grid-2" style={{ gap: '30px', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Multi-Channel Streams</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)', fontSize: '12px' }}>
                  <strong>Direct-to-Consumer (D2C):</strong> Retail pricing from $129 to $249 per customized item.
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)', fontSize: '12px' }}>
                  <strong>B2B SaaS Licensing:</strong> $4,999/month for factory operators to run the automated STL mold compiler.
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)', fontSize: '12px' }}>
                  <strong>B2B Take-Rate:</strong> $2.50 licensing transaction fee per custom printed split-mold.
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Unit Economics (Custom Toy)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Average Selling Price (AOV):</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>$142.50</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Medical Silicone + Pigment COGS:</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>$12.50</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>3D Printed Mold Filament COGS:</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>$1.20</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Packaging & Shipping Boxes:</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>$4.80</td>
                  </tr>
                  <tr style={{ color: 'var(--accent-gold)' }}>
                    <td style={{ padding: '10px 0', fontWeight: 700 }}>Gross Profit Margin:</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700 }}>$124.00 (87%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SlideWrapper>

        {/* Slide 7: Competitor Matrix Comparison Table */}
        <SlideWrapper index={6} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={24} color="var(--accent-gold)" /> Competitive Landscape
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Features</th>
                  <th style={{ padding: '10px', color: 'var(--accent-gold)', fontWeight: 700 }}>BAD Platform</th>
                  <th style={{ padding: '10px' }}>Shopify Customizers</th>
                  <th style={{ padding: '10px' }}>Traditional Tooling</th>
                  <th style={{ padding: '10px' }}>Build-From-Scratch</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>Setup Tooling Costs</td>
                  <td style={{ padding: '10px', color: '#10b981', fontWeight: 700 }}>$1.20 (FDM print)</td>
                  <td style={{ padding: '10px' }}>N/A (static assets)</td>
                  <td style={{ padding: '10px', color: 'var(--accent-crimson)' }}>$20,000+ (Steel molds)</td>
                  <td style={{ padding: '10px' }}>$150k+ (development)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>Time-to-Manufacture</td>
                  <td style={{ padding: '10px', color: '#10b981', fontWeight: 700 }}>&lt; 24 Hours</td>
                  <td style={{ padding: '10px' }}>Static stock only</td>
                  <td style={{ padding: '10px', color: 'var(--accent-crimson)' }}>4-6 Months</td>
                  <td style={{ padding: '10px' }}>9-12 Months (build)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>CAD File Output</td>
                  <td style={{ padding: '10px', color: '#10b981', fontWeight: 700 }}>Instant 2-Part STL</td>
                  <td style={{ padding: '10px', color: 'var(--accent-crimson)' }}>None (mock image only)</td>
                  <td style={{ padding: '10px' }}>Manual solidworks</td>
                  <td style={{ padding: '10px' }}>Variable (high complexity)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>Volumetric Silicone HUD</td>
                  <td style={{ padding: '10px', color: '#10b981', fontWeight: 700 }}>Yes (Auto-Calculated)</td>
                  <td style={{ padding: '10px', color: 'var(--accent-crimson)' }}>No</td>
                  <td style={{ padding: '10px', color: 'var(--accent-crimson)' }}>No</td>
                  <td style={{ padding: '10px', color: 'var(--accent-crimson)' }}>No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SlideWrapper>

        {/* Slide 8: Go-to-Market Milestone Timeline */}
        <SlideWrapper index={7} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} color="var(--accent-gold)" /> Go-To-Market Roadmap
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', position: 'relative' }}>
            
            <div className="card" style={{ padding: '16px', borderTop: '4px solid var(--accent-gold)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)' }}>Q1: FOUNDATION</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                Finalize browser CAD compiler. Integrate local hardware SDKs for POS store deployment in NY flagship.
              </p>
            </div>

            <div className="card" style={{ padding: '16px', borderTop: '4px solid var(--accent-gold)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)' }}>Q2: INTEGRATION</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                Deploy private APIs with LoveHoney and Adam & Eve. Scale split-mold factory production queue tests.
              </p>
            </div>

            <div className="card" style={{ padding: '16px', borderTop: '4px solid var(--accent-gold)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)' }}>Q3: BETA LAUNCH</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                Invite waitlist members to Web Builder. Deploy phone mold-impression scans (BAD Fit) for direct-to-home orders.
              </p>
            </div>

            <div className="card" style={{ padding: '16px', borderTop: '4px solid var(--accent-gold)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)' }}>Q4: SCALE UP</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                Add B2B SaaS dashboard licensing. Launch creator network tipping/royalties structure.
              </p>
            </div>

          </div>
        </SlideWrapper>

        {/* Slide 9: Executive Team Bios & Advisors */}
        <SlideWrapper index={8} currentSlide={currentSlide}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} color="var(--accent-gold)" /> The Executive Team & Advisors
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
            
            {/* Executive founders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14px' }}>Arthur Vance — Co-Founder & CEO</strong>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600 }}>100% Commitment</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Former VP Product at <strong>LELO</strong>. 12+ years track record scaling luxury adult novelty hardware lines.
                </div>
              </div>
              
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14px' }}>Dr. Elena Rostova — Co-Founder & CTO</strong>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600 }}>100% Commitment</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  PhD in Computational Geometry from <strong>MIT</strong>. Expert in parametric mesh cleanups & openCASCADE Kernels.
                </div>
              </div>
            </div>

            {/* Advisors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={14} color="var(--accent-gold)" /> Marcus Thorne — B2B Retail Advisor
                </strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Former CEO of <strong>Adam & Eve</strong>. 20+ years of sector credibility and supply chain connections.
                </div>
              </div>
              
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={14} color="var(--accent-gold)" /> Dr. Sarah Jenkins — Bio-Safety Advisor
                </strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Professor of Gynecology at <strong>Stanford</strong>. Oversees medical certification and FDA material audits.
                </div>
              </div>
            </div>

          </div>
        </SlideWrapper>

        {/* Slide 10: The Ask & Funding Allocation Chart */}
        <SlideWrapper index={9} currentSlide={currentSlide} textAlign="center">
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <ShieldAlert size={12} fill="var(--accent-gold)" stroke="var(--bg-secondary)" /> Strategic Seed Ask
          </span>
          <h2 style={{ fontSize: '36px', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Seeking $2,500,000 Seed Investment</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            To scale automated CNC routing pipelines, patent custom stlGenerator APIs, and expand D2C flagship POS kiosks.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1, minWidth: '150px' }}>
              <strong style={{ fontSize: '16px', color: 'var(--accent-gold)', display: 'block' }}>50%</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Shop Floor Automation</span>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1, minWidth: '150px' }}>
              <strong style={{ fontSize: '16px', color: 'var(--accent-gold)', display: 'block' }}>30%</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>API & Platform Dev</span>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: 1, minWidth: '150px' }}>
              <strong style={{ fontSize: '16px', color: 'var(--accent-gold)', display: 'block' }}>20%</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Marketing & GTM</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', fontSize: '11px', marginTop: '40px' }}>
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '10px 18px' }}
            >
              <ArrowLeft size={14} /> Previous Slide
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '10px 18px', borderColor: 'var(--accent-gold)' }}
            >
              <TrendingUp size={14} color="var(--accent-gold)" /> Export PDF Presentation
            </button>
          </div>

          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            SLIDE {currentSlide + 1} OF {totalSlides}
          </span>

          <button 
            className="btn btn-primary"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '10px 18px' }}
          >
            Next Slide <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};
