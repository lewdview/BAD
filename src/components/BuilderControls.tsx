import React, { useMemo, useRef, useEffect } from 'react';
import { Sparkles, Layers, Ruler, Sliders, Palette, Heart, Type, Eye } from 'lucide-react';
import { generateToySTL } from '../utils/stlGenerator';
import type { BuilderParams, CartItem, UpdateParamFn } from '../types';

import { calculatePrice } from '../constants/pricing';
import { AccordionSection } from './ui/AccordionSection';
import { ShapeControls } from './builder/ShapeControls';
import { DimensionsControls } from './builder/DimensionsControls';
import { FirmnessControls } from './builder/FirmnessControls';
import { ColorMaterialControls } from './builder/ColorMaterialControls';
import { FunctionalUpgrades } from './builder/FunctionalUpgrades';
import { EngravingControls } from './builder/EngravingControls';
import { SceneryARControls } from './builder/SceneryARControls';
import { CartActions } from './builder/CartActions';
import { TesticleControls } from './builder/TesticleControls';

interface BuilderControlsProps {
  params: BuilderParams;
  setParams: React.Dispatch<React.SetStateAction<BuilderParams>>;
  onAddToCart: (customToy: Omit<CartItem, 'quantity'>) => void;
  onShareToSocial: (customToy: { name: string; price: number; parameters: BuilderParams }) => void;
  demoMode: boolean;
}

export const BuilderControls: React.FC<BuilderControlsProps> = ({
  params,
  setParams,
  onAddToCart,
  onShareToSocial,
  demoMode
}) => {
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = React.useState(false);
  const [expandedSection, setExpandedSection] = React.useState<string | null>('shape');

  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateParam: UpdateParamFn = (key, value) => {
    setParams((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'baseType') {
        updated.suctionCup = value === 'flared';
      }
      return updated;
    });
  };

  const currentPrice = useMemo(() => {
    return calculatePrice(params, demoMode);
  }, [params, demoMode]);

  const handleAiPreset = (presetType: string) => {
    setIsAiThinking(true);
    setAiResponse(null);
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    aiTimeoutRef.current = setTimeout(() => {
      let message = '';
      if (demoMode) {
        if (presetType === 'candle') {
          setParams((prev) => ({
            ...prev,
            shapeType: 'candle',
            length: 7.0,
            shaftGirth: 1.3,
            baseGirth: 1.5,
            curvature: 0.0,
            texture: 'swirled',
            colorMode: 1, // Marble Swirl
            color1: '#ffffff', // Pure Pearl
            color2: '#d4af37', // Satin Gold
            firmness: 'medium',
            inclusions: 'none',
            thermochromic: false
          }));
          message = "🕯️ AI Designer: 'Spiral Pillar Candle' template applied. Configured with a twisted swirl geometry, pearl-white and gold marble pour wax simulation, and 7.0\" height.";
        } else if (presetType === 'soap') {
          setParams((prev) => ({
            ...prev,
            shapeType: 'soap',
            length: 4.5,
            shaftGirth: 1.4,
            baseGirth: 1.4,
            curvature: 0.0,
            texture: 'smooth',
            colorMode: 2, // Duo Gradient
            color1: '#63a388', // Mint Wellness
            color2: '#e2e8f0', // Pure Pearl
            firmness: 'soft',
            inclusions: 'none',
            thermochromic: false
          }));
          message = "🧼 AI Designer: 'Organic Soap Bar' template applied. Configured with a smooth chamfered block profile, a refreshing mint-to-cream gradient pour simulation, and 4.5\" length.";
        } else if (presetType === 'kitchen') {
          setParams((prev) => ({
            ...prev,
            shapeType: 'kitchen',
            length: 3.5,
            shaftGirth: 1.6,
            baseGirth: 1.8,
            curvature: 0.0,
            texture: 'ribbed',
            colorMode: 0, // Solid
            color1: '#d946ef', // Electric Orchid
            firmness: 'soft',
            inclusions: 'none',
            thermochromic: true
          }));
          message = "🧁 AI Designer: 'Silicone Cupcake Cup' template applied. Configured with a fluted ribbed profile, flexible soft shore density, heat-reactive thermochromic color shift, and 3.5\" height.";
        } else if (presetType === 'collectible') {
          setParams((prev) => ({
            ...prev,
            shapeType: 'collectible',
            length: 5.5,
            shaftGirth: 1.1,
            baseGirth: 1.3,
            curvature: 0.1,
            texture: 'smooth',
            colorMode: 3, // Split Pour
            color1: '#242426', // Midnight Slate
            color2: '#e2e8f0', // Pure Pearl
            firmness: 'firm',
            inclusions: 'glitter',
            thermochromic: false
          }));
          message = "🧸 AI Designer: 'Low-Poly Chibi Base' template applied. Configured with an octagonal segment geometry, high-density structure, sparkling glitter inclusions, and a split midnight-and-pearl palette.";
        }
      } else {
        if (presetType === 'beginner') {
          setParams((prev) => ({
            ...prev,
            length: 5.0,
            shaftGirth: 1.0,
            baseGirth: 1.2,
            curvature: 0.0,
            texture: 'smooth',
            baseGeometry: 'classic',
            colorMode: 0,
            color1: '#d97d8c', // Dusty Rose
            vibrationCore: false,
            isVibrating: false,
            shapeType: 'classic',
            baseType: 'flat',
            taper: 0.1,
            firmness: 'soft',
            inclusions: 'none',
            thermochromic: false,
            internalTube: false
          }));
          message = "🌱 AI Designer: 'Beginner Wellness' applied. Designed in a soft 5.0\" smooth classic profile, soft 10A density, flat base, and clean solid Dusty Rose silicone for absolute comfort.";
        } else if (presetType === 'gspot') {
          setParams((prev) => ({
            ...prev,
            length: 6.8,
            shaftGirth: 1.25,
            baseGirth: 1.4,
            curvature: 0.9, // Forward curve
            texture: 'ribbed',
            baseGeometry: 'ergonomic',
            colorMode: 1, // Marble Swirl
            color1: '#482060', // Royal Plum
            color2: '#d4af37', // Satin Gold
            vibrationCore: true,
            shapeType: 'targeted',
            baseType: 'flared',
            taper: 0.2,
            firmness: 'medium',
            inclusions: 'none',
            thermochromic: false,
            internalTube: false
          }));
          message = "🎯 AI Designer: 'G-Spot Sculpt' applied. Targets zones with a 6.8\" ergonomic curve, Concentric Ribbed texture, medium 20A firmness, flared suction cup, and satin Royal Plum & Gold marble swirl.";
        } else if (presetType === 'marble') {
          setParams((prev) => ({
            ...prev,
            length: 6.0,
            shaftGirth: 1.2,
            baseGirth: 1.4,
            curvature: 0.2,
            texture: 'smooth',
            colorMode: 1, // Marble Swirl
            color1: '#242426', // Midnight Slate
            color2: '#d4af37', // Satin Gold
            shapeType: 'classic',
            baseType: 'flared',
            taper: 0.25,
            firmness: 'medium',
            inclusions: 'glitter',
            thermochromic: false,
            internalTube: false
          }));
          message = "💎 AI Designer: 'Silk Marble' applied. Classic 6.0\" layout with gradual taper, premium gold-glitter inclusions, and a high-contrast liquid marble swirl of Midnight Slate & Satin Gold.";
        } else if (presetType === 'intensity') {
          setParams((prev) => ({
            ...prev,
            length: 7.5,
            shaftGirth: 1.5,
            baseGirth: 1.8,
            curvature: 0.4,
            texture: 'studded',
            baseGeometry: 'wave',
            colorMode: 2, // Duo Gradient
            color1: '#d946ef', // Electric Orchid
            color2: '#63a388', // Mint Wellness
            vibrationCore: true,
            isVibrating: true,
            shapeType: 'fantasy',
            fantasyType: 'dragon',
            baseType: 'flared',
            taper: 0.3,
            firmness: 'dual-density',
            inclusions: 'glow',
            thermochromic: true,
            internalTube: true
          }));
          message = "⚡ AI Designer: 'Max Intensity' applied. Builds a 7.5\" dragon-scale shape with dual-density (rigid inner core, soft outer silicone), heat-reactive thermochromics, blacklight-ready glow inclusions, and active vibrations.";
        }
      }
      setAiResponse(message);
      setIsAiThinking(false);
      aiTimeoutRef.current = null;
    }, 800);
  };

  const handleCustomAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiThinking(true);
    setAiResponse(null);

    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    aiTimeoutRef.current = setTimeout(() => {
      // Logic for prompt processing would be here
      setIsAiThinking(false);
      setAiPrompt('');
      aiTimeoutRef.current = null;
    }, 1200);
  };

  const handleAddToCart = () => {
    const itemName = demoMode 
      ? `Custom ${params.shapeType.charAt(0).toUpperCase() + params.shapeType.slice(1)} Mold`
      : `Custom ${params.shapeType.toUpperCase()} ${params.baseGeometry.replace('_', ' ').toUpperCase()}`;

    onAddToCart({
      id: `custom-${Date.now()}`,
      name: itemName,
      price: currentPrice,
      isCustom: true,
      parameters: { ...params }
    });
  };

  const handleShareToSocial = () => {
    const itemName = demoMode 
      ? `Custom ${params.shapeType.charAt(0).toUpperCase() + params.shapeType.slice(1)} Mold`
      : `The Custom ${params.shapeType.toUpperCase()}`;

    onShareToSocial({
      name: itemName,
      price: currentPrice,
      parameters: { ...params }
    });
  };

  const handleExportSTL = () => {
    try {
      const stlContent = generateToySTL(params);
      const blob = new Blob([stlContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      let shapePrefix = 'Custom';
      if (demoMode) {
        shapePrefix = params.shapeType === 'candle' ? 'Candle' : params.shapeType === 'soap' ? 'Soap' : params.shapeType === 'kitchen' ? 'Kitchenware' : 'Collectible';
      } else {
        shapePrefix = params.shapeType === 'classic' ? 'Classic' : params.shapeType === 'realistic' ? 'Anatomical' : params.shapeType === 'fantasy' ? `${params.fantasyType.charAt(0).toUpperCase() + params.fantasyType.slice(1)}` : 'Targeted';
      }
      const fileBaseName = `BAD_${shapePrefix}_${params.length.toFixed(1)}in`.replace(/\s+/g, '_');
      
      link.download = `${fileBaseName}.stl`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      if (demoMode) {
        alert(`Export Successful! Downloaded standard 3D STL schematic: ${fileBaseName}.stl\n\nUse this mesh to 3D print your custom item, or create a two-part casing split mold to cast in wax, soap, or silicone!`);
      } else {
        alert(`Export Successful! Downloaded standard 3D STL schematic: ${fileBaseName}.stl\n\n⚠️ IMPORTANT: Home 3D prints (PLA/PETG/Resin) are porous and NOT body-safe. Use this mesh to print a mold, then cast body-safe medical-grade silicone!`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to compile 3D model for export.');
    }
  };

  return (
    <div className="controls-panel animate-fade-in" style={{ gap: '16px', paddingBottom: '32px' }}>
      {/* Title */}
      <div>
        <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={10} /> {demoMode ? "Parametric CAD Mold Studio" : "Fully Personalized"}
        </span>
        <h2 style={{ marginTop: '8px', fontSize: '24px', fontWeight: 700 }}>{demoMode ? "Sculpt Your Craft Mold" : "Sculpt Your Design"}</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {demoMode ? "Adjust dimensions, shapes, and textures of your mold template." : "Adjust dimensions, shapes, and aesthetics below."}
        </p>
      </div>

      <hr style={{ borderColor: 'var(--border-color)' }} />

      {/* AI MOLD/PLEASURE ARCHITECT CARD */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.06) 0%, rgba(212, 175, 55, 0.06) 100%)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={15} color="var(--accent-gold)" style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' }} />
          <span style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
            {demoMode ? "AI Mold Architect" : "AI Pleasure Architect"}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
          {demoMode ? "Describe your craft project, and let our customizer design the mold casing." : "Describe your perfect toy or vibe, and let our customizer design it for you."}
        </p>

        {/* AI Quick Presets */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {demoMode ? (
            <>
              <button type="button" className="preset-pill" onClick={() => handleAiPreset('candle')}>🕯️ Spiral Candle</button>
              <button type="button" className="preset-pill" onClick={() => handleAiPreset('soap')}>🧼 Honeycomb Soap</button>
              <button type="button" className="preset-pill" onClick={() => handleAiPreset('kitchen')}>🧁 Muffin Cup</button>
              <button type="button" className="preset-pill" onClick={() => handleAiPreset('collectible')}>🧸 Chibi Toy</button>
            </>
          ) : (
            <>
              <button type="button" className="preset-pill" onClick={() => handleAiPreset('beginner')}>🌱 Beginner Wellness</button>
              <button type="button" className="preset-pill" onClick={() => handleAiPreset('gspot')}>🎯 G-Spot Sculpt</button>
              <button type="button" className="preset-pill" onClick={() => handleAiPreset('marble')}>💎 Silk Marble</button>
              <button type="button" className="preset-pill" onClick={() => handleAiPreset('intensity')}>⚡ Max Intensity</button>
            </>
          )}
        </div>

        {/* AI Custom Input */}
        <form onSubmit={handleCustomAiPrompt} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder={demoMode ? "e.g. spiral soy wax candle..." : "e.g. beginner-friendly pink marble..."} 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isAiThinking}
            style={{ marginTop: 0 }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isAiThinking}
            style={{ 
              padding: '8px 16px', 
              fontSize: '11px', 
              borderRadius: 'var(--radius-sm)',
              minWidth: '70px',
              height: '38px'
            }}
          >
            {isAiThinking ? '...' : 'Ask AI'}
          </button>
        </form>

        {aiResponse && (
          <div 
            className="animate-fade-in"
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderLeft: '2px solid var(--accent-gold)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: '1.45'
            }}
          >
            {aiResponse}
          </div>
        )}
      </div>

      {/* COLLAPSIBLE PARAMETERS CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ACCORDION 1: SHAPE / CRAFT TYPE */}
        <div className="card" style={{ padding: '0 18px' }}>
          <AccordionSection
            id="shape"
            title={demoMode ? "1. Use Scenario & Craft" : "1. Shape & Anatomy"}
            icon={<Layers size={15} color="var(--accent-gold)" />}
            isExpanded={expandedSection === 'shape'}
            onToggle={toggleSection}
          >
            <ShapeControls
              params={params}
              updateParam={updateParam}
              demoMode={demoMode}
            />
          </AccordionSection>
        </div>

        {/* ACCORDION 2: DIMENSIONS / CURVES */}
        <div className="card" style={{ padding: '0 18px' }}>
          <AccordionSection
            id="dimensions"
            title={demoMode ? "2. Volumetrics" : "2. Dimensions & Curves"}
            icon={<Ruler size={15} color="var(--accent-gold)" />}
            isExpanded={expandedSection === 'dimensions'}
            onToggle={toggleSection}
          >
            <DimensionsControls
              params={params}
              updateParam={updateParam}
              demoMode={demoMode}
            />
          </AccordionSection>
        </div>

        {/* ACCORDION 3: TESTICLES / SACK CONFIGURATION */}
        {!demoMode && (
          <div className="card" style={{ padding: '0 18px' }}>
            <AccordionSection
              id="testicles"
              title="3. Testicles & Sack"
              icon={<Sparkles size={15} color="var(--accent-gold)" />}
              isExpanded={expandedSection === 'testicles'}
              onToggle={toggleSection}
            >
              <TesticleControls
                params={params}
                updateParam={updateParam}
              />
            </AccordionSection>
          </div>
        )}

        {/* ACCORDION 4: FIRMNESS / DENSITY */}
        <div className="card" style={{ padding: '0 18px' }}>
          <AccordionSection
            id="firmness"
            title={demoMode ? "3. Silicone Shore Firmness" : "4. Firmness & Density"}
            icon={<Sliders size={15} color="var(--accent-gold)" />}
            isExpanded={expandedSection === 'firmness'}
            onToggle={toggleSection}
          >
            <FirmnessControls
              params={params}
              updateParam={updateParam}
              demoMode={demoMode}
            />
          </AccordionSection>
        </div>

        {/* ACCORDION 5: COLOR / SILICONE POUR */}
        <div className="card" style={{ padding: '0 18px' }}>
          <AccordionSection
            id="color"
            title={demoMode ? "4. Color & Craft presets" : "5. Pigment & Material"}
            icon={<Palette size={15} color="var(--accent-gold)" />}
            isExpanded={expandedSection === 'color'}
            onToggle={toggleSection}
          >
            <ColorMaterialControls
              params={params}
              updateParam={updateParam}
            />
          </AccordionSection>
        </div>

        {/* ACCORDION 6: FUNCTIONAL UPGRADES */}
        {!demoMode && (
          <div className="card" style={{ padding: '0 18px' }}>
            <AccordionSection
              id="functional"
              title="6. Functional Upgrades"
              icon={<Heart size={15} color="var(--accent-gold)" />}
              isExpanded={expandedSection === 'functional'}
              onToggle={toggleSection}
            >
              <FunctionalUpgrades
                params={params}
                updateParam={updateParam}
              />
            </AccordionSection>
          </div>
        )}

        {/* ACCORDION 7: PERSONALIZED ENGRAVING & TEXT */}
        <div className="card" style={{ padding: '0 18px' }}>
          <AccordionSection
            id="engraving"
            title={demoMode ? "5. Custom Branding & Text" : "7. Custom Engraving & Text"}
            icon={<Type size={15} color="var(--accent-gold)" />}
            isExpanded={expandedSection === 'engraving'}
            onToggle={toggleSection}
          >
            <EngravingControls
              params={params}
              updateParam={updateParam}
            />
          </AccordionSection>
        </div>

        {/* ACCORDION 7: SCENERY & AR ENVIRONMENT */}
        <div className="card" style={{ padding: '0 18px' }}>
          <AccordionSection
            id="scenery"
            title={demoMode ? "6. Scenery & AR View" : "8. Scenery & AR View"}
            icon={<Eye size={15} color="var(--accent-gold)" />}
            isExpanded={expandedSection === 'scenery'}
            onToggle={toggleSection}
          >
            <SceneryARControls
              params={params}
              updateParam={updateParam}
            />
          </AccordionSection>
        </div>

      </div>

      <hr style={{ borderColor: 'var(--border-color)', marginTop: 'auto' }} />

      <CartActions
        params={params}
        updateParam={updateParam}
        currentPrice={currentPrice}
        demoMode={demoMode}
        onShareToSocial={handleShareToSocial}
        onExportSTL={handleExportSTL}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
