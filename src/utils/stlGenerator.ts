import { generateTextHeightmap } from './textHeightmap';

export interface BuilderParams {
  baseGeometry: string;
  length: number;
  shaftGirth: number;
  baseGirth: number;
  curvature: number;
  texture: string;
  suctionCup: boolean;
  vibrationCore: boolean;
  colorMode: number;
  color1: string;
  color2: string;
  isVibrating: boolean;
  showScaleRef: boolean;
  shapeType: string;
  realisticVeins: number;
  realisticGlans: boolean;
  hasBalls: boolean;
  fantasyType: string;
  baseType: string;
  taper: number;
  firmness: string;
  inclusions: string;
  thermochromic: boolean;
  internalTube: boolean;
  blacklightMode: boolean;
  arMode: boolean;
  sceneEnvironment: string;
  engraveText: string;
  engraveStyle: string;
  engravePosition: number;
  engraveSize: number;
  engraveDepth: number;
}

// Helper: Calculate 3D normal vector of a triangle
const calcNormal = (
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

// Shared vertex generator mapping exactly to GPU shaders
export const getParametricVertex = (
  params: BuilderParams,
  normY: number,
  angle: number,
  textHeightmap?: { heightmap: Uint8Array; width: number; height: number } | null
): { x: number; y: number; z: number } => {
  const yVal = normY - 0.5;
  
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

  if (uShapeType < 3.5) {
    // Apply base profile
    if (normY < 0.25) {
      const t = normY / 0.25;
      if (uBaseType === 0.0) {
        // Flared Suction Cup
        shapeScale = params.baseGirth * (1.0 - t) + params.shaftGirth * t;
        if (params.suctionCup && normY < 0.1) {
          const t2 = normY / 0.1;
          const flare = Math.pow(1.0 - t2, 2.2);
          shapeScale = params.baseGirth * (1.0 - flare) + (params.baseGirth * 2.3) * flare;
        }
      } else if (uBaseType === 1.0) {
        // Flat base
        shapeScale = params.baseGirth;
      } else if (uBaseType === 2.0) {
        // Harness collar
        let groove = 0.0;
        if (normY > 0.08 && normY < 0.22) {
          const gt = (normY - 0.08) / 0.14;
          groove = 0.22 * Math.sin(gt * Math.PI);
        }
        shapeScale = (params.baseGirth * (1.0 - t) + params.shaftGirth * t) - groove * params.shaftGirth;
      }
    } 
    // Head curvature details (bulbous head & corona ridge)
    else if (normY > 0.76) {
      const t = (normY - 0.76) / 0.24;
      let ridge = 0.0;
      if (uShapeType === 1.0 || params.realisticGlans) {
        // Realistic Glans
        const cleft = 0.035 * Math.cos(angle * 2.0);
        if (t < 0.25) {
          ridge = 0.18 * Math.sin((t / 0.25) * Math.PI);
        }
        const dome = Math.sqrt(1.0 - Math.pow(t, 2.0));
        shapeScale = (params.shaftGirth + ridge + cleft) * dome;
      } else {
        // Classic Glans
        if (t < 0.25) {
          ridge = 0.14 * Math.sin((t / 0.25) * Math.PI);
        }
        const dome = Math.sqrt(1.0 - Math.pow(t, 2.0));
        shapeScale = (params.shaftGirth + ridge) * dome;
      }
    }
  }

  // Taper (applied continuously across the main shaft body)
  const taperScale = (1.0 + uTaper * 0.20) * (1.0 - normY) + (1.0 - uTaper * 0.45) * normY;
  shapeScale *= taperScale;

  // Custom text/engraving displacement
  if (params.engraveStyle && params.engraveStyle !== 'none' && textHeightmap) {
    const pxAngle = Math.atan2(Math.sin(angle), Math.cos(angle));
    const textU = (pxAngle + Math.PI) / (Math.PI * 2);
    const textV = normY;
    
    const xPixel = Math.max(0, Math.min(textHeightmap.width - 1, Math.floor(textU * textHeightmap.width)));
    const yPixel = Math.max(0, Math.min(textHeightmap.height - 1, Math.floor(textV * textHeightmap.height)));
    
    const pixelVal = textHeightmap.heightmap[yPixel * textHeightmap.width + xPixel] / 255.0;
    
    let disp = 0;
    if (params.engraveStyle === 'embossed') {
      disp = pixelVal * params.engraveDepth * 0.08;
    } else if (params.engraveStyle === 'engraved') {
      disp = -pixelVal * params.engraveDepth * 0.08;
    }
    shapeScale += disp;
  }

  let basePos = { x: Math.cos(angle), y: yVal, z: Math.sin(angle) };

  // Use Scenario shapes (Candle, Soap, Kitchenware, Collectible)
  if (uShapeType === 4.0) {
    // Candle: add longitudinal ridges, then apply spiral twist
    shapeScale += 0.12 * Math.sin(angle * 6.0);
  } else if (uShapeType === 5.0) {
    // Soap: square/rectangular block with chamfered look
    const cos4 = Math.cos(angle * 4.0);
    shapeScale *= (1.0 - 0.16 * cos4);
    if (normY < 0.15) {
      shapeScale *= smoothstep(0.0, 1.0, normY / 0.15);
    }
    if (normY > 0.85) {
      shapeScale *= smoothstep(0.0, 1.0, (1.0 - normY) / 0.15);
    }
  } else if (uShapeType === 6.0) {
    // Kitchenware (Muffin baking cup)
    shapeScale = params.shaftGirth * (0.7 + normY * 0.9);
    shapeScale += 0.07 * Math.sin(angle * 18.0) * (0.2 + normY * 0.8);
    if (normY < 0.1) {
      shapeScale *= smoothstep(0.0, 1.0, normY / 0.1);
    }
  } else if (uShapeType === 7.0) {
    // Collectible
    let profile = 1.0;
    if (normY < 0.45) {
      profile = 1.25 - 0.5 * (normY / 0.45);
    } else if (normY < 0.6) {
      profile = 0.75;
    } else {
      const t = (normY - 0.6) / 0.4;
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
    if (normY >= 0.25 && normY <= 0.76) {
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
      if (normY >= 0.25 && normY <= 0.76) {
        shapeScale += Math.sin((normY - 0.25) * 22.0) * 0.07;
      }
    } else if (uGeometryStyle > 1.5) {
      // Ergonomic
      if (normY > 0.4 && normY < 0.76) {
        shapeScale -= Math.sin((normY - 0.4) / 0.36 * Math.PI) * 0.14;
      }
    }
  }

  let x = basePos.x * shapeScale;
  let z = basePos.z * shapeScale;

  // Twist for Candle
  if (uShapeType === 4.0) {
    const theta = normY * Math.PI * 2.0; 
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const rx = x * c - z * s;
    const rz = x * s + z * c;
    x = rx;
    z = rz;
  }

  // Oval flat-head shaping for ergonomic curve / targeted
  if ((uGeometryStyle > 1.5 || uShapeType === 3.0) && normY > 0.6) {
    const flatFactor = (normY - 0.6) / 0.4;
    z *= (1.0 - flatFactor * 0.28);
    x *= (1.0 + flatFactor * 0.18);
  }

  // Curvature bend along X
  let bentX = x;
  if (normY > 0.25) {
    const curveT = (normY - 0.25) / 0.75;
    bentX += Math.pow(curveT, 3.0) * params.curvature * 1.9;
  }

  // Scale height
  const yFinal = yVal * params.length;

  return { x: bentX, y: yFinal, z };
};

// 1. STANDARD TOY STL GENERATOR
export const generateToySTL = (params: BuilderParams): string => {
  const radialSegments = 32;
  const heightSegments = 64;
  
  const vertices: { x: number; y: number; z: number }[] = [];
  const indices: number[][] = [];
  
  const length = params.length;
  const curvature = params.curvature;

  // Generate heightmap once at start of export to prevent CPU thrashing
  const textHeightmap = params.engraveStyle !== 'none' && params.engraveText.trim()
    ? generateTextHeightmap(params.engraveText, params.engraveSize, 1.0 - params.engravePosition)
    : null;

  // Generate cylinder vertices using shared helper
  for (let yIndex = 0; yIndex <= heightSegments; yIndex++) {
    const normY = yIndex / heightSegments;
    for (let xIndex = 0; xIndex < radialSegments; xIndex++) {
      const angle = (xIndex / radialSegments) * Math.PI * 2;
      const v = getParametricVertex(params, normY, angle, textHeightmap);
      vertices.push(v);
    }
  }

  const bottomCapIndex = vertices.length;
  vertices.push({ x: 0, y: -0.5 * length, z: 0 });
  
  const topCapIndex = vertices.length;
  const topBend = Math.pow(1.0, 3.0) * curvature * 1.9;
  vertices.push({ x: topBend, y: 0.5 * length, z: 0 });

  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < radialSegments; x++) {
      const nextX = (x + 1) % radialSegments;
      const v0 = y * radialSegments + x;
      const v1 = y * radialSegments + nextX;
      const v2 = (y + 1) * radialSegments + x;
      const v3 = (y + 1) * radialSegments + nextX;
      indices.push([v0, v1, v3]);
      indices.push([v0, v3, v2]);
    }
  }

  for (let x = 0; x < radialSegments; x++) {
    const nextX = (x + 1) % radialSegments;
    const v0 = x;
    const v1 = nextX;
    indices.push([bottomCapIndex, v1, v0]);
  }

  const lastRingStart = heightSegments * radialSegments;
  for (let x = 0; x < radialSegments; x++) {
    const nextX = (x + 1) % radialSegments;
    const v0 = lastRingStart + x;
    const v1 = lastRingStart + nextX;
    indices.push([topCapIndex, v0, v1]);
  }

  let stl = "solid BAD_Custom_Product\n";
  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    const p1 = vertices[idx[0]];
    const p2 = vertices[idx[1]];
    const p3 = vertices[idx[2]];
    const n = calcNormal(p1, p2, p3);
    
    stl += `  facet normal ${n.x.toFixed(6)} ${n.y.toFixed(6)} ${n.z.toFixed(6)}\n`;
    stl += `    outer loop\n`;
    stl += `      vertex ${p1.x.toFixed(4)} ${p1.y.toFixed(4)} ${p1.z.toFixed(4)}\n`;
    stl += `      vertex ${p2.x.toFixed(4)} ${p2.y.toFixed(4)} ${p2.z.toFixed(4)}\n`;
    stl += `      vertex ${p3.x.toFixed(4)} ${p3.y.toFixed(4)} ${p3.z.toFixed(4)}\n`;
    stl += `    endloop\n`;
    stl += `  endfacet\n`;
  }
  stl += "endsolid BAD_Custom_Product\n";
  return stl;
};

// 2. RIGID INNER CORE STL GENERATOR (Scaled down core for B2B Dual-Density casting)
export const generateCoreSTL = (params: BuilderParams): string => {
  const coreParams: BuilderParams = {
    ...params,
    shaftGirth: params.shaftGirth * 0.46, // Scaled down core
    baseGirth: params.baseGirth * 0.46,
    length: params.length * 0.88, // Shorter to keep core fully encapsulated inside dildo tip
    suctionCup: false,
    baseType: 'flat', // Flattened B2B injection base plug
    engraveStyle: 'none' // Do not engrave initials on the rigid internal plug
  };
  return generateToySTL(coreParams);
};

// 3. 2-PART PRODUCTION SPLIT MOLD STL GENERATOR (WATERTIGHT SOLID block with negative dildo cutout)
export const generateMoldHalfSTL = (params: BuilderParams, side: 'front' | 'back'): string => {
  const radialSegments = 32;
  const heightSegments = 64;
  
  const length = params.length;
  const baseGirth = params.baseGirth;
  const curvature = params.curvature;

  // Bounding Box Dimensions
  const yMin = -0.5 * length - 0.6;
  const yMax = 0.5 * length + 0.6;
  const xMin = -baseGirth * 1.6 - 0.4;
  const xMax = baseGirth * 1.6 + 0.4;
  const zMax = baseGirth * 1.6 + 0.4; // Box depth

  // Generate heightmap once for the mold negative cut-out
  const textHeightmap = params.engraveStyle !== 'none' && params.engraveText.trim()
    ? generateTextHeightmap(params.engraveText, params.engraveSize, 1.0 - params.engravePosition)
    : null;

  // Generate dildo profile vertices using shared helper
  const dildoVertices: { x: number; y: number; z: number }[][] = [];
  for (let yIndex = 0; yIndex <= heightSegments; yIndex++) {
    const normY = yIndex / heightSegments;
    const ring: { x: number; y: number; z: number }[] = [];
    for (let xIndex = 0; xIndex <= radialSegments; xIndex++) {
      const angle = (xIndex / radialSegments) * Math.PI * 2;
      const v = getParametricVertex(params, normY, angle, textHeightmap);
      ring.push(v);
    }
    dildoVertices.push(ring);
  }

  // Build the Solid STL facets
  let stl = `solid BAD_Mold_${side.toUpperCase()}_Half\n`;
  const facets: { p1: any; p2: any; p3: any }[] = [];

  const addFacet = (p1: any, p2: any, p3: any) => {
    facets.push({ p1, p2, p3 });
  };

  // Generate the internal cavity (hollow negative shape of the dildo)
  const isFront = side === 'front';
  const startX = isFront ? 0 : radialSegments / 2;
  const endX = isFront ? radialSegments / 2 : radialSegments;

  for (let y = 0; y < heightSegments; y++) {
    for (let x = startX; x < endX; x++) {
      const nextX = x + 1;
      const p00 = dildoVertices[y][x];
      const p10 = dildoVertices[y][nextX];
      const p01 = dildoVertices[y + 1][x];
      const p11 = dildoVertices[y + 1][nextX];

      // Reverse normals (cavity faces inward)
      if (isFront) {
        addFacet(p00, p01, p11);
        addFacet(p00, p11, p10);
      } else {
        addFacet(p00, p11, p01);
        addFacet(p00, p10, p11);
      }
    }
  }

  // Cap the bottom and top of the dildo inside the mold
  const bottomCenter = { x: 0, y: -0.5 * length, z: 0 };
  const topCenter = { x: Math.pow(1.0, 3.0) * curvature * 1.9, y: 0.5 * length, z: 0 };

  for (let x = startX; x < endX; x++) {
    const nextX = x + 1;
    const p0 = dildoVertices[0][x];
    const p1 = dildoVertices[0][nextX];
    if (isFront) {
      addFacet(bottomCenter, p0, p1);
    } else {
      addFacet(bottomCenter, p1, p0);
    }
  }

  for (let x = startX; x < endX; x++) {
    const nextX = x + 1;
    const p0 = dildoVertices[heightSegments][x];
    const p1 = dildoVertices[heightSegments][nextX];
    if (isFront) {
      addFacet(topCenter, p1, p0);
    } else {
      addFacet(topCenter, p0, p1);
    }
  }

  // Draw the backing mold block box
  const zSign = isFront ? 1.0 : -1.0;
  const zBlockValue = zSign * zMax;

  // Box corner vertices
  const c000 = { x: xMin, y: yMin, z: 0 };
  const c100 = { x: xMax, y: yMin, z: 0 };
  const c010 = { x: xMin, y: yMax, z: 0 };
  const c110 = { x: xMax, y: yMax, z: 0 };

  const c001 = { x: xMin, y: yMin, z: zBlockValue };
  const c101 = { x: xMax, y: yMin, z: zBlockValue };
  const c011 = { x: xMin, y: yMax, z: zBlockValue };
  const c111 = { x: xMax, y: yMax, z: zBlockValue };

  // Flat outer faces of the box (standard triangulation)
  // Backing wall (z = zBlockValue)
  if (isFront) {
    addFacet(c001, c101, c111);
    addFacet(c001, c111, c011);
  } else {
    addFacet(c001, c111, c101);
    addFacet(c001, c011, c111);
  }

  // Left wall (x = xMin)
  if (isFront) {
    addFacet(c000, c011, c001);
    addFacet(c000, c010, c011);
  } else {
    addFacet(c000, c001, c011);
    addFacet(c000, c011, c010);
  }

  // Right wall (x = xMax)
  if (isFront) {
    addFacet(c100, c101, c111);
    addFacet(c100, c111, c110);
  } else {
    addFacet(c100, c111, c101);
    addFacet(c100, c110, c111);
  }

  // Bottom wall (y = yMin)
  if (isFront) {
    addFacet(c000, c001, c101);
    addFacet(c000, c101, c100);
  } else {
    addFacet(c000, c101, c001);
    addFacet(c000, c100, c101);
  }

  // Top wall (y = yMax)
  if (isFront) {
    addFacet(c010, c111, c011);
    addFacet(c010, c110, c111);
  } else {
    addFacet(c010, c011, c111);
    addFacet(c010, c111, c110);
  }

  // Triangulate the flat split interface plane at z = 0
  const outerLeftBot = c000;
  const outerLeftTop = c010;
  const outerRightBot = c100;
  const outerRightTop = c110;

  for (let y = 0; y < heightSegments; y++) {
    const pLeft0 = dildoVertices[y][endX];
    const pLeft1 = dildoVertices[y + 1][endX];
    const pRight0 = dildoVertices[y][startX];
    const pRight1 = dildoVertices[y + 1][startX];

    // Left interface connection
    if (isFront) {
      addFacet(outerLeftBot, pLeft1, pLeft0);
      addFacet(outerLeftBot, outerLeftTop, pLeft1);
    } else {
      addFacet(outerLeftBot, pLeft0, pLeft1);
      addFacet(outerLeftBot, pLeft1, outerLeftTop);
    }

    // Right interface connection
    if (isFront) {
      addFacet(outerRightBot, pRight0, pRight1);
      addFacet(outerRightBot, pRight1, outerRightTop);
    } else {
      addFacet(outerRightBot, pRight1, pRight0);
      addFacet(outerRightBot, outerRightTop, pRight1);
    }
  }

  // Write out to STL
  for (let i = 0; i < facets.length; i++) {
    const f = facets[i];
    const n = calcNormal(f.p1, f.p2, f.p3);
    
    stl += `  facet normal ${n.x.toFixed(6)} ${n.y.toFixed(6)} ${n.z.toFixed(6)}\n`;
    stl += `    outer loop\n`;
    stl += `      vertex ${f.p1.x.toFixed(4)} ${f.p1.y.toFixed(4)} ${f.p1.z.toFixed(4)}\n`;
    stl += `      vertex ${f.p2.x.toFixed(4)} ${f.p2.y.toFixed(4)} ${f.p2.z.toFixed(4)}\n`;
    stl += `      vertex ${f.p3.x.toFixed(4)} ${f.p3.y.toFixed(4)} ${f.p3.z.toFixed(4)}\n`;
    stl += `    endloop\n`;
    stl += `  endfacet\n`;
  }
  stl += `endsolid BAD_Mold_${side.toUpperCase()}_Half\n`;
  return stl;
};
