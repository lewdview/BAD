import React from 'react';
import { Sparkles, Sliders, Palette, ShieldCheck, Heart, Share2, ShoppingCart, Layers, Ruler, Eye, Camera, Type } from 'lucide-react';
import { generateToySTL } from '../utils/stlGenerator';

interface BuilderParams {
  baseGeometry: string;
  length: number;
  shaftGirth: number;
  baseGirth: number;
  curvature: number;
  texture: string;
  suctionCup: boolean;
  vibrationCore: boolean;
  colorMode: number; // 0 = Solid, 1 = Marble, 2 = Gradient, 3 = Split
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
  engraveText: string;
  engraveStyle: string;
  engravePosition: number;
  engraveSize: number;
  engraveDepth: number;
}

interface BuilderControlsProps {
  params: BuilderParams;
  setParams: React.Dispatch<React.SetStateAction<BuilderParams>>;
  onAddToCart: (customToy: any) => void;
  onShareToSocial: (customToy: any) => void;
  demoMode: boolean;
}

const PREMIUM_COLORS = [
  { name: 'Midnight Slate', hex: '#242426' },
  { name: 'Satin Gold', hex: '#d4af37' },
  { name: 'Dusty Rose', hex: '#d97d8c' },
  { name: 'Royal Plum', hex: '#482060' },
  { name: 'Crimson Kiss', hex: '#a62b2b' },
  { name: 'Mint Wellness', hex: '#63a388' },
  { name: 'Electric Orchid', hex: '#d946ef' },
  { name: 'Pure Pearl', hex: '#e2e8f0' }
];

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

  const updateParam = (key: keyof BuilderParams, value: any) => {
    setParams((prev) => {
      const updated = { ...prev, [key]: value };
      // Sync suction cup state with baseType
      if (key === 'baseType') {
        updated.suctionCup = value === 'flared';
      }
      return updated;
    });
  };

  // Calculate price dynamically based on size, complexity, materials, and additions
  const calculatePrice = () => {
    let price = demoMode ? 25.00 : 99.00; // Base price is cheaper for crafts

    // Dimensions
    if (params.length > 5.0) {
      price += (params.length - 5.0) * (demoMode ? 3.00 : 12.00);
    }
    if (params.shaftGirth > 1.2) {
      price += (params.shaftGirth - 1.2) * (demoMode ? 4.00 : 15.00);
    }
    if (params.taper > 0.1) {
      price += params.taper * (demoMode ? 2.00 : 8.00);
    }

    if (!demoMode) {
      // Anatomy & Shapes
      if (params.shapeType === 'realistic' || params.shapeType === 'fantasy') {
        price += 15.00;
      }
      if (params.shapeType === 'realistic') {
        price += params.realisticVeins * 10.00;
        if (params.realisticGlans) price += 8.00;
        if (params.hasBalls) price += 20.00;
      }
    } else {
      // Demo shapes adjustments
      if (params.shapeType === 'collectible') {
        price += 10.00; // higher density resin
      }
    }

    // Color pours & details
    if (params.colorMode > 0) {
      price += demoMode ? 5.00 : 15.00;
    }

    // Inclusions & Effects
    if (params.inclusions !== 'none') {
      price += demoMode ? 4.00 : 12.00;
    }
    if (params.thermochromic) {
      price += demoMode ? 6.00 : 18.00;
    }

    // Firmness / Dual-density
    if (params.firmness === 'dual-density') {
      price += demoMode ? 10.00 : 30.00;
    }

    if (!demoMode) {
      // Add-on components
      if (params.baseType === 'flared') price += 10.00;
      if (params.vibrationCore) price += 25.00;
      if (params.internalTube) price += 25.00;
    }

    return Number(price.toFixed(2));
  };

  const currentPrice = calculatePrice();

  const handleAiPreset = (presetType: string) => {
    setIsAiThinking(true);
    setAiResponse(null);
    setTimeout(() => {
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
            color1: '#ffffff', // Pure Pearl (off-white/wax)
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
    }, 800);
  };

  const handleCustomAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiThinking(true);
    setAiResponse(null);

    setTimeout(() => {
      const prompt = aiPrompt.toLowerCase();
      let length = params.length;
      let shaftGirth = params.shaftGirth;
      let baseGirth = params.baseGirth;
      let curvature = params.curvature;
      let texture = params.texture;
      let baseGeometry = params.baseGeometry;
      let colorMode = params.colorMode;
      let color1 = params.color1;
      let color2 = params.color2;
      let suctionCup = params.suctionCup;
      let vibrationCore = params.vibrationCore;
      let isVibrating = params.isVibrating;
      
      let shapeType = params.shapeType;
      let realisticVeins = params.realisticVeins;
      let realisticGlans = params.realisticGlans;
      let hasBalls = params.hasBalls;
      let fantasyType = params.fantasyType;
      let baseType = params.baseType;
      let taper = params.taper;
      let firmness = params.firmness;
      let inclusions = params.inclusions;
      let thermochromic = params.thermochromic;
      let internalTube = params.internalTube;
      let blacklightMode = params.blacklightMode;
      let arMode = params.arMode;
      let sceneEnvironment = params.sceneEnvironment;

      let reasons: string[] = [];

      // Keyword parsing
      if (demoMode) {
        if (prompt.includes('candle') || prompt.includes('wax') || prompt.includes('wick')) {
          shapeType = 'candle';
          texture = 'swirled';
          reasons.push("selected Spiral Candle structure");
        } else if (prompt.includes('soap') || prompt.includes('honeycomb') || prompt.includes('bar')) {
          shapeType = 'soap';
          texture = 'smooth';
          reasons.push("selected Honeycomb Soap Bar geometry");
        } else if (prompt.includes('kitchen') || prompt.includes('muffin') || prompt.includes('cupcake') || prompt.includes('baking') || prompt.includes('liner')) {
          shapeType = 'kitchen';
          texture = 'ribbed';
          reasons.push("selected Fluted Cupcake Cup geometry");
        } else if (prompt.includes('figurine') || prompt.includes('toy') || prompt.includes('chibi') || prompt.includes('collectible') || prompt.includes('statue')) {
          shapeType = 'collectible';
          texture = 'smooth';
          reasons.push("selected Octagonal Chibi Figure base shape");
        }

        if (prompt.includes('small') || prompt.includes('light') || prompt.includes('mini')) {
          length = 3.5;
          shaftGirth = 1.0;
          reasons.push("scaled down dimensions to 3.5\" height");
        } else if (prompt.includes('large') || prompt.includes('big') || prompt.includes('tall') || prompt.includes('giant')) {
          length = 7.5;
          shaftGirth = 1.5;
          reasons.push("scaled up dimensions to 7.5\" height");
        }
      } else {
        if (prompt.includes('beginner') || prompt.includes('gentle') || prompt.includes('first') || prompt.includes('soft') || prompt.includes('small') || prompt.includes('light')) {
          length = 5.0;
          shaftGirth = 1.0;
          curvature = 0.0;
          texture = 'smooth';
          baseGeometry = 'classic';
          shapeType = 'classic';
          firmness = 'soft';
          reasons.push("scaled down to a gentle 5.0\" length, 1.0x girth, and Soft 10A density");
        } else if (prompt.includes('thick') || prompt.includes('girth') || prompt.includes('big') || prompt.includes('wide') || prompt.includes('fat') || prompt.includes('huge') || prompt.includes('large')) {
          shaftGirth = 1.55;
          baseGirth = 1.8;
          reasons.push("increased girth to 1.55x and flange base width to 1.8x");
        }

        if (prompt.includes('realistic') || prompt.includes('vein') || prompt.includes('natural') || prompt.includes('human') || prompt.includes('anatomy') || prompt.includes('anatomical')) {
          shapeType = 'realistic';
          realisticVeins = 0.75;
          realisticGlans = true;
          reasons.push("shifted silhouette to Realistic with winding veins and anatomical glans head");
          if (prompt.includes('ball') || prompt.includes('testicle') || prompt.includes('nuts')) {
            hasBalls = true;
            reasons.push("added optional organic testicles");
          }
        } else if (prompt.includes('fantasy') || prompt.includes('dragon') || prompt.includes('alien') || prompt.includes('tentacle') || prompt.includes('monster') || prompt.includes('creature')) {
          shapeType = 'fantasy';
          if (prompt.includes('alien') || prompt.includes('knot')) {
            fantasyType = 'alien';
            texture = 'studded';
          } else if (prompt.includes('tentacle') || prompt.includes('octopus')) {
            fantasyType = 'tentacle';
            texture = 'ribbed';
          } else {
            fantasyType = 'dragon';
            texture = 'swirled';
          }
          reasons.push(`sculpted fantasy shape in ${fantasyType} style`);
        }
      }

      if (prompt.includes('g-spot') || prompt.includes('gspot') || prompt.includes('internal') || prompt.includes('curve') || prompt.includes('bend')) {
        curvature = 0.95;
        baseGeometry = 'ergonomic';
        shapeType = 'targeted';
        if (texture === 'smooth') texture = 'ribbed';
        reasons.push("applied G-Spot curve layout with a forward curvature (0.95)");
      }

      if (prompt.includes('split') || prompt.includes('half')) {
        colorMode = 3; // Split Pour
        reasons.push("applied split-pour split");
      } else if (prompt.includes('marble') || prompt.includes('swirl') || prompt.includes('mix') || prompt.includes('blend')) {
        colorMode = 1;
        color1 = '#242426'; // Midnight Slate
        color2 = '#d4af37'; // Satin Gold
        reasons.push("blended Midnight Slate & Satin Gold marble swirl");
      } else if (prompt.includes('gradient') || prompt.includes('fade')) {
        colorMode = 2;
        color1 = '#d946ef'; // Electric Orchid
        color2 = '#e2e8f0'; // Pure Pearl
        reasons.push("created an Orchid-to-Pearl color gradient");
      }

      if (prompt.includes('glitter') || prompt.includes('shimmer') || prompt.includes('sparkle')) {
        inclusions = 'glitter';
        reasons.push("infused cosmetic-grade glitter sparkles");
      } else if (prompt.includes('metallic') || prompt.includes('foil') || prompt.includes('shiny')) {
        inclusions = 'metallic';
        reasons.push("infused shiny metallic flakes");
      } else if (prompt.includes('glow') || prompt.includes('uv') || prompt.includes('blacklight')) {
        inclusions = 'glow';
        blacklightMode = true;
        reasons.push("infused glow-in-the-dark UV reactive pigments and toggled blacklight");
      }

      if (prompt.includes('heat') || prompt.includes('temperature') || prompt.includes('thermo')) {
        thermochromic = true;
        reasons.push("added thermochromic heat-reactivity");
      }

      if (prompt.includes('dual') || prompt.includes('core') || prompt.includes('dual-density') || prompt.includes('inner')) {
        firmness = 'dual-density';
        reasons.push("applied Dual-Density core architecture");
      }

      if (prompt.includes('ejac') || prompt.includes('tube') || prompt.includes('pump') || prompt.includes('squirt')) {
        internalTube = true;
        reasons.push("toggled internal ejaculation tube");
      }

      if (prompt.includes('hands-free') || prompt.includes('suction') || prompt.includes('stand') || prompt.includes('cup')) {
        baseType = 'flared';
        suctionCup = true;
        reasons.push("enabled suction cup flanged base");
      } else if (prompt.includes('harness') || prompt.includes('ring') || prompt.includes('strap')) {
        baseType = 'harness';
        suctionCup = false;
        reasons.push("selected Harness-ready base collar");
      } else if (prompt.includes('flat') || prompt.includes('desktop')) {
        baseType = 'flat';
        suctionCup = false;
        reasons.push("selected Flat base");
      }

      // AR Mode & Scenery matching
      if (prompt.includes('ar') || prompt.includes('camera') || prompt.includes('augmented') || prompt.includes('webcam')) {
        arMode = true;
        sceneEnvironment = 'studio';
        reasons.push("toggled Webcam AR Mode projection");
      }
      if (prompt.includes('shower') || prompt.includes('water') || prompt.includes('bathroom') || prompt.includes('wet')) {
        sceneEnvironment = 'shower';
        arMode = false;
        reasons.push("placed the toy in the Wet Shower environment");
      } else if (prompt.includes('case') || prompt.includes('box') || prompt.includes('luxury') || prompt.includes('package')) {
        sceneEnvironment = 'case';
        arMode = false;
        reasons.push("placed the toy in the Luxury Velvet Case environment");
      } else if (prompt.includes('studio') || prompt.includes('normal') || prompt.includes('default') || prompt.includes('room')) {
        sceneEnvironment = 'studio';
        reasons.push("reset scenery to Studio room environment");
      }

      setParams((prev) => ({
        ...prev,
        length,
        shaftGirth,
        baseGirth,
        curvature,
        texture,
        baseGeometry,
        colorMode,
        color1,
        color2,
        suctionCup,
        vibrationCore,
        isVibrating,
        shapeType,
        realisticVeins,
        realisticGlans,
        hasBalls,
        fantasyType,
        baseType,
        taper,
        firmness,
        inclusions,
        thermochromic,
        internalTube,
        blacklightMode,
        arMode,
        sceneEnvironment
      }));

      const responseText = `✨ BAD AI Assistant: Customization complete. Based on your prompt, I have ${reasons.join(', and ')}.`;
      setAiResponse(responseText);
      setIsAiThinking(false);
      setAiPrompt('');
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
    <div className="controls-panel animate-fade-in" style={{ gap: '20px', paddingBottom: '32px' }}>
      {/* Title */}
      <div>
        <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={10} /> {demoMode ? "Parametric CAD Mold Studio" : "Fully Personalized"}
        </span>
        <h2 style={{ marginTop: '8px', fontSize: '24px' }}>{demoMode ? "Sculpt Your Craft Mold" : "Sculpt Your Design"}</h2>
        <p style={{ fontSize: '13px' }}>
          {demoMode ? "Adjust dimensions, shapes, and textures of your mold template." : "Adjust dimensions, shapes, and aesthetics below."}
        </p>
      </div>

      <hr style={{ borderColor: 'var(--border-color)' }} />

      {/* AI PLEASURE / MOLD ARCHITECT CARD */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '4px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="var(--accent-gold)" style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' }} />
          <span style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', color: 'var(--accent-gold)' }}>
            {demoMode ? "AI MOLD ARCHITECT" : "AI PLEASURE ARCHITECT"}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
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
            placeholder={demoMode ? "e.g. spiral soy wax candle, yellow & blue marble..." : "e.g. beginner-friendly pink marble with suction..."} 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isAiThinking}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              outline: 'none',
              transition: 'border var(--transition-fast)'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isAiThinking}
            style={{ 
              padding: '8px 12px', 
              fontSize: '11px', 
              borderRadius: 'var(--radius-sm)',
              minWidth: '70px',
              height: '32px'
            }}
          >
            {isAiThinking ? '...' : 'Ask AI'}
          </button>
        </form>

        {/* AI Rationale Response Box */}
        {aiResponse && (
          <div 
            className="animate-fade-in"
            style={{
              marginTop: '12px',
              padding: '10px 12px',
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderLeft: '2px solid var(--accent-gold)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: '1.4'
            }}
          >
            {aiResponse}
          </div>
        )}
      </div>

      <hr style={{ borderColor: 'var(--border-color)' }} />

      {/* SECTION 1: SHAPE / CRAFT TYPE */}
      <div>
        {demoMode ? (
          <div>
            <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={15} color="var(--accent-gold)" /> 1. Use Scenario & Craft
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Craft Type Scenario</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'candle', label: 'Spiral Candle' },
                  { id: 'soap', label: 'Honeycomb Soap' },
                  { id: 'kitchen', label: 'Baking Cup' },
                  { id: 'collectible', label: 'Chibi Base' }
                ].map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    className={`btn ${params.shapeType === scenario.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 4px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => {
                      updateParam('shapeType', scenario.id);
                      if (scenario.id === 'candle') {
                        updateParam('texture', 'swirled');
                        updateParam('baseGeometry', 'classic');
                      } else if (scenario.id === 'soap') {
                        updateParam('texture', 'smooth');
                        updateParam('baseGeometry', 'classic');
                      } else if (scenario.id === 'kitchen') {
                        updateParam('texture', 'ribbed');
                        updateParam('baseGeometry', 'classic');
                      } else if (scenario.id === 'collectible') {
                        updateParam('texture', 'smooth');
                        updateParam('baseGeometry', 'classic');
                      }
                    }}
                  >
                    {scenario.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={15} color="var(--accent-gold)" /> 1. Shape & Anatomy
            </h3>

            {/* Shape Type Selector Buttons */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Silhouette Profile Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'classic', label: 'Classic Shaft' },
                  { id: 'realistic', label: 'Anatomical' },
                  { id: 'fantasy', label: 'Fantasy/Sci-Fi' },
                  { id: 'targeted', label: 'Targeted Curve' }
                ].map((shape) => (
                  <button
                    key={shape.id}
                    type="button"
                    className={`btn ${params.shapeType === shape.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 4px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => {
                      updateParam('shapeType', shape.id);
                      if (shape.id === 'targeted') {
                        updateParam('baseGeometry', 'ergonomic');
                        updateParam('curvature', 0.85);
                      } else {
                        updateParam('baseGeometry', 'classic');
                      }
                    }}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Anatomy Subsections */}
            {params.shapeType === 'realistic' && (
              <div className="animate-fade-in" style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700 }}>REALISTIC ANATOMICAL CONTROLS</span>
                
                {/* Vein Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Vein Prominence</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{Math.round(params.realisticVeins * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.0" 
                    max="1.0" 
                    step="0.05" 
                    value={params.realisticVeins} 
                    onChange={(e) => updateParam('realisticVeins', parseFloat(e.target.value))} 
                  />
                </div>

                {/* Glans shape */}
                <label className="switch-label">
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>Defined Glans Head</span>
                  <div className="switch">
                    <input 
                      type="checkbox" 
                      checked={params.realisticGlans} 
                      onChange={(e) => updateParam('realisticGlans', e.target.checked)} 
                    />
                    <span className="slider"></span>
                  </div>
                </label>

                {/* Testicles */}
                <label className="switch-label">
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>Optional Testicle Base</span>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Adds dual base spheres. (+ $20.00)</p>
                  </div>
                  <div className="switch">
                    <input 
                      type="checkbox" 
                      checked={params.hasBalls} 
                      onChange={(e) => updateParam('hasBalls', e.target.checked)} 
                    />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>
            )}

            {params.shapeType === 'fantasy' && (
              <div className="animate-fade-in" style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>FANTASY STYLE OPTIONS</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'dragon', label: 'Dragon', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 3.5-3 3.5 3 3.5-3 3.5-3-3.5 3-3.5-3-3.5zM6 5.5h12M6 12.5h12"/></svg>
                    )},
                    { id: 'alien', label: 'Alien', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="5" ry="8"/><path d="M8 11.5s1-1 4-1 4 1 4 1"/></svg>
                    )},
                    { id: 'tentacle', label: 'Tentacle', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-3 4-3 12 0 20M12 6c-2 0-3 1-3 2s1 2 3 2M12 14c-2 0-3 1-3 2s1 2 3 2"/></svg>
                    )}
                  ].map((fan) => (
                    <button
                      key={fan.id}
                      type="button"
                      className={`btn ${params.fantasyType === fan.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ 
                        padding: '8px 4px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '4px', 
                        borderRadius: 'var(--radius-sm)',
                        height: '56px'
                      }}
                      onClick={() => {
                        updateParam('fantasyType', fan.id);
                        if (fan.id === 'dragon') updateParam('texture', 'swirled');
                        if (fan.id === 'alien') updateParam('texture', 'studded');
                        if (fan.id === 'tentacle') updateParam('texture', 'ribbed');
                      }}
                      title={fan.label}
                    >
                      {fan.icon}
                      <span style={{ fontSize: '9px', fontWeight: 600 }}>{fan.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Base Design Style Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Base Safety Anchor</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { id: 'flared', label: 'Suction', icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v10M4 21h16c0-3-2-6-8-6s-8 3-8 6z"/></svg>
                  )},
                  { id: 'flat', label: 'Flat Base', icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13M3 21h18v-4H3v4z"/></svg>
                  )},
                  { id: 'harness', label: 'Harness', icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v9M6 18c0-2 2.7-3.5 6-3.5s6 1.5 6 3.5M3 21h18"/></svg>
                  )}
                ].map((base) => (
                  <button
                    key={base.id}
                    type="button"
                    className={`btn ${params.baseType === base.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ 
                      padding: '8px 4px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '4px', 
                      borderRadius: 'var(--radius-sm)',
                      height: '56px'
                    }}
                    onClick={() => {
                      updateParam('baseType', base.id);
                      updateParam('suctionCup', base.id === 'flared');
                    }}
                    title={base.label}
                  >
                    {base.icon}
                    <span style={{ fontSize: '9px', fontWeight: 600 }}>{base.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tactile Texture Selector */}
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            {demoMode ? "Tactile Surface Motif" : "Tactile Surface Texture Motif"}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {[
              { id: 'smooth', label: 'Smooth', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c5-4 15-4 20 0"/></svg>
              )},
              { id: 'ribbed', label: 'Ribbed', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14M5 11h14M5 15h14M5 19h14"/></svg>
              )},
              { id: 'swirled', label: 'Swirled', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20c4-12 12-12 16 0M4 4c4 12 12 12 16 0"/></svg>
              )},
              { id: 'studded', label: 'Studded', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="1.5" fill="currentColor"/><circle cx="18" cy="6" r="1.5" fill="currentColor"/><circle cx="6" cy="18" r="1.5" fill="currentColor"/><circle cx="18" cy="18" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>
              )}
            ].map((tex) => (
              <button
                key={tex.id}
                type="button"
                className={`btn ${params.texture === tex.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  padding: '8px 4px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '4px', 
                  borderRadius: 'var(--radius-sm)',
                  height: '56px'
                }}
                onClick={() => updateParam('texture', tex.id)}
                title={tex.label}
              >
                {tex.icon}
                <span style={{ fontSize: '9px', fontWeight: 600 }}>{tex.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)' }} />

      {/* SECTION 2: DIMENSIONS */}
      <div>
        <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Ruler size={15} color="var(--accent-gold)" /> 2. Dimensions & Sculpting
        </h3>

        {/* Length Slider */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? "Height" : "Insertable Length"}</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{params.length.toFixed(1)}"</span>
          </div>
          <input 
            type="range" 
            min="4.0" 
            max="8.0" 
            step="0.1" 
            value={params.length} 
            onChange={(e) => updateParam('length', parseFloat(e.target.value))} 
          />
        </div>

        {/* Shaft Girth Slider */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? "Body Width" : "Shaft Diameter (Girth)"}</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{params.shaftGirth.toFixed(2)}x</span>
          </div>
          <input 
            type="range" 
            min="0.8" 
            max="2.2" 
            step="0.05" 
            value={params.shaftGirth} 
            onChange={(e) => updateParam('shaftGirth', parseFloat(e.target.value))} 
          />
        </div>

        {/* Base Girth Slider */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? "Base Width" : "Base Flange Width"}</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{params.baseGirth.toFixed(2)}x</span>
          </div>
          <input 
            type="range" 
            min="1.0" 
            max="2.5" 
            step="0.05" 
            value={params.baseGirth} 
            onChange={(e) => updateParam('baseGirth', parseFloat(e.target.value))} 
          />
        </div>

        {/* Taper Slider */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? "Taper Angle" : "Widening Taper Profile"}</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
              {demoMode ? `${Math.round(params.taper * 100)}%` : (params.taper === 0 ? 'Straight cylindrical' : params.taper < 0.4 ? 'Soft Taper' : 'Steep/Cone Taper')}
            </span>
          </div>
          <input 
            type="range" 
            min="0.0" 
            max="1.0" 
            step="0.05" 
            value={params.taper} 
            onChange={(e) => updateParam('taper', parseFloat(e.target.value))} 
          />
        </div>

        {/* Curvature Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? "Sweep Curvature" : "Shaft Curvature"}</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
              {params.curvature === 0 ? 'Straight' : params.curvature > 0 ? 'Forward Bend' : 'Reverse Bend'}
            </span>
          </div>
          <input 
            type="range" 
            min="-1.5" 
            max="1.5" 
            step="0.1" 
            value={params.curvature} 
            onChange={(e) => updateParam('curvature', parseFloat(e.target.value))} 
          />
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)' }} />

      {/* SECTION 3: FIRMNESS & DENSITY */}
      <div>
        <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sliders size={15} color="var(--accent-gold)" /> 3. {demoMode ? "Silicone Mold Hardness" : "Firmness & Density"}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
          {(demoMode ? [
            { id: 'soft', label: 'Highly Flexible (Shore 10A)', sub: 'Baking/Muffin Cups' },
            { id: 'medium', label: 'Medium Firm (Shore 20A)', sub: 'Soap/Candle Molds' },
            { id: 'firm', label: 'Rigid Structure (Shore 40A)', sub: 'Industrial Casings' },
            { id: 'dual-density', label: 'High-Density Shell', sub: 'Supported Sleeves' }
          ] : [
            { id: 'soft', label: 'Soft (Shore 10A)', sub: 'Flexible/Squishy' },
            { id: 'medium', label: 'Medium (Shore 20A)', sub: 'Realistic Tissue' },
            { id: 'firm', label: 'Firm (Shore 40A)', sub: 'Rigid/Intense' },
            { id: 'dual-density', label: 'Dual-Density', sub: 'Rigid Core + Soft Shell' }
          ]).map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`btn ${params.firmness === mode.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', borderRadius: 'var(--radius-sm)' }}
              onClick={() => updateParam('firmness', mode.id)}
            >
              <span style={{ fontSize: '11px', fontWeight: 600 }}>{mode.label}</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{mode.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)' }} />

      {/* SECTION 4: COLOR & AESTHETICS */}
      <div>
        <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Palette size={15} color="var(--accent-gold)" /> 4. Color Pour & Effects
        </h3>

        {/* Color Pour Mode */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Color Pour Technique</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {['Solid Color', 'Marble Swirl', 'Duo Gradient', 'Split Pour'].map((mode, index) => (
              <button
                key={mode}
                type="button"
                className={`btn ${params.colorMode === index ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 4px', fontSize: '10px', borderRadius: 'var(--radius-sm)' }}
                onClick={() => updateParam('colorMode', index)}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Color Swatch A */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {params.colorMode === 0 ? 'Silicone Pigment' : 'Color A (Base)'}
          </label>
          <div className="swatch-group">
            {PREMIUM_COLORS.map((col) => (
              <div 
                key={col.hex}
                className={`swatch ${params.color1 === col.hex ? 'active' : ''}`}
                style={{ backgroundColor: col.hex }}
                onClick={() => updateParam('color1', col.hex)}
                title={col.name}
              />
            ))}
          </div>
        </div>

        {/* Color Swatch B (Marble / Gradient / Split) */}
        {params.colorMode > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Color B (Blend / Split)</label>
            <div className="swatch-group">
              {PREMIUM_COLORS.map((col) => (
                <div 
                  key={col.hex}
                  className={`swatch ${params.color2 === col.hex ? 'active' : ''}`}
                  style={{ backgroundColor: col.hex }}
                  onClick={() => updateParam('color2', col.hex)}
                  title={col.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Inclusions Dropdown */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Material Inclusions & Shimmer</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {[
              { id: 'none', label: 'Pure', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" strokeDasharray="3 3"/></svg>
              )},
              { id: 'glitter', label: 'Glitter', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18M7.5 7.5l9 9M7.5 16.5l9-9"/></svg>
              )},
              { id: 'metallic', label: 'Metallic', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21L21 3M9 21L21 9M3 15L15 3"/></svg>
              )},
              { id: 'glow', label: 'Glow', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5l1.5 1.5M5 19l1.5-1.5M17.5 6.5l1.5-1.5"/></svg>
              )}
            ].map((inc) => (
              <button
                key={inc.id}
                type="button"
                className={`btn ${params.inclusions === inc.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  padding: '8px 4px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '4px', 
                  borderRadius: 'var(--radius-sm)',
                  height: '56px'
                }}
                onClick={() => {
                  updateParam('inclusions', inc.id);
                  if (inc.id === 'glow') {
                    updateParam('blacklightMode', true);
                  }
                }}
                title={inc.label}
              >
                {inc.icon}
                <span style={{ fontSize: '9px', fontWeight: 600 }}>{inc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Thermochromic toggle */}
        <div style={{ marginBottom: '14px' }}>
          <label className="switch-label">
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>Thermochromic Color Shift</span>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Changes color based on body heat. (+ $18.00)</p>
            </div>
            <div className="switch">
              <input 
                type="checkbox" 
                checked={params.thermochromic} 
                onChange={(e) => updateParam('thermochromic', e.target.checked)} 
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>

        {/* Blacklight environment view mode toggle */}
        <div>
          <label className="switch-label" style={{ border: '1px solid rgba(217, 70, 239, 0.2)', padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(217, 70, 239, 0.02)' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-pink)' }}>Toggle Blacklight Mode</span>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Dims studio lights to view UV glow effects.</p>
            </div>
            <div className="switch switch-pink">
              <input 
                type="checkbox" 
                checked={params.blacklightMode} 
                onChange={(e) => updateParam('blacklightMode', e.target.checked)} 
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>
      </div>

      {/* SECTION 5: FUNCTIONAL ENHANCEMENTS */}
      {!demoMode && (
        <>
          <hr style={{ borderColor: 'var(--border-color)' }} />
          <div>
            <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Heart size={15} color="var(--accent-gold)" /> 5. Functional Enhancements
            </h3>

            {/* Ejaculation tubes */}
            <div style={{ marginBottom: '16px' }}>
              <label className="switch-label">
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>Internal Ejaculation Tube</span>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Enables fluid delivery core. (+ $25.00)</p>
                </div>
                <div className="switch">
                  <input 
                    type="checkbox" 
                    checked={params.internalTube} 
                    onChange={(e) => updateParam('internalTube', e.target.checked)} 
                  />
                  <span className="slider"></span>
                </div>
              </label>
            </div>

            {/* Vibration bullet pocket */}
            <div style={{ marginBottom: '16px' }}>
              <label className="switch-label">
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>Vibrating Bullet Chamber</span>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Embeds removable bullet receiver. (+ $25.00)</p>
                </div>
                <div className="switch">
                  <input 
                    type="checkbox" 
                    checked={params.vibrationCore} 
                    onChange={(e) => {
                      updateParam('vibrationCore', e.target.checked);
                      if (!e.target.checked) updateParam('isVibrating', false);
                    }} 
                  />
                  <span className="slider"></span>
                </div>
              </label>
            </div>

            {/* Live Test Vibrations (Only if Vibration Core enabled) */}
            {params.vibrationCore && (
              <div className="animate-fade-in">
                <button 
                  type="button"
                  className={`btn ${params.isVibrating ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ width: '100%', fontSize: '12px', padding: '8px' }}
                  onClick={() => updateParam('isVibrating', !params.isVibrating)}
                >
                  {params.isVibrating ? "Stop Test Vibration" : "Live Test Vibration Signal"}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* SECTION: CUSTOM ENGRAVING & BRANDING */}
      <hr style={{ borderColor: 'var(--border-color)' }} />
      <div>
        <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Type size={15} color="var(--accent-gold)" /> {demoMode ? "5. Custom Branding & Text" : "6. Custom Engraving & Text"}
        </h3>
        
        {/* Style Selection */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Engraving Style
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { id: 'none', label: 'None' },
              { id: 'embossed', label: 'Embossed (Raised)' },
              { id: 'engraved', label: 'Engraved (Carved)' }
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                className={`btn ${params.engraveStyle === style.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 4px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                onClick={() => updateParam('engraveStyle', style.id)}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {params.engraveStyle !== 'none' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Text Input */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Text Label (Max 15 Characters)
              </label>
              <input
                type="text"
                value={params.engraveText}
                maxLength={15}
                onChange={(e) => updateParam('engraveText', e.target.value)}
                placeholder="e.g. BRANDNAME"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            {/* Vertical Position Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Vertical Position</span>
                <span style={{ fontWeight: 600 }}>{Math.round(params.engravePosition * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.85"
                step="0.01"
                value={params.engravePosition}
                onChange={(e) => updateParam('engravePosition', parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Text Font Size Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Font Size</span>
                <span style={{ fontWeight: 600 }}>{params.engraveSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="64"
                step="1"
                value={params.engraveSize}
                onChange={(e) => updateParam('engraveSize', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Engraving Depth Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Displacement Depth</span>
                <span style={{ fontWeight: 600 }}>{(params.engraveDepth * 2.5).toFixed(2)} mm</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={params.engraveDepth}
                onChange={(e) => updateParam('engraveDepth', parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: SCENERY & AR VIEW */}
      <hr style={{ borderColor: 'var(--border-color)' }} />
      <div>
        <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Eye size={15} color="var(--accent-gold)" /> {demoMode ? "6. Scenery & AR View" : "7. Scenery & AR View"}
        </h3>

        {/* Webcam AR Mode Toggle */}
        <div style={{ marginBottom: '16px' }}>
          <label className="switch-label">
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>Live Webcam AR Mode</span>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Projects model into your room using camera.</p>
            </div>
            <div className="switch">
              <input 
                type="checkbox" 
                checked={params.arMode} 
                onChange={(e) => {
                  updateParam('arMode', e.target.checked);
                  if (e.target.checked) {
                    updateParam('sceneEnvironment', 'studio');
                  }
                }} 
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>

        {/* Scenery Environment Selectors */}
        {!params.arMode && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Scenery Situation
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { 
                  id: 'studio', 
                  label: 'Studio', 
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  )
                },
                { 
                  id: 'shower', 
                  label: 'Shower', 
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16v2H4z" />
                      <path d="M12 6v6" />
                      <path d="M8 12h8v2H8z" />
                      <path d="M9 16v2" />
                      <path d="M12 16v4" />
                      <path d="M15 16v2" />
                    </svg>
                  )
                },
                { 
                  id: 'case', 
                  label: 'Luxury Case', 
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  )
                }
              ].map((env) => (
                <button
                  key={env.id}
                  type="button"
                  className={`btn ${params.sceneEnvironment === env.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ 
                    padding: '10px 4px', 
                    fontSize: '11px', 
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onClick={() => updateParam('sceneEnvironment', env.id)}
                >
                  {env.icon}
                  <span>{env.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr style={{ borderColor: 'var(--border-color)', marginTop: 'auto' }} />

      {/* View scale compare notice toggle */}
      <div style={{ marginBottom: '8px' }}>
        <label className="switch-label">
          <div>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>Compare Physical Scale</span>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Overlay 5.8" smartphone wireframe next to model.</p>
          </div>
          <div className="switch">
            <input 
              type="checkbox" 
              checked={params.showScaleRef} 
              onChange={(e) => updateParam('showScaleRef', e.target.checked)} 
            />
            <span className="slider"></span>
          </div>
        </label>
      </div>

      {/* Pricing and Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Calculated Price:</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
            ${currentPrice.toFixed(2)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button"
            className="btn btn-secondary" 
            style={{ padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={handleShareToSocial}
            title="Share Design to BAD Gallery"
          >
            <Share2 size={18} />
          </button>
          <button 
            type="button"
            className="btn btn-secondary" 
            style={{ padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}
            onClick={handleExportSTL}
            title="Export STL Schematic for Home 3D Printing"
          >
            <Layers size={18} /> Export STL
          </button>
          <button 
            type="button"
            className="btn btn-secondary" 
            style={{ padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, borderColor: 'var(--accent-gold)' }}
            onClick={() => window.dispatchEvent(new CustomEvent('export-hires'))}
            title="Export Hi-Res Render Spec Sheet Card"
          >
            <Camera size={18} color="var(--accent-gold)" /> Hi-Res Render
          </button>
          <button 
            type="button"
            className="btn btn-primary" 
            style={{ flex: 1, padding: '12px', gap: '8px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '13px', fontWeight: 600 }}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} /> Add to Order
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
          <ShieldCheck size={14} /> {demoMode ? "Food-Safe Platinum Silicone | Heat Resistant" : "Medical-Grade Platinum Silicone | Cruelty Free"}
        </div>
      </div>
    </div>
  );
};
