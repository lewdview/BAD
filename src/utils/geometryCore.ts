import type { BuilderParams, Vec3 } from '../types';

// Helper: Check if a triangle is degenerate (any 2 vertices are the same within tolerance)
export const isDegenerate = (
  p1: Vec3,
  p2: Vec3,
  p3: Vec3
): boolean => {
  const isClose = (v1: Vec3, v2: Vec3) =>
    Math.abs(v1.x - v2.x) < 1e-5 && Math.abs(v1.y - v2.y) < 1e-5 && Math.abs(v1.z - v2.z) < 1e-5;
  return isClose(p1, p2) || isClose(p2, p3) || isClose(p3, p1);
};

// Helper: Calculate 3D normal vector of a triangle
export const calcNormal = (
  p1: { x: number; y: number; z: number },
  p2: { x: number; y: number; z: number },
  p3: { x: number; y: number; z: number }
) => {
  const ux = p2.x - p1.x, uy = p2.y - p1.y, uz = p2.z - p1.z;
  const vx = p3.x - p1.x, vy = p3.y - p1.y, vz = p3.z - p1.z;
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;
  return { x: nx / len, y: ny / len, z: nz / len };
};

const smoothstep = (min: number, max: number, value: number): number => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const mix = (a: number, b: number, t: number) => a * (1.0 - t) + b * t;

// Shared vertex generator mapping exactly to GPU shaders
export const getParametricVertex = (
  params: BuilderParams,
  normY: number,
  angle: number,
  textHeightmap?: { heightmap: Uint8Array; width: number; height: number } | null
): { x: number; y: number; z: number } => {
  if (params.isCore) {
    const length = params.length;
    const R_core = params.baseGirth * 0.46;
    
    if (normY >= 0.15) {
      let normY_shaft = (normY - 0.15) / 0.85;
      if (params.hasOrifice) {
        // Shorter core to fit underneath the orifice pocket
        const maxCoreHeight = 1.0 - (params.orificeDepth || 0.4) - 0.08;
        normY_shaft *= maxCoreHeight;
      }
      const outerParams: BuilderParams = {
        ...params,
        isCore: false,
        hasOrifice: false // Solid core doesn't get hollowed out
      };
      const outerV = getParametricVertex(outerParams, normY_shaft, angle, null);
      
      let innerScale = 0.46;
      if (normY_shaft > 0.82) {
        const cap = (1.0 - normY_shaft) / 0.18;
        innerScale *= cap;
      }
      return {
        x: outerV.x * innerScale,
        y: outerV.y,
        z: outerV.z * innerScale
      };
    } else {
      const t = normY / 0.15;
      const ySocketBottom = -0.5 * length - 0.4;
      const ySocketTop = -0.5 * length;
      const yFinal = ySocketBottom * (1.0 - t) + ySocketTop * t;
      
      const x = Math.cos(angle) * R_core;
      const z = Math.sin(angle) * R_core;
      return { x, y: yFinal, z };
    }
  }

  let yVal = normY - 0.5;
  let virtualNormY = normY;
  const hasOrifice = params.hasOrifice;
  const orificeDepth = params.orificeDepth || 0.4;
  const orificeType = params.orificeType || 'vaginal';
  const r_entrance = 0.16 * params.shaftGirth;
  let isOrificeCavity = false;

  if (hasOrifice) {
    const transitionNormY = 0.85;
    if (normY < transitionNormY) {
      virtualNormY = normY / transitionNormY;
      yVal = virtualNormY - 0.5;
    } else {
      isOrificeCavity = true;
      const t_inner = (normY - transitionNormY) / (1.0 - transitionNormY);
      yVal = 0.5 - orificeDepth * t_inner;
    }
  }
  
  const uShapeType = 
    params.shapeType === 'classic' ? 0.0 : 
    params.shapeType === 'realistic' ? 1.0 : 
    params.shapeType === 'fantasy' ? 2.0 : 
    params.shapeType === 'targeted' ? 3.0 : 
    params.shapeType === 'candle' ? 4.0 : 
    params.shapeType === 'soap' ? 5.0 : 
    params.shapeType === 'kitchen' ? 6.0 : 7.0;

  const uBaseType = params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0;
  const uFantasyType = params.fantasyType === 'dragon' ? 0.0 : params.fantasyType === 'alien' ? 1.0 : 2.0;
  const uGeometryStyle = params.baseGeometry === 'wave' ? 1.0 : params.baseGeometry === 'ergonomic' ? 2.0 : 0.0;
  const uTaper = params.taper;

  let shapeScale = params.shaftGirth;

  if (isOrificeCavity) {
    const t_inner = (normY - 0.85) / 0.15;
    shapeScale = r_entrance * (1.0 - t_inner);
    
    // Add textures/canal details based on type
    const factor = orificeType === 'vaginal'
      ? 1.0 + 0.16 * Math.sin(t_inner * 18.0) * (1.0 - t_inner)
      : orificeType === 'anal'
      ? 1.0 + 0.22 * Math.sin(t_inner * 28.0) * (1.0 - t_inner)
      : 1.0 + 0.12 * Math.sin(t_inner * 12.0) * (1.0 - t_inner);
    shapeScale *= factor;
  } else {
    if (uShapeType < 3.5) {
      // Apply base profile
      if (virtualNormY < 0.25) {
        const t = virtualNormY / 0.25;
        if (uBaseType === 0.0) {
          // Flared Suction Cup
          shapeScale = params.baseGirth * (1.0 - t) + params.shaftGirth * t;
          if (params.suctionCup && virtualNormY < 0.1) {
            const t2 = virtualNormY / 0.1;
            const flare = Math.pow(1.0 - t2, 2.2);
            shapeScale = params.baseGirth * (1.0 - flare) + (params.baseGirth * 2.3) * flare;
          }
        } else if (uBaseType === 1.0) {
          // Flat base
          shapeScale = params.baseGirth;
        } else if (uBaseType === 2.0) {
          // Harness collar
          let groove = 0.0;
          if (virtualNormY > 0.08 && virtualNormY < 0.22) {
            const gt = (virtualNormY - 0.08) / 0.14;
            groove = 0.22 * Math.sin(gt * Math.PI);
          }
          shapeScale = (params.baseGirth * (1.0 - t) + params.shaftGirth * t) - groove * params.shaftGirth;
        }
      } 
      // Head curvature details (bulbous head & corona ridge)
      else if (virtualNormY > 0.76) {
        const t = (virtualNormY - 0.76) / 0.24;
        let ridge = 0.0;
        if (uShapeType === 1.0 || params.realisticGlans) {
          // Realistic Glans
          const cleft = 0.035 * Math.cos(angle * 2.0);
          if (t < 0.25) {
            ridge = 0.18 * Math.sin((t / 0.25) * Math.PI);
          }
          const dome = Math.sqrt(1.0 - Math.pow(t, 2.0));
          if (hasOrifice) {
            shapeScale = mix(r_entrance, (params.shaftGirth + ridge + cleft) * dome, 1.0 - Math.pow(t, 4.0));
          } else {
            shapeScale = (params.shaftGirth + ridge + cleft) * dome;
          }
        } else {
          // Classic Glans
          if (t < 0.25) {
            ridge = 0.14 * Math.sin((t / 0.25) * Math.PI);
          }
          const dome = Math.sqrt(1.0 - Math.pow(t, 2.0));
          if (hasOrifice) {
            shapeScale = mix(r_entrance, (params.shaftGirth + ridge) * dome, 1.0 - Math.pow(t, 4.0));
          } else {
            shapeScale = (params.shaftGirth + ridge) * dome;
          }
        }
      }
    }

    // Taper (applied continuously across the main shaft body)
    const taperScale = (1.0 + uTaper * 0.20) * (1.0 - virtualNormY) + (1.0 - uTaper * 0.45) * virtualNormY;
    shapeScale *= taperScale;

    // Custom text/engraving displacement
    if (params.engraveStyle && params.engraveStyle !== 'none' && textHeightmap) {
      const pxAngle = angle > Math.PI ? angle - 2.0 * Math.PI : angle;
      const textU = (pxAngle + Math.PI) / (Math.PI * 2);
      const textV = virtualNormY;
      
      const xPixel = Math.max(0, Math.min(textHeightmap.width - 1, Math.floor(textU * textHeightmap.width)));
      const yPixel = Math.max(0, Math.min(textHeightmap.height - 1, Math.floor(textV * textHeightmap.height)));
      
      const pixelVal = textHeightmap.heightmap[yPixel * textHeightmap.width + xPixel] / 255.0;
      
      let disp = 0;
      const engraveDepth = params.engraveDepth !== undefined ? params.engraveDepth : 0.5;
      if (params.engraveStyle === 'embossed') {
        disp = pixelVal * engraveDepth * 0.08;
      } else if (params.engraveStyle === 'engraved') {
        disp = -pixelVal * engraveDepth * 0.08;
      }
      shapeScale += disp;
    }
  }

  const basePos = { x: Math.cos(angle), y: yVal, z: Math.sin(angle) };

  if (!isOrificeCavity) {
    // Use Scenario shapes (Candle, Soap, Kitchenware, Collectible)
    if (uShapeType === 4.0) {
      // Candle: add longitudinal ridges, then apply spiral twist
      shapeScale += 0.12 * Math.sin(angle * 6.0);
    } else if (uShapeType === 5.0) {
      // Soap: square/rectangular block with chamfered look
      const cos4 = Math.cos(angle * 4.0);
      shapeScale *= (1.0 - 0.16 * cos4);
      if (virtualNormY < 0.15) {
        shapeScale *= smoothstep(0.0, 1.0, virtualNormY / 0.15);
      }
      if (virtualNormY > 0.85) {
        shapeScale *= smoothstep(0.0, 1.0, (1.0 - virtualNormY) / 0.15);
      }
    } else if (uShapeType === 6.0) {
      // Kitchenware (Muffin baking cup)
      shapeScale = params.shaftGirth * (0.7 + virtualNormY * 0.9);
      shapeScale += 0.07 * Math.sin(angle * 18.0) * (0.2 + virtualNormY * 0.8);
      if (virtualNormY < 0.1) {
        shapeScale *= smoothstep(0.0, 1.0, virtualNormY / 0.1);
      }
    } else if (uShapeType === 7.0) {
      // Collectible
      let profile: number;
      if (virtualNormY < 0.45) {
        profile = 1.25 - 0.5 * (virtualNormY / 0.45);
      } else if (virtualNormY < 0.6) {
        profile = 0.75;
      } else {
        const t = (virtualNormY - 0.6) / 0.4;
        profile = 0.75 + 0.55 * Math.sin(t * Math.PI);
      }
      shapeScale = params.shaftGirth * profile;
      
      const octAngle = Math.floor(angle * 8.0 / (Math.PI * 2) + 0.5) * (Math.PI * 2) / 8.0;
      basePos.x = Math.cos(octAngle);
      basePos.z = Math.sin(octAngle);
    }
    // Standard shape styles
    else if (uShapeType === 2.0) {
      // Fantasy geometries
      if (virtualNormY >= 0.25 && virtualNormY <= 0.76) {
        if (uFantasyType === 0.0) {
          // Dragon: ridged nodes + scales
          const dragonKnot = 0.14 * Math.sin(yVal * 2.5);
          const scaleBump = 0.07 * Math.cos(angle * 5.0 + yVal * 9.0);
          shapeScale += dragonKnot + scaleBump;
        } else if (uFantasyType === 1.0) {
          // Alien: egg nodes + ribs
          const alienRidge = 0.16 * Math.sin(yVal * 3.5);
          const alienBumps = 0.04 * Math.sin(angle * 3.0 + yVal * 2.0);
          shapeScale += alienRidge + alienBumps;
        } else if (uFantasyType === 2.0) {
          // Tentacle: spiral rings
          const spiral = Math.sin(yVal * 5.5 - angle * 2.0);
          shapeScale += 0.12 * smoothstep(0.0, 1.0, spiral);
        }
      }
    } else {
      if (uGeometryStyle > 0.5 && uGeometryStyle < 1.5) {
        // Wave
        if (virtualNormY >= 0.25 && virtualNormY <= 0.76) {
          shapeScale += Math.sin((virtualNormY - 0.25) * 22.0) * 0.07;
        }
      } else if (uGeometryStyle > 1.5) {
        // Ergonomic
        if (virtualNormY > 0.4 && virtualNormY < 0.76) {
          shapeScale -= Math.sin((virtualNormY - 0.4) / 0.36 * Math.PI) * 0.14;
        }
      }
    }
  }

  let x = basePos.x * shapeScale;
  let z = basePos.z * shapeScale;

  // Twist for Candle
  if (!isOrificeCavity && uShapeType === 4.0) {
    const theta = virtualNormY * Math.PI * 2.0; 
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const rx = x * c - z * s;
    const rz = x * s + z * c;
    x = rx;
    z = rz;
  }

  const normY_physical = yVal + 0.5;

  // Oval flat-head shaping for ergonomic curve / targeted
  if ((uGeometryStyle > 1.5 || uShapeType === 3.0) && normY_physical > 0.6) {
    const flatFactor = (normY_physical - 0.6) / 0.4;
    z *= (1.0 - flatFactor * 0.28);
    x *= (1.0 + flatFactor * 0.18);
  }

  // Curvature bend along X
  let bentX = x;
  if (normY_physical > 0.25) {
    const curveT = (normY_physical - 0.25) / 0.75;
    bentX += Math.pow(curveT, 3.0) * params.curvature * 1.9;
  }

  // Scale height
  const yFinal = yVal * params.length;

  return { x: bentX, y: yFinal, z };
};
