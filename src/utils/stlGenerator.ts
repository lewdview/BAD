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

// 1. STANDARD TOY STL GENERATOR
export const generateToySTL = (params: BuilderParams): string => {
  const radialSegments = 32;
  const heightSegments = 64;
  
  const vertices: { x: number; y: number; z: number }[] = [];
  const indices: number[][] = [];
  
  const length = params.length;
  const shaftGirth = params.shaftGirth;
  const baseGirth = params.baseGirth;
  const curvature = params.curvature;
  const uTaper = params.taper;
  const geometryStyle = params.baseGeometry === 'wave' ? 1.0 : params.baseGeometry === 'ergonomic' ? 2.0 : 0.0;
  const baseType = params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0;
  const shapeType = params.shapeType;
  const fantasyType = params.fantasyType;

  // Generate cylinder vertices
  for (let yIndex = 0; yIndex <= heightSegments; yIndex++) {
    const normY = yIndex / heightSegments;
    const yVal = (normY - 0.5) * length;
    
    let shapeScale = shaftGirth;
    
    // Base profiles
    if (normY < 0.25) {
      const t = normY / 0.25;
      if (baseType === 0.0) { // flared
        shapeScale = baseGirth * (1.0 - t) + shaftGirth * t;
        if (params.suctionCup && normY < 0.1) {
          const t2 = normY / 0.1;
          const flare = Math.pow(1.0 - t2, 2.2);
          shapeScale = baseGirth * (1.0 - flare) + (baseGirth * 2.3) * flare;
        }
      } else if (baseType === 1.0) { // flat
        shapeScale = baseGirth;
      } else if (baseType === 2.0) { // harness
        let groove = 0.0;
        if (normY > 0.08 && normY < 0.22) {
          const gt = (normY - 0.08) / 0.14;
          groove = 0.22 * Math.sin(gt * Math.PI);
        }
        shapeScale = (baseGirth * (1.0 - t) + shaftGirth * t) - groove * shaftGirth;
      }
    } 
    // Head profiles
    else if (normY > 0.76) {
      const t = (normY - 0.76) / 0.24;
      let ridge = 0.0;
      if (shapeType === 'realistic' || params.realisticGlans) {
        if (t < 0.25) {
          ridge = 0.18 * Math.sin((t / 0.25) * Math.PI);
        }
        const dome = Math.sqrt(1.0 - Math.pow(t, 2.0));
        shapeScale = (shaftGirth + ridge) * dome;
      } else {
        if (t < 0.25) {
          ridge = 0.14 * Math.sin((t / 0.25) * Math.PI);
        }
        const dome = Math.sqrt(1.0 - Math.pow(t, 2.0));
        shapeScale = (shaftGirth + ridge) * dome;
      }
    }

    // Taper
    const taperScale = (1.0 + uTaper * 0.20) * (1.0 - normY) + (1.0 - uTaper * 0.45) * normY;
    shapeScale *= taperScale;

    // Fantasy profiles
    if (shapeType === 'fantasy') {
      if (normY >= 0.25 && normY <= 0.76) {
        if (fantasyType === 'dragon') {
          const dragonKnot = 0.14 * Math.sin(yVal * 2.5);
          shapeScale += dragonKnot;
        } else if (fantasyType === 'alien') {
          const alienRidge = 0.16 * Math.sin(yVal * 3.5);
          shapeScale += alienRidge;
        } else if (fantasyType === 'tentacle') {
          const spiral = Math.sin(yVal * 5.5);
          shapeScale += 0.12 * Math.max(spiral, 0.0);
        }
      }
    } else {
      if (geometryStyle === 1.0) { // wave
        if (normY >= 0.25 && normY <= 0.76) {
          shapeScale += Math.sin((normY - 0.25) * 22.0) * 0.07;
        }
      } else if (geometryStyle === 2.0) { // ergonomic
        if (normY > 0.4 && normY < 0.76) {
          shapeScale -= Math.sin((normY - 0.4) / 0.36 * Math.PI) * 0.14;
        }
      }
    }

    for (let xIndex = 0; xIndex < radialSegments; xIndex++) {
      const angle = (xIndex / radialSegments) * Math.PI * 2;
      let x = Math.cos(angle) * shapeScale;
      let z = Math.sin(angle) * shapeScale;
      
      if (normY > 0.76 && (shapeType === 'realistic' || params.realisticGlans)) {
        const cleft = 0.035 * Math.cos(angle * 2.0);
        x += cleft * Math.cos(angle);
        z += cleft * Math.sin(angle);
      }

      if ((geometryStyle === 2.0 || shapeType === 'targeted') && normY > 0.6) {
        const flatFactor = (normY - 0.6) / 0.4;
        z *= (1.0 - flatFactor * 0.28);
        x *= (1.0 + flatFactor * 0.18);
      }

      let bentX = x;
      if (normY > 0.25) {
        const curveT = (normY - 0.25) / 0.75;
        bentX += Math.pow(curveT, 3.0) * curvature * 1.9;
      }

      vertices.push({ x: bentX, y: yVal, z: z });
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
    baseType: 'flat' // Flattened B2B injection base plug
  };
  return generateToySTL(coreParams);
};

// 3. 2-PART PRODUCTION SPLIT MOLD STL GENERATOR (WATERTIGHT SOLID block with negative dildo cutout)
export const generateMoldHalfSTL = (params: BuilderParams, side: 'front' | 'back'): string => {
  const radialSegments = 32;
  const heightSegments = 64;
  
  const length = params.length;
  const shaftGirth = params.shaftGirth;
  const baseGirth = params.baseGirth;
  const curvature = params.curvature;
  const uTaper = params.taper;
  const geometryStyle = params.baseGeometry === 'wave' ? 1.0 : params.baseGeometry === 'ergonomic' ? 2.0 : 0.0;
  const baseType = params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0;
  const shapeType = params.shapeType;
  const fantasyType = params.fantasyType;

  // Bounding Box Dimensions
  const yMin = -0.5 * length - 0.6;
  const yMax = 0.5 * length + 0.6;
  const xMin = -baseGirth * 1.6 - 0.4;
  const xMax = baseGirth * 1.6 + 0.4;
  const zMax = baseGirth * 1.6 + 0.4; // Box depth

  // Generate dildo profile vertices
  const dildoVertices: { x: number; y: number; z: number }[][] = [];
  for (let yIndex = 0; yIndex <= heightSegments; yIndex++) {
    const normY = yIndex / heightSegments;
    const yVal = (normY - 0.5) * length;
    
    let shapeScale = shaftGirth;
    
    // Base profiles
    if (normY < 0.25) {
      const t = normY / 0.25;
      if (baseType === 0.0) {
        shapeScale = baseGirth * (1.0 - t) + shaftGirth * t;
        if (params.suctionCup && normY < 0.1) {
          const t2 = normY / 0.1;
          const flare = Math.pow(1.0 - t2, 2.2);
          shapeScale = baseGirth * (1.0 - flare) + (baseGirth * 2.3) * flare;
        }
      } else if (baseType === 1.0) {
        shapeScale = baseGirth;
      } else if (baseType === 2.0) {
        let groove = 0.0;
        if (normY > 0.08 && normY < 0.22) {
          const gt = (normY - 0.08) / 0.14;
          groove = 0.22 * Math.sin(gt * Math.PI);
        }
        shapeScale = (baseGirth * (1.0 - t) + shaftGirth * t) - groove * shaftGirth;
      }
    } 
    else if (normY > 0.76) {
      const t = (normY - 0.76) / 0.24;
      let ridge = 0.0;
      if (shapeType === 'realistic' || params.realisticGlans) {
        if (t < 0.25) {
          ridge = 0.18 * Math.sin((t / 0.25) * Math.PI);
        }
        const dome = Math.sqrt(1.0 - Math.pow(t, 2.0));
        shapeScale = (shaftGirth + ridge) * dome;
      } else {
        if (t < 0.25) {
          ridge = 0.14 * Math.sin((t / 0.25) * Math.PI);
        }
        const dome = Math.sqrt(1.0 - Math.pow(t, 2.0));
        shapeScale = (shaftGirth + ridge) * dome;
      }
    }

    const taperScale = (1.0 + uTaper * 0.20) * (1.0 - normY) + (1.0 - uTaper * 0.45) * normY;
    shapeScale *= taperScale;

    if (shapeType === 'fantasy') {
      if (normY >= 0.25 && normY <= 0.76) {
        if (fantasyType === 'dragon') {
          shapeScale += 0.14 * Math.sin(yVal * 2.5);
        } else if (fantasyType === 'alien') {
          shapeScale += 0.16 * Math.sin(yVal * 3.5);
        } else if (fantasyType === 'tentacle') {
          shapeScale += 0.12 * Math.max(Math.sin(yVal * 5.5), 0.0);
        }
      }
    } else {
      if (geometryStyle === 1.0) {
        if (normY >= 0.25 && normY <= 0.76) {
          shapeScale += Math.sin((normY - 0.25) * 22.0) * 0.07;
        }
      } else if (geometryStyle === 2.0) {
        if (normY > 0.4 && normY < 0.76) {
          shapeScale -= Math.sin((normY - 0.4) / 0.36 * Math.PI) * 0.14;
        }
      }
    }

    const ring: { x: number; y: number; z: number }[] = [];
    for (let xIndex = 0; xIndex <= radialSegments; xIndex++) {
      const angle = (xIndex / radialSegments) * Math.PI * 2;
      let x = Math.cos(angle) * shapeScale;
      let z = Math.sin(angle) * shapeScale;
      
      if (normY > 0.76 && (shapeType === 'realistic' || params.realisticGlans)) {
        const cleft = 0.035 * Math.cos(angle * 2.0);
        x += cleft * Math.cos(angle);
        z += cleft * Math.sin(angle);
      }

      if ((geometryStyle === 2.0 || shapeType === 'targeted') && normY > 0.6) {
        const flatFactor = (normY - 0.6) / 0.4;
        z *= (1.0 - flatFactor * 0.28);
        x *= (1.0 + flatFactor * 0.18);
      }

      let bentX = x;
      if (normY > 0.25) {
        const curveT = (normY - 0.25) / 0.75;
        bentX += Math.pow(curveT, 3.0) * curvature * 1.9;
      }

      ring.push({ x: bentX, y: yVal, z: z });
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
  // We only render half of the dildo cylinder.
  // Front half: z >= 0 (xIndex from 0 to radialSegments/2)
  // Back half: z <= 0 (xIndex from radialSegments/2 to radialSegments)
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

      // Reverse normals (cavity faces inward, so p00->p01->p11 instead of p00->p11->p01)
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
  // The block sits at:
  // x: [xMin, xMax]
  // y: [yMin, yMax]
  // z: Front mold box is [0, zMax], Back mold box is [-zMax, 0]
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
  // Connect outer box rectangle corners (c000, c100, c110, c010) to the dildo profile loop
  // The dildo profile loop is the curve made of dildoVertices at xIndex = startX and xIndex = endX.
  // For front side, startX is 0 (angle = 0, x = positive shaft profile, z = 0) and endX is 16 (angle = pi, x = negative shaft profile, z = 0).
  // This split plane connects these outline points to the outer box corners.
  
  // Left half split plane
  const outerLeftBot = c000;
  const outerLeftTop = c010;
  // Right half split plane
  const outerRightBot = c100;
  const outerRightTop = c110;

  // Let's connect outline points at angle 0 and angle PI to cap the split interface cleanly
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
