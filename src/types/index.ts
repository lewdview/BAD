// ─────────────────────────────────────────────────────────────
// BAD — Shared Type Definitions
// Single source of truth for all domain types used across components.
// ─────────────────────────────────────────────────────────────

// ── Navigation & App State ────────────────────────────────────

export type ActiveTab = 'storefront' | 'builder' | 'social' | 'admin' | 'pitch' | 'acquisition';

// ── Order Status Workflow ─────────────────────────────────────

export type OrderStatus =
  | 'Pending Mold'
  | 'Printing'
  | 'Silicone Pouring'
  | 'Shaving/Curing'
  | 'Ready for Shipment';

// ── Builder Parameter Types ───────────────────────────────────

export type BaseGeometry = 'classic' | 'ergonomic' | 'wave';

export type TextureType = 'smooth' | 'ribbed' | 'swirled' | 'studded';

export type ShapeType =
  | 'classic'
  | 'realistic'
  | 'fantasy'
  | 'targeted'
  | 'abstract'
  | 'candle'
  | 'soap'
  | 'kitchen'
  | 'collectible';

export type FantasyType = 'dragon' | 'alien' | 'tentacle';

export type BaseType = 'flared' | 'flat' | 'harness';

export type Firmness = 'soft' | 'medium' | 'firm' | 'dual-density';

export type Inclusions = 'none' | 'glitter' | 'metallic' | 'glow';

export type ColorMode = 0 | 1 | 2 | 3; // 0=Solid, 1=Marble, 2=Gradient, 3=Split Pour

export type SceneEnvironment = 'studio' | 'shower' | 'case';

export type EngraveStyle = 'none' | 'embossed' | 'engraved';

// ── Builder Parameters (3D Configurator) ──────────────────────

export interface BuilderParams {
  baseGeometry: BaseGeometry;
  length: number;
  shaftGirth: number;
  baseGirth: number;
  curvature: number;
  texture: TextureType;
  suctionCup: boolean;
  vibrationCore: boolean;
  colorMode: ColorMode;
  color1: string;
  color2: string;
  isVibrating: boolean;
  showScaleRef: boolean;
  shapeType: ShapeType;
  realisticVeins: number;
  realisticGlans: boolean;
  hasBalls: boolean;
  fantasyType: FantasyType;
  baseType: BaseType;
  taper: number;
  firmness: Firmness;
  inclusions: Inclusions;
  thermochromic: boolean;
  internalTube: boolean;
  blacklightMode: boolean;
  arMode: boolean;
  sceneEnvironment: SceneEnvironment;
  engraveText?: string;
  engraveStyle?: EngraveStyle;
  engravePosition?: number;
  engraveSize?: number;
  engraveDepth?: number;
  isCore?: boolean;
  ballSize?: number;
  ballAsymmetry?: number;
}

// ── Cart & Commerce ───────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  price: number;
  isCustom?: boolean;
  parameters?: BuilderParams;
  quantity: number;
}

// ── Product Catalog ───────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: string;
}

// ── Orders ────────────────────────────────────────────────────

export interface OrderItem {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerCity?: string;
  customerZip?: string;
  items: CartItem[];
  subtotal: number;
  date: string;
  status: OrderStatus;
}

// ── Social Feed ───────────────────────────────────────────────

export interface SocialPost {
  id: string;
  creator: string;
  designName: string;
  likes: number;
  hasLiked: boolean;
  price: number;
  parameters: BuilderParams;
  commentsCount: number;
}

// ── Color Presets ─────────────────────────────────────────────

export interface ColorPreset {
  name: string;
  hex: string;
}

// ── Geometry Helpers ──────────────────────────────────────────

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

// ── Accordion Section ID (BuilderControls) ────────────────────

export type BuilderSection =
  | 'shape'
  | 'dimensions'
  | 'firmness'
  | 'color'
  | 'functional'
  | 'engraving'
  | 'scenery'
  | null;

export type UpdateParamFn = <K extends keyof BuilderParams>(key: K, value: BuilderParams[K]) => void;
