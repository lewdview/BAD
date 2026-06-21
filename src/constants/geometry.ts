// ─────────────────────────────────────────────────────────────
// Geometry Constants — Shared numeric constants for 3D rendering
// Used by ThreeCanvas and stlGenerator.
// ─────────────────────────────────────────────────────────────

/** Radial segments for lathe geometry in live preview */
export const PREVIEW_RADIAL_SEGMENTS = 128;

/** Height segments for lathe geometry in live preview */
export const PREVIEW_HEIGHT_SEGMENTS = 128;

/** Radial segments for STL export (higher quality) */
export const EXPORT_RADIAL_SEGMENTS = 32;

/** Height segments for STL export */
export const EXPORT_HEIGHT_SEGMENTS = 64;

/** Ball radius relative to shaft girth */
export const BALL_RADIUS_RATIO = 0.5;

/** Ball lateral offset relative to shaft girth */
export const BALL_LATERAL_OFFSET = 0.55;

/** Ball Y offset below the base */
export const BALL_Y_OFFSET = -0.35;

/** Suction cup dimensions */
export const SUCTION_CUP = {
  radiusTop: 0.55,
  radiusBottom: 0.75,
  height: 0.15,
} as const;

/** Screenshot export dimensions */
export const SCREENSHOT_SIZE = {
  width: 2400,
  height: 1800,
} as const;

/** Shape type to numeric enum mapping (for GLSL uniforms) */
export const SHAPE_TYPE_MAP: Record<string, number> = {
  classic: 0.0,
  realistic: 1.0,
  fantasy: 2.0,
  targeted: 3.0,
  candle: 4.0,
  soap: 5.0,
  kitchen: 6.0,
  collectible: 7.0,
};

/** Firmness to numeric enum mapping (for GLSL uniforms) */
export const FIRMNESS_MAP: Record<string, number> = {
  soft: 0.0,
  medium: 1.0,
  firm: 2.0,
  'dual-density': 3.0,
};

/** Inclusions to numeric enum mapping (for GLSL uniforms) */
export const INCLUSIONS_MAP: Record<string, number> = {
  none: 0.0,
  glitter: 1.0,
  metallic: 2.0,
  glow: 3.0,
};

/** Base type to numeric enum mapping (for GLSL uniforms) */
export const BASE_TYPE_MAP: Record<string, number> = {
  flared: 0.0,
  flat: 1.0,
  harness: 2.0,
};

/** Fantasy type to numeric enum mapping (for GLSL uniforms) */
export const FANTASY_TYPE_MAP: Record<string, number> = {
  dragon: 0.0,
  alien: 1.0,
  tentacle: 2.0,
};

/** Engrave style to numeric enum mapping (for GLSL uniforms) */
export const ENGRAVE_STYLE_MAP: Record<string, number> = {
  none: 0.0,
  embossed: 1.0,
  engraved: 2.0,
};
