import { generateTextHeightmap } from './textHeightmap';
import type { BuilderParams, Vec3 } from '../types';
import { getParametricVertex, isDegenerate, calcNormal } from './geometryCore';

const getBallCoords = (params: BuilderParams) => {
  const girth = params.shaftGirth;
  const length = params.length;
  const ballSize = params.ballSize !== undefined ? params.ballSize : 1.0;
  const ballAsymmetry = params.ballAsymmetry !== undefined ? params.ballAsymmetry : 0.0;
  const curvature = params.curvature !== undefined ? params.curvature : 0.0;
  const curvatureAngle = params.curvatureAngle !== undefined ? params.curvatureAngle : 0.0;
  
  const theta = (ballAsymmetry * Math.PI) / 180;
  
  // Scrotum assembly base coordinates in XZ plane
  // Adjusted center to push the scrotum further outside the shaft
  const z0 = -0.95 * girth - 0.2;
  
  // Left and Right lobe offsets in X
  const x0_L = -0.32 * girth;
  const x0_R = 0.32 * girth;
  
  // Radii/scales (slightly taller in Y, flatter in Z for natural sag)
  const R = 0.60 * girth * ballSize; // Increased base size
  const scaleZ = 0.9;
  const scaleY = 1.15;
  
  // Hang balls down to the base flange
  const targetBottomY = -0.47 * length;
  const y0 = targetBottomY + R * scaleY;
  
  // Rotate around Y axis (origin (0,0) in XZ plane) for asymmetry
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  
  let x_rot_L = x0_L * cosT - z0 * sinT;
  let z_rot_L = x0_L * sinT + z0 * cosT;
  
  let x_rot_R = x0_R * cosT - z0 * sinT;
  let z_rot_R = x0_R * sinT + z0 * cosT;
  
  let y_L = y0;
  let y_R = y0;

  // Apply 360 bend to the left ball coordinate at y0
  {
    const phi = (curvatureAngle * Math.PI) / 180;
    const cosP = Math.cos(phi);
    const sinP = Math.sin(phi);

    // Rotate to align with bend axis
    const x_rot_align = x_rot_L * cosP + z_rot_L * sinP;
    const z_rot_align = -x_rot_L * sinP + z_rot_L * cosP;

    let bentX_rot = x_rot_align;
    let bentY_offset = 0;
    const normY_physical = (y0 / length) + 0.5;
    if (normY_physical > 0.25) {
      const curveT = (normY_physical - 0.25) / 0.75;
      const slope = 4.0 * curveT * curveT * curvature * 1.9;
      const denom = Math.sqrt(1.0 + slope * slope);
      const cosT_bend = 1.0 / denom;
      const sinT_bend = -slope / denom;
      
      bentY_offset = x_rot_align * sinT_bend;
      bentX_rot = x_rot_align * cosT_bend + Math.pow(curveT, 3.0) * curvature * 1.9;
    }

    x_rot_L = bentX_rot * cosP - z_rot_align * sinP;
    z_rot_L = bentX_rot * sinP + z_rot_align * cosP;
    y_L += bentY_offset;
  }

  // Apply 360 bend to the right ball coordinate at y0
  {
    const phi = (curvatureAngle * Math.PI) / 180;
    const cosP = Math.cos(phi);
    const sinP = Math.sin(phi);

    // Rotate to align with bend axis
    const x_rot_align = x_rot_R * cosP + z_rot_R * sinP;
    const z_rot_align = -x_rot_R * sinP + z_rot_R * cosP;

    let bentX_rot = x_rot_align;
    let bentY_offset = 0;
    const normY_physical = (y0 / length) + 0.5;
    if (normY_physical > 0.25) {
      const curveT = (normY_physical - 0.25) / 0.75;
      const slope = 4.0 * curveT * curveT * curvature * 1.9;
      const denom = Math.sqrt(1.0 + slope * slope);
      const cosT_bend = 1.0 / denom;
      const sinT_bend = -slope / denom;
      
      bentY_offset = x_rot_align * sinT_bend;
      bentX_rot = x_rot_align * cosT_bend + Math.pow(curveT, 3.0) * curvature * 1.9;
    }

    x_rot_R = bentX_rot * cosP - z_rot_align * sinP;
    z_rot_R = bentX_rot * sinP + z_rot_align * cosP;
    y_R += bentY_offset;
  }

  // Find maximum Z surface boundary of both lobes
  const zMax_L = z_rot_L + R * scaleZ;
  const zMax_R = z_rot_R + R * scaleZ;
  const zMax = Math.max(zMax_L, zMax_R);
  
  // If either lobe crosses z = 0, shift the entire assembly back
  const zShift = zMax > 0.0 ? zMax : 0.0;
  
  return {
    left: {
      x: x_rot_L,
      y: y_L,
      z: z_rot_L - zShift,
      r: R
    },
    right: {
      x: x_rot_R,
      y: y_R,
      z: z_rot_R - zShift,
      r: R
    },
    theta,
    zShift,
    base: { x0_L, x0_R, y0, z0 }
  };
};

const rotateAndShiftFacets = (
  facets: { p1: Vec3; p2: Vec3; p3: Vec3 }[],
  theta: number,
  zShift: number
): { p1: Vec3; p2: Vec3; p3: Vec3 }[] => {
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  
  return facets.map(f => {
    const rotatePoint = (p: Vec3): Vec3 => {
      const x = p.x * cosT - p.z * sinT;
      const y = p.y;
      const z = p.x * sinT + p.z * cosT - zShift;
      return { x, y, z };
    };
    return {
      p1: rotatePoint(f.p1),
      p2: rotatePoint(f.p2),
      p3: rotatePoint(f.p3)
    };
  });
};

// Helper to generate sphere/ellipsoid facets for testicles/sack
const getSphereFacets = (
  cx: number,
  cy: number,
  cz: number,
  r: number,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1,
  reverse = false
): { p1: Vec3; p2: Vec3; p3: Vec3 }[] => {
  const facets: { p1: Vec3; p2: Vec3; p3: Vec3 }[] = [];
  const latSegments = 16;
  const lonSegments = 16;
  const sphereVerts: Vec3[] = [];

  for (let lat = 0; lat <= latSegments; lat++) {
    const theta = (lat * Math.PI) / latSegments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    
    for (let lon = 0; lon <= lonSegments; lon++) {
      const phi = (lon * 2 * Math.PI) / lonSegments;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      
      const x = cx + r * sinTheta * cosPhi * scaleX;
      const y = cy + r * cosTheta * scaleY;
      const z = cz + r * sinTheta * sinPhi * scaleZ;
      
      sphereVerts.push({ x, y, z });
    }
  }

  const addTri = (v0: number, v1: number, v2: number) => {
    const p1 = sphereVerts[v0];
    const p2 = sphereVerts[v1];
    const p3 = sphereVerts[v2];
    if (!isDegenerate(p1, p2, p3)) {
      facets.push({ p1, p2, p3 });
    }
  };

  for (let lat = 0; lat < latSegments; lat++) {
    for (let lon = 0; lon < lonSegments; lon++) {
      const nextLon = lon + 1;
      
      const v0 = lat * (lonSegments + 1) + lon;
      const v1 = lat * (lonSegments + 1) + nextLon;
      const v2 = (lat + 1) * (lonSegments + 1) + lon;
      const v3 = (lat + 1) * (lonSegments + 1) + nextLon;
      
      if (reverse) {
        addTri(v0, v3, v1);
        addTri(v0, v2, v3);
      } else {
        addTri(v0, v1, v3);
        addTri(v0, v3, v2);
      }
    }
  }

  return facets;
};

// 1. STANDARD TOY STL GENERATOR
export const generateToySTL = (params: BuilderParams): string => {
  const radialSegments = 32;
  const heightSegments = 64;
  
  const vertices: { x: number; y: number; z: number }[] = [];
  const indices: number[][] = [];
  
  const curvature = params.curvature;

  // Generate heightmap once at start of export to prevent CPU thrashing
  const textHeightmap = params.engraveStyle && params.engraveStyle !== 'none' && params.engraveText && params.engraveText.trim()
    ? generateTextHeightmap(params.engraveText, params.engraveSize || 44, 1.0 - (params.engravePosition !== undefined ? params.engravePosition : 0.5))
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

  const bottomY = vertices[0].y;
  const bottomCapIndex = vertices.length;
  vertices.push({ x: 0, y: bottomY, z: 0 });
  
  const topY = vertices[heightSegments * radialSegments].y;
  const topCapIndex = vertices.length;
  const topBend = curvature * 1.9;
  vertices.push({ x: topBend, y: topY, z: 0 });

  const addTriangle = (v0: number, v1: number, v2: number) => {
    if (!isDegenerate(vertices[v0], vertices[v1], vertices[v2])) {
      indices.push([v0, v1, v2]);
    }
  };

  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < radialSegments; x++) {
      const nextX = (x + 1) % radialSegments;
      const v0 = y * radialSegments + x;
      const v1 = y * radialSegments + nextX;
      const v2 = (y + 1) * radialSegments + x;
      const v3 = (y + 1) * radialSegments + nextX;
      addTriangle(v0, v1, v3);
      addTriangle(v0, v3, v2);
    }
  }

  for (let x = 0; x < radialSegments; x++) {
    const nextX = (x + 1) % radialSegments;
    const v0 = x;
    const v1 = nextX;
    addTriangle(bottomCapIndex, v1, v0);
  }

  const lastRingStart = heightSegments * radialSegments;
  for (let x = 0; x < radialSegments; x++) {
    const nextX = (x + 1) % radialSegments;
    const v0 = lastRingStart + x;
    const v1 = lastRingStart + nextX;
    addTriangle(topCapIndex, v0, v1);
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
  
  if (params.hasBalls) {
    const coords = getBallCoords(params);
    
    const leftFacets = rotateAndShiftFacets(
      getSphereFacets(coords.base.x0_L, coords.base.y0, coords.base.z0, coords.left.r, 1.0, 1.15, 0.9),
      coords.theta,
      coords.zShift
    );
    const rightFacets = rotateAndShiftFacets(
      getSphereFacets(coords.base.x0_R, coords.base.y0, coords.base.z0, coords.right.r, 1.0, 1.15, 0.9),
      coords.theta,
      coords.zShift
    );
    
    const appendFacets = (facetsList: { p1: Vec3; p2: Vec3; p3: Vec3 }[]) => {
      for (let i = 0; i < facetsList.length; i++) {
        const f = facetsList[i];
        const n = calcNormal(f.p1, f.p2, f.p3);
        stl += `  facet normal ${n.x.toFixed(6)} ${n.y.toFixed(6)} ${n.z.toFixed(6)}\n`;
        stl += `    outer loop\n`;
        stl += `      vertex ${f.p1.x.toFixed(4)} ${f.p1.y.toFixed(4)} ${f.p1.z.toFixed(4)}\n`;
        stl += `      vertex ${f.p2.x.toFixed(4)} ${f.p2.y.toFixed(4)} ${f.p2.z.toFixed(4)}\n`;
        stl += `      vertex ${f.p3.x.toFixed(4)} ${f.p3.y.toFixed(4)} ${f.p3.z.toFixed(4)}\n`;
        stl += `    endloop\n`;
        stl += `  endfacet\n`;
      }
    };
    
    appendFacets(leftFacets);
    appendFacets(rightFacets);
  }

  stl += "endsolid BAD_Custom_Product\n";
  return stl;
};

// 2. RIGID INNER CORE STL GENERATOR (Scaled down core for B2B Dual-Density casting)
export const generateCoreSTL = (params: BuilderParams): string => {
  const coreParams: BuilderParams = {
    ...params,
    length: params.length, // Keep original length
    suctionCup: false,
    baseType: 'flat', // Flattened B2B injection base plug
    engraveStyle: 'none', // Do not engrave initials on the rigid internal plug
    isCore: true // Pass isCore flag
  };
  return generateToySTL(coreParams);
};

// Standalone positive core plug representing the orifice pocket cavity
export const generateOrificeCoreSTL = (params: BuilderParams): string => {
  const radialSegments = 32;
  const heightSegments = 32;
  const length = params.length;
  const orificeDepth = params.orificeDepth || 0.4;
  const orificeType = params.orificeType || 'vaginal';
  const r_entrance = 0.16 * params.shaftGirth;
  
  const vertices: Vec3[] = [];
  const indices: number[][] = [];
  
  for (let yIndex = 0; yIndex <= heightSegments; yIndex++) {
    const t = yIndex / heightSegments;
    const yVal_toy = 0.5 - orificeDepth * t;
    const normY_physical = yVal_toy + 0.5;
    
    let shapeScale = r_entrance * (1.0 - t);
    const factor = orificeType === 'vaginal'
      ? 1.0 + 0.16 * Math.sin(t * 18.0) * (1.0 - t)
      : orificeType === 'anal'
      ? 1.0 + 0.22 * Math.sin(t * 28.0) * (1.0 - t)
      : 1.0 + 0.12 * Math.sin(t * 12.0) * (1.0 - t);
    shapeScale *= factor;
    
    const y = t * orificeDepth * length;
    
    for (let xIndex = 0; xIndex < radialSegments; xIndex++) {
      const angle = (xIndex / radialSegments) * Math.PI * 2;
      let x = Math.cos(angle) * shapeScale;
      let z = Math.sin(angle) * shapeScale;
      
      // Flat-head flattening
      if ((params.baseGeometry === 'ergonomic' || params.shapeType === 'targeted') && normY_physical > 0.6) {
        const flatFactor = (normY_physical - 0.6) / 0.4;
        z *= (1.0 - flatFactor * 0.28);
        x *= (1.0 + flatFactor * 0.18);
      }
      
      // Curvature bend
      let bentX = x;
      if (normY_physical > 0.25) {
        const curveT = (normY_physical - 0.25) / 0.75;
        bentX += Math.pow(curveT, 3.0) * params.curvature * 1.9;
      }
      
      vertices.push({ x: bentX, y, z });
    }
  }
  
  // Calculate bottom cap center at centroid of the bottom ring
  const bottomCenter = { x: vertices[0].x, y: 0, z: 0 };
  const bottomCapIndex = vertices.length;
  vertices.push(bottomCenter);
  
  const addTriangle = (v0: number, v1: number, v2: number) => {
    if (!isDegenerate(vertices[v0], vertices[v1], vertices[v2])) {
      indices.push([v0, v1, v2]);
    }
  };
  
  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < radialSegments; x++) {
      const nextX = (x + 1) % radialSegments;
      const v0 = y * radialSegments + x;
      const v1 = y * radialSegments + nextX;
      const v2 = (y + 1) * radialSegments + x;
      const v3 = (y + 1) * radialSegments + nextX;
      addTriangle(v0, v3, v1);
      addTriangle(v0, v2, v3);
    }
  }
  
  // Bottom cap triangles (cap the opening at y=0)
  for (let x = 0; x < radialSegments; x++) {
    const nextX = (x + 1) % radialSegments;
    addTriangle(bottomCapIndex, x, nextX);
  }
  
  let stl = "solid BAD_Orifice_Core_Plug\n";
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
  stl += "endsolid BAD_Orifice_Core_Plug\n";
  return stl;
};

// 3. 2-PART PRODUCTION SPLIT MOLD STL GENERATOR (WATERTIGHT SOLID block with negative dildo cutout)
export const generateMoldHalfSTL = (params: BuilderParams, side: 'front' | 'back'): string => {
  const radialSegments = 32;
  const heightSegments = 64;
  
  const length = params.length;
  const curvature = params.curvature;
  const hasCoreSocket = params.firmness === 'dual-density';
  const socketDepth = 0.4;
  const R_core = params.baseGirth * 0.46;

  // Generate heightmap once for the mold negative cut-out
  const textHeightmap = params.engraveStyle && params.engraveStyle !== 'none' && params.engraveText && params.engraveText.trim()
    ? generateTextHeightmap(params.engraveText, params.engraveSize || 44, 1.0 - (params.engravePosition !== undefined ? params.engravePosition : 0.5))
    : null;

  // Generate dildo profile vertices using shared helper
  const dildoVertices: { x: number; y: number; z: number }[][] = [];
  
  if (hasCoreSocket) {
    const ySocketBottom = -0.5 * length - socketDepth;
    const ySocketTop = -0.5 * length;
    
    // Ring 0: Socket bottom ring
    const ring0: { x: number; y: number; z: number }[] = [];
    for (let xIndex = 0; xIndex <= radialSegments; xIndex++) {
      const angle = (xIndex / radialSegments) * Math.PI * 2;
      ring0.push({ x: Math.cos(angle) * R_core, y: ySocketBottom, z: Math.sin(angle) * R_core });
    }
    dildoVertices.push(ring0);

    // Ring 1: Socket top ring (inner edge of annulus)
    const ring1: { x: number; y: number; z: number }[] = [];
    for (let xIndex = 0; xIndex <= radialSegments; xIndex++) {
      const angle = (xIndex / radialSegments) * Math.PI * 2;
      ring1.push({ x: Math.cos(angle) * R_core, y: ySocketTop, z: Math.sin(angle) * R_core });
    }
    dildoVertices.push(ring1);
  }

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

  // Calculate Bounding Box Dimensions dynamically from actual geometry vertices
  let maxDildoX = -Infinity;
  let minDildoX = Infinity;
  let maxDildoZ = 0;

  const numRings = dildoVertices.length;
  for (let y = 0; y < numRings; y++) {
    for (let x = 0; x <= radialSegments; x++) {
      const v = dildoVertices[y][x];
      if (v.x > maxDildoX) maxDildoX = v.x;
      if (v.x < minDildoX) minDildoX = v.x;
      const absZ = Math.abs(v.z);
      if (absZ > maxDildoZ) maxDildoZ = absZ;
    }
  }

  if (params.hasBalls) {
    const coords = getBallCoords(params);
    const minX_L = coords.left.x - coords.left.r;
    const maxX_L = coords.left.x + coords.left.r;
    const minX_R = coords.right.x - coords.right.r;
    const maxX_R = coords.right.x + coords.right.r;
    
    const minBallX = Math.min(minX_L, minX_R);
    const maxBallX = Math.max(maxX_L, maxX_R);
    
    const maxBallZ = Math.max(
      -(coords.left.z - coords.left.r * 0.9),
      -(coords.right.z - coords.right.r * 0.9)
    );
    
    if (minBallX < minDildoX) minDildoX = minBallX;
    if (maxBallX > maxDildoX) maxDildoX = maxBallX;
    if (maxBallZ > maxDildoZ) maxDildoZ = maxBallZ;
  }

  // Dynamic bounds with a safe margin for backing mold block walls (0.6" / ~15mm thickness)
  const margin = 0.6;
  const yMin_dildo_lowest = dildoVertices[0][0].y;

  const yMin = yMin_dildo_lowest - margin;
  const yMax = dildoVertices[numRings - 1][0].y + margin;
  const xMin = minDildoX - margin;
  const xMax = maxDildoX + margin;
  const zMax = maxDildoZ + margin; // Box depth

  // Build the Solid STL facets
  let stl = `solid BAD_Mold_${side.toUpperCase()}_Half\n`;
  const facets: { p1: Vec3; p2: Vec3; p3: Vec3 }[] = [];

  const addFacet = (p1: Vec3, p2: Vec3, p3: Vec3) => {
    if (!isDegenerate(p1, p2, p3)) {
      facets.push({ p1, p2, p3 });
    }
  };

  // Generate the internal cavity (hollow negative shape of the dildo)
  const isFront = side === 'front';
  const startX = isFront ? 0 : radialSegments / 2;
  const endX = isFront ? radialSegments / 2 : radialSegments;

  for (let y = 0; y < numRings - 1; y++) {
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

  // 100% Watertight flat caps closing the cavity bottom and top
  const bottomCenter = { x: 0, y: dildoVertices[0][0].y, z: 0 };
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

  const topCenter = { x: curvature * 1.9, y: dildoVertices[numRings - 1][0].y, z: 0 };
  for (let x = startX; x < endX; x++) {
    const nextX = x + 1;
    const p0 = dildoVertices[numRings - 1][x];
    const p1 = dildoVertices[numRings - 1][nextX];
    if (isFront) {
      addFacet(topCenter, p1, p0);
    } else {
      addFacet(topCenter, p0, p1);
    }
  }

  // Draw the backing mold block box
  const zSign = isFront ? 1.0 : -1.0;
  const zBlockValue = zSign * zMax;

  // Box corner vertices for top and bottom flat walls
  const c000 = { x: xMin, y: yMin, z: 0 };
  const c100 = { x: xMax, y: yMin, z: 0 };
  const c010 = { x: xMin, y: yMax, z: 0 };
  const c110 = { x: xMax, y: yMax, z: 0 };

  const c001 = { x: xMin, y: yMin, z: zBlockValue };
  const c101 = { x: xMax, y: yMin, z: zBlockValue };
  const c011 = { x: xMin, y: yMax, z: zBlockValue };
  const c111 = { x: xMax, y: yMax, z: zBlockValue };

  // Bottom wall (y = yMin) - flat horizontal quad
  if (isFront) {
    addFacet(c000, c001, c101);
    addFacet(c000, c101, c100);
  } else {
    addFacet(c000, c101, c001);
    addFacet(c000, c100, c101);
  }

  // Top wall (y = yMax) - flat horizontal quad
  if (isFront) {
    addFacet(c010, c111, c011);
    addFacet(c010, c110, c111);
  } else {
    addFacet(c010, c011, c111);
    addFacet(c010, c111, c110);
  }

  // Sliced Left, Right, and Backing walls to eliminate T-junctions
  const y_coords: number[] = [yMin];
  for (let y = 0; y < numRings; y++) {
    y_coords.push(dildoVertices[y][0].y);
  }
  y_coords.push(yMax);

  for (let i = 0; i < y_coords.length - 1; i++) {
    const y0 = y_coords[i];
    const y1 = y_coords[i + 1];
    if (Math.abs(y0 - y1) < 1e-5) continue;

    const lf0 = { x: xMin, y: y0, z: 0 };
    const lb0 = { x: xMin, y: y0, z: zBlockValue };
    const rb0 = { x: xMax, y: y0, z: zBlockValue };
    const rf0 = { x: xMax, y: y0, z: 0 };

    const lf1 = { x: xMin, y: y1, z: 0 };
    const lb1 = { x: xMin, y: y1, z: zBlockValue };
    const rb1 = { x: xMax, y: y1, z: zBlockValue };
    const rf1 = { x: xMax, y: y1, z: 0 };

    if (isFront) {
      // Left wall (x = xMin)
      addFacet(lf0, lb0, lb1);
      addFacet(lf0, lb1, lf1);

      // Backing wall (z = zBlockValue)
      addFacet(lb0, rb0, rb1);
      addFacet(lb0, rb1, lb1);

      // Right wall (x = xMax)
      addFacet(rb0, rf0, rf1);
      addFacet(rb0, rf1, rb1);
    } else {
      // Left wall (x = xMin)
      addFacet(lf0, lb1, lb0);
      addFacet(lf0, lf1, lb1);

      // Backing wall (z = zBlockValue)
      addFacet(lb0, rb1, rb0);
      addFacet(lb0, lb1, rb1);

      // Right wall (x = xMax)
      addFacet(rb0, rf1, rf0);
      addFacet(rb0, rb1, rf1);
    }
  }

  // Triangulate the flat split interface plane at z = 0
  const yMin_dildo = dildoVertices[0][0].y;
  const yMax_dildo = dildoVertices[numRings - 1][0].y;

  // 1. Bottom Zone Rectangle (y from yMin to yMin_dildo)
  const bottomXCoords = [
    xMin,
    dildoVertices[0][radialSegments / 2].x,
    0,
    dildoVertices[0][0].x,
    xMax
  ];
  const midBottom = 2; // index of 0

  const T_bot = bottomXCoords.map(x => ({ x, y: yMin_dildo, z: 0 }));
  const M_bot = bottomXCoords.length - 1;

  for (let j = 0; j < M_bot; j++) {
    if (j < midBottom) {
      if (isFront) {
        addFacet(c000, T_bot[j], T_bot[j + 1]);
      } else {
        addFacet(c000, T_bot[j + 1], T_bot[j]);
      }
    } else {
      if (isFront) {
        addFacet(c100, T_bot[j], T_bot[j + 1]);
      } else {
        addFacet(c100, T_bot[j + 1], T_bot[j]);
      }
    }
  }
  // Bottom zone connection triangle
  if (isFront) {
    addFacet(c000, T_bot[midBottom], c100);
  } else {
    addFacet(c000, c100, T_bot[midBottom]);
  }

  // 2. Middle Zone Left & Right Quad Strips
  const leftIdx = 16;
  const rightIdx = 0;

  for (let y = 0; y < numRings - 1; y++) {
    const pLeft0 = dildoVertices[y][leftIdx];
    const pLeft1 = dildoVertices[y + 1][leftIdx];
    const pRight0 = dildoVertices[y][rightIdx];
    const pRight1 = dildoVertices[y + 1][rightIdx];

    const y0_coord = dildoVertices[y][0].y;
    const y1_coord = dildoVertices[y + 1][0].y;
    const isDegenerateHeight = Math.abs(y0_coord - y1_coord) < 1e-5;

    const L_y = { x: xMin, y: y0_coord, z: 0 };
    const L_y1 = { x: xMin, y: y1_coord, z: 0 };
    const R_y = { x: xMax, y: y0_coord, z: 0 };
    const R_y1 = { x: xMax, y: y1_coord, z: 0 };

    // Left interface connection
    if (isFront) {
      if (!isDegenerateHeight) {
        addFacet(L_y, L_y1, pLeft1);
      }
      addFacet(L_y, pLeft1, pLeft0);
    } else {
      if (!isDegenerateHeight) {
        addFacet(L_y, pLeft1, L_y1);
      }
      addFacet(L_y, pLeft0, pLeft1);
    }

    // Right interface connection
    if (isFront) {
      addFacet(pRight0, pRight1, R_y1);
      if (!isDegenerateHeight) {
        addFacet(pRight0, R_y1, R_y);
      }
    } else {
      addFacet(pRight0, R_y1, pRight1);
      if (!isDegenerateHeight) {
        addFacet(pRight0, R_y, R_y1);
      }
    }
  }

  // 3. Top Zone Rectangle (y from yMax_dildo to yMax)
  const topXCoords = [
    xMin,
    dildoVertices[numRings - 1][radialSegments / 2].x,
    topCenter.x,
    dildoVertices[numRings - 1][0].x,
    xMax
  ];
  const midTop = 2; // index of topCenter.x

  const B_top = topXCoords.map(x => ({ x, y: yMax_dildo, z: 0 }));
  const M_top = topXCoords.length - 1;

  for (let j = 0; j < M_top; j++) {
    if (j < midTop) {
      if (isFront) {
        addFacet(c010, B_top[j + 1], B_top[j]);
      } else {
        addFacet(c010, B_top[j], B_top[j + 1]);
      }
    } else {
      if (isFront) {
        addFacet(c110, B_top[j + 1], B_top[j]);
      } else {
        addFacet(c110, B_top[j], B_top[j + 1]);
      }
    }
  }
  // Top zone connection triangle
  if (isFront) {
    addFacet(c010, c110, B_top[midTop]);
  } else {
    addFacet(c010, B_top[midTop], c110);
  }

  if (params.hasBalls && !isFront) {
    const coords = getBallCoords(params);
    
    // We want reversed facets because the cavity faces inwards
    const leftFacets = rotateAndShiftFacets(
      getSphereFacets(coords.base.x0_L, coords.base.y0, coords.base.z0, coords.left.r, 1.0, 1.15, 0.9, true),
      coords.theta,
      coords.zShift
    );
    const rightFacets = rotateAndShiftFacets(
      getSphereFacets(coords.base.x0_R, coords.base.y0, coords.base.z0, coords.right.r, 1.0, 1.15, 0.9, true),
      coords.theta,
      coords.zShift
    );
    
    facets.push(...leftFacets, ...rightFacets);
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
