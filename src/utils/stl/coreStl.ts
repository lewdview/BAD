import type { BuilderParams, Vec3 } from '../../types';
import { isDegenerate, calcNormal } from '../geometryCore';
import { generateToySTL } from './productStl';

export const generateCoreSTL = (params: BuilderParams): string => {
  const coreParams: BuilderParams = {
    ...params,
    length: params.length, // Keep original length
    suctionCup: false,
    baseType: 'flat', // Flattened B2B injection base plug
    engraveStyle: 'none', // Do not engrave initials on the rigid internal plug
    hasBalls: false, // The rigid inner core plug does NOT have the scrotum
    isCore: true // Pass isCore flag
  };
  return generateToySTL(coreParams);
};

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
