import { generateTextHeightmap } from '../textHeightmap';
import type { BuilderParams, Vec3 } from '../../types';
import { getParametricVertex, isDegenerate, calcNormal } from '../geometryCore';
import { getBallCoords, rotateAndShiftFacets, getSphereFacets } from './helpers';

export const generateToySTL = (params: BuilderParams): string => {
  const radialSegments = 32;
  const heightSegments = 64;
  
  const vertices: { x: number; y: number; z: number }[] = [];
  const indices: number[][] = [];
  
  const curvature = params.curvature;
  const isDemoShape = ['candle', 'soap', 'kitchen', 'collectible'].includes(params.shapeType);

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
  
  if (params.hasBalls && !isDemoShape) {
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
