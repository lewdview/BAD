import { describe, it, expect } from 'vitest';
import { getParametricVertex } from './geometryCore';
import type { BuilderParams } from '../types';

// Helper to simulate the WebGL vertex shader math in Javascript
function getShaderSimulatedVertex(params: BuilderParams, normY: number, angle: number): { x: number, y: number, z: number } {
  const uLength = params.length;
  const uShaftGirth = params.shaftGirth;
  const uBaseGirth = params.baseGirth;
  const uCurvature = params.curvature;
  const uCurvatureAngle = params.curvatureAngle || 0;
  const uBaseGeometry = params.baseGeometry;
  const uShapeType = params.shapeType === 'classic' ? 0.0 : 
                     params.shapeType === 'realistic' ? 1.0 : 
                     params.shapeType === 'fantasy' ? 2.0 : 
                     params.shapeType === 'targeted' ? 3.0 : 
                     params.shapeType === 'candle' ? 4.0 : 
                     params.shapeType === 'soap' ? 5.0 : 
                     params.shapeType === 'kitchen' ? 6.0 : 7.0;
  const uHeadType = params.headType === 'classic' ? 0.0 : 
                    params.headType === 'realistic' ? 1.0 : 
                    params.headType === 'bulbous' ? 2.0 : 
                    params.headType === 'tapered' ? 3.0 : 
                    params.headType === 'alien' ? 4.0 : 5.0;
  const uHeadScale = params.headScale !== undefined ? params.headScale : 1.0;
  const uFantasyType = params.fantasyType === 'dragon' ? 0.0 : params.fantasyType === 'alien' ? 1.0 : 2.0;
  const uBaseType = params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0;
  const uTaper = params.taper;
  const uHasOrifice = params.hasOrifice ? 1.0 : 0.0;
  const uOrificeType = params.orificeType === 'vaginal' ? 0.0 : params.orificeType === 'anal' ? 1.0 : 2.0;
  const uOrificeDepth = params.orificeDepth || 0.4;
  const uSuctionCup = params.suctionCup ? 1.0 : 0.0;

  const pos = {
    x: Math.cos(angle),
    y: normY - 0.5,
    z: Math.sin(angle)
  };

  const isCore = params.isCore || false;
  const uMeshType = isCore ? 1.0 : 0.0; // 0.0 = outer shaft, 1.0 = inner core

  let normY_mapped = normY;
  if (uMeshType > 0.5 && uMeshType < 1.5 && uHasOrifice > 0.5) {
    const maxCoreHeight = 1.0 - uOrificeDepth - 0.08;
    normY_mapped = normY * maxCoreHeight;
    pos.y = normY_mapped - 0.5;
  }

  let isOrificeCavity = false;
  if (uHasOrifice > 0.5 && (uMeshType < 0.5 || uMeshType > 1.5)) {
    const transitionNormY = 0.85;
    if (normY < transitionNormY) {
      normY_mapped = normY / transitionNormY;
      pos.y = normY_mapped - 0.5;
    } else {
      isOrificeCavity = true;
      const t_inner = (normY - transitionNormY) / (1.0 - transitionNormY);
      pos.y = 0.5 - uOrificeDepth * t_inner;
    }
  }

  const r_entrance = 0.16 * uShaftGirth;
  let shapeScale = uShaftGirth;

  if (isOrificeCavity) {
    const t_inner = (normY - 0.85) / 0.15;
    shapeScale = r_entrance * (1.0 - t_inner);
    const factor = uOrificeType === 0.0
      ? 1.0 + 0.16 * Math.sin(t_inner * 18.0) * (1.0 - t_inner)
      : uOrificeType === 1.0
      ? 1.0 + 0.22 * Math.sin(t_inner * 28.0) * (1.0 - t_inner)
      : 1.0 + 0.12 * Math.sin(t_inner * 12.0) * (1.0 - t_inner);
    shapeScale *= factor;
  } else {
    if (uShapeType < 3.5) {
      // Apply base profile
      if (normY_mapped < 0.25) {
        const t = normY_mapped / 0.25;
        if (uBaseType === 0.0) {
          // Flared Suction Cup
          shapeScale = uBaseGirth * (1.0 - t) + uShaftGirth * t;
          if (uSuctionCup > 0.5 && normY_mapped < 0.1) {
            const t2 = normY_mapped / 0.1;
            const flare = Math.pow(1.0 - t2, 2.2);
            shapeScale = uBaseGirth * (1.0 - flare) + (uBaseGirth * 2.3) * flare;
          }
        } else if (uBaseType === 1.0) {
          // Flat base
          shapeScale = uBaseGirth;
        } else if (uBaseType === 2.0) {
          // Harness collar
          let groove = 0.0;
          if (normY_mapped > 0.08 && normY_mapped < 0.22) {
            const gt = (normY_mapped - 0.08) / 0.14;
            groove = 0.22 * Math.sin(gt * Math.PI);
          }
          shapeScale = (uBaseGirth * (1.0 - t) + uShaftGirth * t) - groove * uShaftGirth;
        }
      } 
      // Head curvature details
      else if (normY_mapped > 0.76) {
        const t = (normY_mapped - 0.76) / 0.24;
        let ridge = 0.0;
        const dome = Math.sqrt(Math.max(0.0, 1.0 - Math.pow(t, 2.0)));
        let headRadius = uShaftGirth;
        
        if (uHeadType === 0.0) { // classic
          if (t < 0.25) ridge = 0.14 * Math.sin((t / 0.25) * Math.PI);
          headRadius = (uShaftGirth + ridge) * dome;
        } else if (uHeadType === 1.0) { // realistic
          const cleft = 0.035 * Math.cos(angle * 2.0);
          if (t < 0.25) ridge = 0.18 * Math.sin((t / 0.25) * Math.PI);
          headRadius = (uShaftGirth + ridge + cleft) * dome;
        } else if (uHeadType === 2.0) { // bulbous
          const bulb = 0.35 * uShaftGirth * Math.sin(t * Math.PI * 0.75);
          if (t < 0.2) ridge = 0.08 * uShaftGirth * Math.sin((t / 0.2) * Math.PI);
          headRadius = (uShaftGirth * 1.1 + ridge + bulb) * dome;
        } else if (uHeadType === 3.0) { // tapered
          headRadius = uShaftGirth * dome * (1.0 - t * 0.35);
        } else if (uHeadType === 4.0) { // alien
          let alienRidge = 0.0;
          if (t < 0.25) alienRidge = 0.16 * uShaftGirth * Math.sin((t / 0.25) * Math.PI);
          else if (t > 0.4 && t < 0.65) alienRidge = 0.12 * uShaftGirth * Math.sin(((t - 0.4) / 0.25) * Math.PI);
          headRadius = (uShaftGirth + alienRidge) * dome;
        } else if (uHeadType === 5.0) { // dragon
          let dragonRidge = 0.0;
          if (t < 0.3) dragonRidge = 0.18 * uShaftGirth * Math.sin((t / 0.3) * Math.PI);
          const segment = 0.08 * uShaftGirth * Math.sin(t * Math.PI * 3.0);
          headRadius = (uShaftGirth + dragonRidge + segment) * dome;
        }
        
        let scaleBlend = Math.min(Math.max((t - 0.0) / 0.25, 0.0), 1.0);
        scaleBlend = scaleBlend * scaleBlend * (3.0 - 2.0 * scaleBlend);
        const currentScale = mix(1.0, uHeadScale, scaleBlend);
        
        if (uHasOrifice > 0.5) {
          shapeScale = mix(r_entrance, headRadius * currentScale, 1.0 - Math.pow(t, 4.0));
        } else {
          shapeScale = headRadius * currentScale;
        }
      }
    }

    // Taper
    const taperScale = mix(1.0 + uTaper * 0.20, 1.0 - uTaper * 0.45, normY_mapped);
    shapeScale *= taperScale;

    // Custom Shapes
    if (uShapeType === 4.0) {
      shapeScale += 0.12 * Math.sin(angle * 6.0);
    } else if (uShapeType === 5.0) {
      const cos4 = Math.cos(angle * 4.0);
      shapeScale *= (1.0 - 0.16 * cos4);
      if (normY_mapped < 0.15) {
        shapeScale *= smoothstep(0.0, 1.0, normY_mapped / 0.15);
      }
      if (normY_mapped > 0.85) {
        shapeScale *= smoothstep(0.0, 1.0, (1.0 - normY_mapped) / 0.15);
      }
    } else if (uShapeType === 6.0) {
      shapeScale = uShaftGirth * (0.7 + normY_mapped * 0.9);
      shapeScale += 0.07 * Math.sin(angle * 18.0) * (0.2 + normY_mapped * 0.8);
      if (normY_mapped < 0.1) {
        shapeScale *= smoothstep(0.0, 1.0, normY_mapped / 0.1);
      }
    } else if (uShapeType === 7.0) {
      const getProfileAndOffset = () => {
        if (normY_mapped < 0.2) {
          const t = normY_mapped / 0.2;
          const oct = 0.04 * Math.cos(angle * 8.0);
          return { profile: 1.4 - 0.2 * t + oct, offset: 0.0 };
        } else if (normY_mapped < 0.55) {
          const t = (normY_mapped - 0.2) / 0.35;
          const armProtrusion = 0.18 * Math.pow(Math.sin(t * Math.PI), 1.5) * Math.max(0.0, Math.cos(angle * 2.0));
          return { profile: 1.0 - 0.3 * Math.sin(t * Math.PI), offset: armProtrusion };
        } else {
          const t = (normY_mapped - 0.55) / 0.45;
          const headRadiusFactor = 1.25;
          let offset = 0.0;
          if (t > 0.7 && t < 0.95) {
            const earT = (t - 0.7) / 0.25;
            const earAngleFactor = Math.max(0.0, Math.cos(angle * 4.0 - Math.PI));
            offset += 0.22 * Math.sin(earT * Math.PI) * earAngleFactor;
          }
          if (t > 0.3 && t < 0.6) {
            const faceT = (t - 0.3) / 0.3;
            const frontFactor = Math.max(0.0, -Math.sin(angle));
            offset += 0.08 * Math.sin(faceT * Math.PI) * Math.pow(frontFactor, 4.0);
          }
          return { profile: headRadiusFactor * Math.sqrt(Math.max(0.0, 1.0 - Math.pow(t * 2.0 - 1.0, 2.0))), offset };
        }
      };
      const { profile, offset } = getProfileAndOffset();
      shapeScale = uShaftGirth * (profile + offset);
      pos.x = Math.cos(angle);
      pos.z = Math.sin(angle);
    }
    // Fantasy Geometries
    else if (uShapeType === 2.0) {
      if (normY_mapped >= 0.25 && normY_mapped <= 0.76) {
        const yVal = pos.y;
        if (uFantasyType === 0.0) {
          const dragonKnot = 0.14 * Math.sin(yVal * 2.5);
          const scaleBump = 0.07 * Math.cos(angle * 5.0 + yVal * 9.0);
          shapeScale += dragonKnot + scaleBump;
        } else if (uFantasyType === 1.0) {
          const alienRidge = 0.16 * Math.sin(yVal * 3.5);
          const alienBumps = 0.04 * Math.sin(angle * 3.0 + yVal * 2.0);
          shapeScale += alienRidge + alienBumps;
        } else if (uFantasyType === 2.0) {
          const spiral = Math.sin(yVal * 5.5 - angle * 2.0);
          shapeScale += 0.12 * smoothstep(0.0, 1.0, spiral);
        }
      }
    } else {
      if (uBaseGeometry === 'wave') {
        if (normY_mapped >= 0.25 && normY_mapped <= 0.76) {
          shapeScale += Math.sin((normY_mapped - 0.25) * 22.0) * 0.07;
        }
      } else if (uBaseGeometry === 'ergonomic') {
        if (normY_mapped > 0.4 && normY_mapped < 0.76) {
          shapeScale -= Math.sin((normY_mapped - 0.4) / 0.36 * Math.PI) * 0.14;
        }
      }
    }
  }

  // Apply inner core scaling
  if (uMeshType > 0.5 && uMeshType < 1.5) {
    let innerScale = 0.46;
    if (normY_mapped > 0.82) {
      const cap = (1.0 - normY_mapped) / 0.18;
      innerScale *= cap;
    }
    shapeScale *= innerScale;
  }

  pos.x *= shapeScale;
  pos.z *= shapeScale;

  // Twist for Candle
  if (!isOrificeCavity && uShapeType === 4.0) {
    const thetaVal = normY_mapped * Math.PI * 2.0; 
    const c = Math.cos(thetaVal);
    const s = Math.sin(thetaVal);
    const rx = pos.x * c - pos.z * s;
    const rz = pos.x * s + pos.z * c;
    pos.x = rx;
    pos.z = rz;
  }

  const normY_physical = pos.y + 0.5;

  // Flat-head flattening
  if ((uBaseGeometry === 'ergonomic' || uShapeType === 3.0) && normY_physical > 0.6) {
    const flatFactor = (normY_physical - 0.6) / 0.4;
    pos.z *= (1.0 - flatFactor * 0.28);
    pos.x *= (1.0 + flatFactor * 0.18);
  }

  // Curvature Bend along X
  let bentY_offset = 0.0;
  const phi = (uCurvatureAngle * Math.PI) / 180.0;
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);

  const x_rot = pos.x * cosP + pos.z * sinP;
  const z_rot = -pos.x * sinP + pos.z * cosP;

  let bentX_rot = x_rot;
  if (normY_physical > 0.25) {
    const curveT = (normY_physical - 0.25) / 0.75;
    const slope = 4.0 * curveT * curveT * uCurvature * 1.9;
    const denom = Math.sqrt(1.0 + slope * slope);
    const cosT = 1.0 / denom;
    const sinT = -slope / denom;
    
    bentY_offset = x_rot * sinT;
    bentX_rot = x_rot * cosT + Math.pow(curveT, 3.0) * uCurvature * 1.9;
  }

  pos.x = bentX_rot * cosP - z_rot * sinP;
  pos.z = bentX_rot * sinP + z_rot * cosP;
  pos.y = pos.y * uLength + bentY_offset;

  return pos;
}

function mix(x: number, y: number, a: number): number {
  return x * (1 - a) + y * a;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0);
  return t * t * (3.0 - 2.0 * t);
}

describe('Geometry Mathematical Parity Tests (Drift Prevention)', () => {
  const testParamsList: BuilderParams[] = [
    {
      baseGeometry: 'classic',
      length: 7.2,
      shaftGirth: 1.30,
      baseGirth: 1.55,
      curvature: 0.1,
      curvatureAngle: 0,
      texture: 'smooth',
      suctionCup: true,
      vibrationCore: false,
      colorMode: 0,
      color1: '#06b6d4',
      color2: '#38bdf8',
      isVibrating: false,
      showScaleRef: false,
      shapeType: 'realistic',
      headType: 'realistic',
      headScale: 1.0,
      realisticVeins: 0.65,
      hasBalls: true,
      fantasyType: 'dragon',
      baseType: 'flared',
      taper: 0.08,
      firmness: 'medium',
      inclusions: 'none',
      thermochromic: false,
      internalTube: false,
      blacklightMode: false,
      arMode: false,
      sceneEnvironment: 'studio',
      engraveText: '',
      engraveStyle: 'none',
      engravePosition: 0.5,
      engraveSize: 44,
      engraveDepth: 0.5,
      ballSize: 0.85,
      ballAsymmetry: 0.0,
      hasOrifice: false,
      orificeType: 'vaginal',
      orificeDepth: 0.4
    },
    {
      baseGeometry: 'wave',
      length: 8.0,
      shaftGirth: 1.45,
      baseGirth: 1.80,
      curvature: -0.15,
      curvatureAngle: 90,
      texture: 'ribbed',
      suctionCup: false,
      vibrationCore: false,
      colorMode: 1,
      color1: '#a855f7',
      color2: '#ec4899',
      isVibrating: false,
      showScaleRef: false,
      shapeType: 'fantasy',
      headType: 'bulbous',
      headScale: 1.25,
      realisticVeins: 0.0,
      hasBalls: false,
      fantasyType: 'tentacle',
      baseType: 'flat',
      taper: 0.12,
      firmness: 'dual-density',
      inclusions: 'glitter',
      thermochromic: true,
      internalTube: true,
      blacklightMode: true,
      arMode: false,
      sceneEnvironment: 'studio',
      engraveText: 'BAD',
      engraveStyle: 'embossed',
      engravePosition: 0.4,
      engraveSize: 48,
      engraveDepth: 0.8,
      ballSize: 0.9,
      ballAsymmetry: 15.0,
      hasOrifice: true,
      orificeType: 'anal',
      orificeDepth: 0.5
    }
  ];

  it('should guarantee perfect mathematical parity between CPU geometryCore and simulated GLSL vertex shader', () => {
    // Sample points across the vertical profile (normY) and radial angle
    const normYSamples = [0.0, 0.1, 0.25, 0.4, 0.6, 0.8, 0.95, 1.0];
    const angleSamples = [0.0, Math.PI / 4, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI];

    for (const params of testParamsList) {
      for (const normY of normYSamples) {
        for (const angle of angleSamples) {
          const cpuVertex = getParametricVertex(params, normY, angle, null);
          const shaderVertex = getShaderSimulatedVertex(params, normY, angle);

          // We expect absolute mathematical equivalence within double precision tolerance
          expect(cpuVertex.x).toBeCloseTo(shaderVertex.x, 5);
          expect(cpuVertex.y).toBeCloseTo(shaderVertex.y, 5);
          expect(cpuVertex.z).toBeCloseTo(shaderVertex.z, 5);
        }
      }
    }
  });
});
