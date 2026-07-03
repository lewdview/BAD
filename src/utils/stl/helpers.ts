import type { BuilderParams, Vec3 } from '../../types';

export const getBallCoords = (params: BuilderParams) => {
  const girth = params.shaftGirth;
  const length = params.length;
  const ballSize = params.ballSize !== undefined ? params.ballSize : 1.0;
  const ballAsymmetry = params.ballAsymmetry !== undefined ? params.ballAsymmetry : 0.0;
  const curvature = params.curvature !== undefined ? params.curvature : 0.0;
  const curvatureAngle = params.curvatureAngle !== undefined ? params.curvatureAngle : 0.0;
  
  const theta = (ballAsymmetry * Math.PI) / 180;
  
  // Radii/scales (slightly taller in Y, flatter in Z for natural sag)
  const R = 0.48 * girth * ballSize; // Balanced base size
  const scaleZ = 0.9;
  const scaleY = 1.15;
  
  // Hang balls down to the base flange
  const targetBottomY = -0.47 * length;
  const y0 = targetBottomY + R * scaleY;

  // Compute local shaft radius at the balls' attachment height (y0)
  const normY_balls = (y0 / length) + 0.5;
  const t_base = Math.min(Math.max(normY_balls / 0.25, 0.0), 1.0);
  const baseGirthVal = params.baseGirth !== undefined ? params.baseGirth : girth;
  const localRadius = params.baseType === 'flat'
    ? baseGirthVal
    : baseGirthVal * (1.0 - t_base) + girth * t_base;

  // Position balls snug against this local radius
  const z0 = localRadius + R * 0.25;
  
  // Left and Right lobe offsets in X scaled by local radius
  const x0_L = -0.25 * localRadius;
  const x0_R = 0.25 * localRadius;
  
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

  // Find minimum Z surface boundary of both lobes (balls are at +Z, prevent crossing into shaft)
  const zMin_L = z_rot_L - R * scaleZ;
  const zMin_R = z_rot_R - R * scaleZ;
  const zMin = Math.min(zMin_L, zMin_R);
  
  // If either lobe crosses z = 0, shift the entire assembly forward
  const zShift = zMin < 0.0 ? -zMin : 0.0;
  
  return {
    left: {
      x: x_rot_L,
      y: y_L,
      z: z_rot_L + zShift,
      r: R
    },
    right: {
      x: x_rot_R,
      y: y_R,
      z: z_rot_R + zShift,
      r: R
    },
    theta,
    zShift,
    base: { x0_L, x0_R, y0, z0 }
  };
};

export const rotateAndShiftFacets = (
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
      const z = p.x * sinT + p.z * cosT + zShift;
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
export const getSphereFacets = (
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

  const isDegenerateLocal = (p1: Vec3, p2: Vec3, p3: Vec3): boolean => {
    const ux = p2.x - p1.x;
    const uy = p2.y - p1.y;
    const uz = p2.z - p1.z;
    const vx = p3.x - p1.x;
    const vy = p3.y - p1.y;
    const vz = p3.z - p1.z;
    
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    
    return Math.sqrt(nx * nx + ny * ny + nz * nz) < 1e-7;
  };

  const addTri = (v0: number, v1: number, v2: number) => {
    const p1 = sphereVerts[v0];
    const p2 = sphereVerts[v1];
    const p3 = sphereVerts[v2];
    if (!isDegenerateLocal(p1, p2, p3)) {
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
