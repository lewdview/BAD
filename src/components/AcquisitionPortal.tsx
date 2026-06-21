import React, { useState } from 'react';
import { 
  Layers, 
  Download, 
  Play, 
  ChevronRight, 
  Database, 
  DollarSign, 
  Cpu, 
  Globe, 
  Package, 
  Hammer,
  Video,
  Activity
} from 'lucide-react';
import { downloadSTL } from '../utils/stlDownloader';
import type { BuilderParams } from '../types';

export const AcquisitionPortal: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>('flared');
  const [activeDemoStep, setActiveDemoStep] = useState<number>(0);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const flowchartNodes = [
    {
      step: "Step 1",
      title: "3D Configurator",
      short: "WebGL/ThreeJS real-time parameter rendering",
      tech: "React Three Fiber, GLSL Shaders, canvas rasterization",
      metric: "60 FPS GPU render, 42s avg completion",
      desc: "Computes complex shape geometries (Realistic Glans, Taper curves, Wave nodes, and Custom Engravings) on client side. No server-side rendering required."
    },
    {
      step: "Step 2",
      title: "STL Export",
      short: "Binary & ASCII watertight model compilers",
      tech: "Parametric vertex normal calculators, dynamic buffer slicing",
      metric: "<150ms compilation time, 0$ server overhead",
      desc: "Compiles mathematical vectors directly into watertight 3D printable STL files for D2C/B2B fulfillment."
    },
    {
      step: "Step 3",
      title: "Split Mold Gen",
      short: "Watertight negative split-blocks compiler",
      tech: "Dynamic vertex scanner boundary solver",
      metric: "Watertight manifold integrity, 0.6\" wall padding",
      desc: "Scans dildo vertices dynamically to build a perfect backing block mold. Calculates the flat split interface plane at z=0, automatically accommodating flared bases and bends."
    },
    {
      step: "Step 4",
      title: "Production Queue",
      short: "Order statuses & silicone batch calculator",
      tech: "Automated volumetric telemetry integrations",
      metric: "87% gross margin tracking, silicone batch estimation",
      desc: "Integrates directly with shop floor 3D printers and casting stations. Translates customer selections into actionable materials metrics (silicone liters, core sizes)."
    },
    {
      step: "Step 5",
      title: "Revenue Panel",
      short: "B2B SaaS metric licensing & take-rates",
      tech: "Stripe B2B take-rate ledger engine",
      metric: "$4,999/mo license + $2.50 take-rate potential",
      desc: "Enables operators to license the automated CAD compiler. Models SaaS metrics for corporate buyers, showing massive gross profits and fast ROI."
    }
  ];

  // High-fidelity B2B/B2C Preset configurations for local STL compilation
  const presets: Record<string, { name: string; desc: string; params: BuilderParams }> = {
    flared: {
      name: "D2C Flared Suction Beast",
      desc: "Maximum girth, flared suction cup base, internal vibration core channel, engraved text. Perfect for high-pressure silicone pouring.",
      params: {
        baseGeometry: 'classic',
        length: 7.5,
        shaftGirth: 1.5,
        baseGirth: 1.7,
        curvature: 0.4,
        texture: 'smooth',
        suctionCup: true,
        vibrationCore: true,
        colorMode: 1,
        color1: '#ff0055',
        color2: '#00ffcc',
        isVibrating: false,
        showScaleRef: false,
        shapeType: 'classic',
        realisticVeins: 0,
        realisticGlans: false,
        hasBalls: false,
        fantasyType: 'dragon',
        baseType: 'flared',
        taper: 0.1,
        firmness: 'medium',
        inclusions: 'glow',
        thermochromic: false,
        internalTube: true,
        blacklightMode: false,
        arMode: false,
        sceneEnvironment: 'studio',
        engraveText: 'BAD-01',
        engraveStyle: 'embossed'
      }
    },
    wave: {
      name: "B2B Ergonomic Wave Shaft",
      desc: "Wave texture geometry, flat base plug for dual-density injection molding machines. Designed for comfort and high-speed B2B runs.",
      params: {
        baseGeometry: 'wave',
        length: 6.8,
        shaftGirth: 1.3,
        baseGirth: 1.5,
        curvature: 0.2,
        texture: 'ribbed',
        suctionCup: false,
        vibrationCore: false,
        colorMode: 2,
        color1: '#d4af37',
        color2: '#111111',
        isVibrating: false,
        showScaleRef: false,
        shapeType: 'classic',
        realisticVeins: 0,
        realisticGlans: false,
        hasBalls: false,
        fantasyType: 'dragon',
        baseType: 'flat',
        taper: 0.25,
        firmness: 'soft',
        inclusions: 'none',
        thermochromic: true,
        internalTube: false,
        blacklightMode: false,
        arMode: false,
        sceneEnvironment: 'studio',
        engraveText: 'WAVE',
        engraveStyle: 'engraved'
      }
    },
    anatomical: {
      name: "Ultra-Realistic Anatomical",
      desc: "Highly bulbous realistic glans, high-definition vein frequency, testicles base, standard harness collar backing shape.",
      params: {
        baseGeometry: 'classic',
        length: 8.0,
        shaftGirth: 1.6,
        baseGirth: 1.8,
        curvature: 0.3,
        texture: 'smooth',
        suctionCup: true,
        vibrationCore: false,
        colorMode: 0,
        color1: '#ffb3a7',
        color2: '#ffb3a7',
        isVibrating: false,
        showScaleRef: false,
        shapeType: 'realistic',
        realisticVeins: 0.8,
        realisticGlans: true,
        hasBalls: true,
        fantasyType: 'dragon',
        baseType: 'flared',
        taper: 0.0,
        firmness: 'dual-density',
        inclusions: 'none',
        thermochromic: false,
        internalTube: true,
        blacklightMode: false,
        arMode: false,
        sceneEnvironment: 'studio'
      }
    }
  };

  const handleDownload = (presetKey: string, type: 'product' | 'core' | 'mold_left' | 'mold_right') => {
    const key = `${presetKey}-${type}`;
    setDownloading(key);
    setTimeout(() => {
      try {
        const { params, name } = presets[presetKey];
        const cleanName = name.replace(/\s+/g, '_');
        downloadSTL(params, type, cleanName);
      } catch (err) {
        console.error(err);
        alert('Failed compiling STL locally.');
      } finally {
        setDownloading(null);
      }
    }, 300);
  };

  // Video Demo Script Chapters
  const videoSteps = [
    {
      time: "00:00 - 00:10",
      title: "1. The Hook",
      concept: "Rotate the completed 3D render with high-fidelity gold shaders to immediately impress.",
      script: "“BAD Builder is a browser-based custom manufacturing platform that generates production-ready assets directly from customer configurations. No middleman CAD software, no manual solid modeling—just pure parametric efficiency.”",
      visual: "WebGL 3D customization viewport showing a gold-glitter custom product model rotating under clean studio lighting. Focus on realistic silicone shaders and micro-displacement vein layers."
    },
    {
      time: "00:10 - 00:30",
      title: "2. Live Configuration",
      concept: "Tweak length, girth, texture, and watch the price update instantly to demonstrate complete state synchrony.",
      script: "“Customers and business partners adjust length, girth, shaft taper, curvature, and base configurations in real-time. Shaders, pricing tables, and silicone volumetric calculations adapt instantly on the client side.”",
      visual: "A cursor dragging the Shaft Length slider from 6.0\" to 8.2\" and turning on the Flared Suction Cup toggle. The 3D geometry scales smoothly, while the silicone volume HUD updates dynamically."
    },
    {
      time: "00:30 - 00:50",
      title: "3. Manufacturing Outputs",
      concept: "Generate STL files inside the manufacturing panel. Prove that the outputs are ready for printers immediately.",
      script: "“From the custom shape, the parametric compiler exports watertight STL solid models, rigid internal core plugs for B2B dual-density injection, and production split molds in one click.”",
      visual: "Clicking the 'Export left mold' and 'Export right mold' buttons in the admin panel. The browser triggers download prompts for STL files immediately, demonstrating that the calculations occur locally."
    },
    {
      time: "00:50 - 00:65",
      title: "4. The Money Shot: The Mold Files",
      concept: "Import or review the generated mold STL. Point out the split plane, negative cavity, and backing walls.",
      script: "“The platform automatically generates watertight split molds suitable for direct additive manufacturing. The bounding box calculates coordinates dynamically, ensuring a safe backing wall thickness of 0.6 inches for all flared base presets.”",
      visual: "Visual overlay showing a 3D cross-section mesh of the split mold. Pointing out the negative dildo cavity perfectly hollowed out inside the solid backing block, with flat seam interfaces at z = 0."
    },
    {
      time: "00:65 - 00:80",
      title: "5. Automated Fulfillment Dashboard",
      concept: "Show the manufacturing pipeline orders, revenue totals, and silicone volume estimation HUD.",
      script: "“Completed designs feed directly into the production dashboard, compiling order queues, tracking silicone batch requirements, and guiding technicians through the 3D-printing, pouring, and shipping lifecycle.”",
      visual: "A sleek dark gold dashboard listing active manufacturing batches, showing orders from global distributors, total silicone volume metrics (e.g. 42.5 Liters), and statuses transitioning from 'Printing' to 'Pouring'."
    },
    {
      time: "00:80 - 00:90",
      title: "6. Call to Action / Pitch Close",
      concept: "Recap the acquisition components: domain, source code, STL core kernel, and local shop floor pipeline.",
      script: "“The full package includes the buildadil.do domain hack, WebGL parametric source code, local STL/mold compilers, and the fulfillment dashboard. Available now for acquisition, licensing, or strategic B2B partnerships.”",
      visual: "A premium gold slide listing the assets: buildadil.do domain, React Three Fiber engine, watertight split-mold kernel, and shop floor management panel, with contact email placeholders."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px 0' }} className="container animate-fade-in">
      
      {/* 1. Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={10} /> Strategic Acquisition Portal
          </span>
          <h1 style={{ fontSize: '36px', marginTop: '12px', fontFamily: 'var(--font-serif)', letterSpacing: '0.02em' }}>
            SaaS & Intellectual Property Portfolio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '4px', maxWidth: '720px' }}>
            Evaluate the BAD Builder custom manufacturing engine. Review the parametric mold generator kernel, download sample STL molds, and inspect the 90-second video demo storyboard designed to maximize buyer conversion.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge" style={{ fontSize: '12px', padding: '8px 16px', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)', fontWeight: 700 }}>
            87% Gross Margin
          </span>
          <span className="badge" style={{ fontSize: '12px', padding: '8px 16px', fontWeight: 700 }}>
            Client-Side STL Engine
          </span>
        </div>
      </div>

      {/* 2. Interactive Pipeline Flowchart */}
      <div className="card glass-panel" style={{ padding: '32px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--accent-gold)" /> The Parametric Value Chain
        </h3>
        
        {/* CSS Flowchart Nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }} className="flowchart-container">
          {flowchartNodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <div 
                className="flow-node" 
                onMouseEnter={() => setHoveredNode(idx)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ 
                  flex: 1, 
                  minWidth: '160px', 
                  padding: '16px', 
                  backgroundColor: hoveredNode === idx ? 'rgba(212, 175, 55, 0.04)' : 'var(--bg-tertiary)', 
                  border: hoveredNode === idx ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  textAlign: 'center', 
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  transform: hoveredNode === idx ? 'translateY(-4px)' : 'none',
                  boxShadow: hoveredNode === idx ? '0 8px 24px rgba(212, 175, 55, 0.15)' : 'none'
                }}
              >
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: hoveredNode === idx ? 'var(--accent-gold)' : 'var(--text-muted)', fontWeight: 700 }}>
                  {node.step}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: hoveredNode === idx ? 'var(--accent-gold)' : 'var(--text-primary)', marginTop: '4px' }}>
                  {node.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  {node.short}
                </div>
              </div>
              
              {idx < flowchartNodes.length - 1 && (
                <ChevronRight size={20} color="var(--text-muted)" className="flow-arrow" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Telemetry Detail Panel */}
        <div 
          style={{ 
            marginTop: '24px', 
            padding: '20px', 
            backgroundColor: 'var(--bg-tertiary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.3s ease',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {hoveredNode !== null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', width: '100%' }} className="grid-responsive-vertical animate-fade-in">
              <div>
                <span className="badge badge-gold" style={{ fontSize: '9px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Telemetry: {flowchartNodes[hoveredNode].step} Detail
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-gold)', margin: '2px 0 6px 0' }}>
                  {flowchartNodes[hoveredNode].title}
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {flowchartNodes[hoveredNode].desc}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', justifyContent: 'center' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Tech Stack:</span> <strong style={{ color: 'var(--text-primary)' }}>{flowchartNodes[hoveredNode].tech}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Performance Metric:</span> <strong style={{ color: 'var(--text-primary)' }}>{flowchartNodes[hoveredNode].metric}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', width: '100%', fontStyle: 'italic' }}>
              💡 Hover over any step in the value chain above to inspect live telemetry channels, specifications, and performance metrics.
            </div>
          )}
        </div>
      </div>

      {/* 3. Interactive Storyboard Walkthrough */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '32px', alignItems: 'start' }} className="grid-responsive-vertical">
        
        {/* Left Side: Steps Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={16} color="var(--accent-gold)" /> Demo Video Storyboard
          </h3>
          
          {videoSteps.map((step, idx) => (
            <button 
              key={idx}
              className={`card text-left`}
              onClick={() => setActiveDemoStep(idx)}
              style={{
                padding: '16px',
                backgroundColor: activeDemoStep === idx ? 'rgba(212, 175, 55, 0.04)' : 'var(--bg-secondary)',
                border: activeDemoStep === idx ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <span style={{ fontSize: '9px', fontWeight: 800, color: activeDemoStep === idx ? 'var(--accent-gold)' : 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  {step.time}
                </span>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 0 0', color: activeDemoStep === idx ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                  {step.title}
                </h4>
              </div>
              <ChevronRight size={16} color={activeDemoStep === idx ? 'var(--accent-gold)' : 'var(--text-muted)'} />
            </button>
          ))}
        </div>

        {/* Right Side: Active Storyboard Step Details Panel */}
        <div className="card glass-panel" style={{ padding: '32px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800 }}>Storyboard Script Chapter</span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-serif)' }}>
                  {videoSteps[activeDemoStep].title}
                </h2>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Play size={10} fill="var(--accent-gold)" /> {videoSteps[activeDemoStep].time.split(' ')[0]}s
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Voiceover Narration (The Script)</strong>
                <p style={{ fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)', margin: 0 }}>
                  {videoSteps[activeDemoStep].script}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Screen Visual Action</strong>
                <p style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                  {videoSteps[activeDemoStep].visual}
                </p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Chapter Concept: <strong>{videoSteps[activeDemoStep].concept}</strong>
            </span>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setActiveDemoStep((prev) => (prev + 1) % videoSteps.length)}
              style={{ fontSize: '11px', padding: '8px 16px' }}
            >
              Next Scene
            </button>
          </div>

        </div>

      </div>

      {/* 4. Live Compile & Export verification center */}
      <div className="card glass-panel" style={{ padding: '32px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Hammer size={16} color="var(--accent-gold)" /> Dynamic STL Verification Center
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginTop: '4px', marginBottom: 0 }}>
              Validate watertight outputs locally. Choose a parametric preset to compile Product, Inner Core, and production Split Mold STLs in your browser.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
            {Object.keys(presets).map((key) => (
              <button 
                key={key}
                className={`btn ${activePreset === key ? 'btn-primary' : ''}`}
                onClick={() => setActivePreset(key)}
                style={{
                  fontSize: '11px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: activePreset === key ? '' : 'transparent',
                  border: 'none',
                  color: activePreset === key ? '' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {presets[key].name.split(' ').slice(1).join(' ') || presets[key].name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '32px', alignItems: 'center' }} className="grid-responsive-vertical">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span className="badge badge-gold" style={{ fontSize: '9px', textTransform: 'uppercase', marginBottom: '8px' }}>Active Preset</span>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{presets[activePreset].name}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5, marginBottom: 0 }}>
                {presets[activePreset].desc}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Length:</span> <strong>{presets[activePreset].params.length}"</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Curvature:</span> <strong>{presets[activePreset].params.curvature * 100}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Base Style:</span> <strong>{presets[activePreset].params.baseType.toUpperCase()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Suction Cup:</span> <strong>{presets[activePreset].params.suctionCup ? "Yes" : "No"}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Custom Product Model</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4, marginBottom: 0 }}>
                  Solid 3D model containing custom shafts, textures, veins, and initials.
                </p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => handleDownload(activePreset, 'product')}
                disabled={downloading !== null}
                style={{ fontSize: '11px', width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <Download size={12} /> {downloading === `${activePreset}-product` ? "Compiling..." : "Download STL"}
              </button>
            </div>

            <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Rigid Inner Core</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4, marginBottom: 0 }}>
                  Scaled down core insert for dual-density casting. Retains 0.46x girth scale.
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => handleDownload(activePreset, 'core')}
                disabled={downloading !== null}
                style={{ fontSize: '11px', width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <Download size={12} /> {downloading === `${activePreset}-core` ? "Compiling..." : "Download STL"}
              </button>
            </div>

            <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Production Left Mold</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4, marginBottom: 0 }}>
                  Left mold block with dynamic bounds bounding the flared base.
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => handleDownload(activePreset, 'mold_left')}
                disabled={downloading !== null}
                style={{ fontSize: '11px', width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderColor: 'var(--accent-gold)', cursor: 'pointer' }}
              >
                <Download size={12} /> {downloading === `${activePreset}-mold_left` ? "Compiling..." : "Download Left"}
              </button>
            </div>

            <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Production Right Mold</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4, marginBottom: 0 }}>
                  Right mold block containing negative cavity with dynamic bounds.
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => handleDownload(activePreset, 'mold_right')}
                disabled={downloading !== null}
                style={{ fontSize: '11px', width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderColor: 'var(--accent-gold)', cursor: 'pointer' }}
              >
                <Download size={12} /> {downloading === `${activePreset}-mold_right` ? "Compiling..." : "Download Right"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 5. Metrics & Portofolio parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }} className="grid-responsive-vertical">
        
        {/* Included Assets */}
        <div className="card glass-panel" style={{ padding: '32px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Package size={16} color="var(--accent-gold)" /> Intellectual Property Inventory
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
            
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={14} color="var(--accent-gold)" />
                <strong style={{ fontSize: '13px' }}>Domain Assets</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4, marginBottom: 0 }}>
                Primary domain hack: <strong>buildadil.do</strong>. Includes redirects, DNS records, and social handles.
              </p>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={14} color="var(--accent-gold)" />
                <strong style={{ fontSize: '13px' }}>Parametric Slicer Kernel</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4, marginBottom: 0 }}>
                Fully client-side parametric algorithm. Generates watertight meshes without server rendering overhead.
              </p>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={14} color="var(--accent-gold)" />
                <strong style={{ fontSize: '13px' }}>Technician Dashboard</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4, marginBottom: 0 }}>
                Sleek shop floor dashboard tracking silicone density calculations, print times, and fulfillment states.
              </p>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={14} color="var(--accent-gold)" />
                <strong style={{ fontSize: '13px' }}>Full Source Code</strong>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4, marginBottom: 0 }}>
                Clean TypeScript/Vite/React codebase. Modular styles, Three.js shaders, offscreen heightmap rendering.
              </p>
            </div>

          </div>
        </div>

        {/* Strategic Inquiries */}
        <div className="card glass-panel" style={{ padding: '32px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <DollarSign size={16} color="var(--accent-gold)" /> Acquisition Terms
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: 1.5, marginBottom: '20px', marginTop: '8px' }}>
              BAD Builder is available for full acquisition, intellectual property licensing, or strategic manufacturing partnerships.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="acquisition-deal-models">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Preferred Deal Model:</span>
                <strong>Asset Sale / IP Acquisition</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>B2B SaaS Pricing Potential:</span>
                <strong>$4,999 / month per factory</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Average Gross Margin:</span>
                <strong style={{ color: 'var(--accent-gold)' }}>87% profit margins</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <a 
              href="mailto:acquisitions@buildadil.do?subject=Inquiry: BAD Builder SaaS Acquisition"
              className="btn btn-primary btn-glow"
              style={{ width: '100%', textAlign: 'center', fontSize: '12px', fontWeight: 700, display: 'block', textDecoration: 'none', padding: '12px 0', boxSizing: 'border-box' }}
            >
              Initiate Strategic Inquiry
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
