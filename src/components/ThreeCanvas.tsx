import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

interface BuilderParams {
  baseGeometry: string;
  length: number;
  shaftGirth: number;
  baseGirth: number;
  curvature: number;
  texture: string;
  suctionCup: boolean;
  vibrationCore: boolean;
  colorMode: number; // 0 = Solid, 1 = Marble, 2 = Gradient, 3 = Split Pour
  color1: string;
  color2: string;
  isVibrating: boolean;
  showScaleRef: boolean;
  shapeType: string; // 'classic' | 'realistic' | 'fantasy' | 'targeted'
  realisticVeins: number; // 0.0 to 1.0
  realisticGlans: boolean;
  hasBalls: boolean;
  fantasyType: string; // 'dragon' | 'alien' | 'tentacle'
  baseType: string; // 'flared' | 'flat' | 'harness'
  taper: number; // 0.0 to 1.0
  firmness: string; // 'soft' | 'medium' | 'firm' | 'dual-density'
  inclusions: string; // 'none' | 'glitter' | 'metallic' | 'glow'
  thermochromic: boolean;
  internalTube: boolean;
  blacklightMode: boolean;
  arMode: boolean;
  sceneEnvironment: string; // 'studio' | 'shower' | 'case'
}

interface ThreeCanvasProps {
  params: BuilderParams;
}

// Sleek glass smartphone model acting as a 1:1 real-world scale reference (iPhone dimensions: 5.78" x 2.82" x 0.3")
const ScaleReferenceDevice: React.FC = () => {
  return (
    <group position={[-2.8, -0.2, 0]} rotation={[0, 0.2, 0]}>
      {/* Device Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.82, 5.78, 0.3]} />
        <meshPhysicalMaterial 
          color="#a1a1aa" 
          transmission={0.85} 
          roughness={0.15} 
          thickness={0.4} 
          transparent 
          opacity={0.4} 
          clearcoat={1.0}
        />
      </mesh>
      {/* Device Screen Rim */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[2.62, 5.58, 0.01]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.08} 
          wireframe
        />
      </mesh>
      {/* FLOATING TEXT LABEL FOR REAL-WORLD REFERENCE */}
      <mesh position={[0, -3.2, 0]}>
        <boxGeometry args={[2.0, 0.3, 0.01]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export const CustomToyMesh: React.FC<{ params: BuilderParams }> = ({ params }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const innerMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const tubeMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const leftBallMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const rightBallMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const textureId = useMemo(() => {
    switch (params.texture) {
      case 'ribbed': return 1;
      case 'swirled': return 2;
      case 'studded': return 3;
      default: return 0;
    }
  }, [params.texture]);

  const createUniforms = (meshType: number, ballOffset: number = 0, ballYOffset: number = 0) => {
    return {
      uLength: { value: params.length },
      uShaftGirth: { value: params.shaftGirth },
      uBaseGirth: { value: params.baseGirth },
      uCurvature: { value: params.curvature },
      uSuctionCup: { value: params.suctionCup ? 1.0 : 0.0 },
      uGeometryStyle: { value: params.baseGeometry === 'wave' ? 1.0 : params.baseGeometry === 'ergonomic' ? 2.0 : 0.0 },
      uTextureStyle: { value: textureId },
      uColor1: { value: new THREE.Color(params.color1) },
      uColor2: { value: new THREE.Color(params.color2) },
      uColorMode: { value: params.colorMode },
      uTime: { value: 0 },
      uVibration: { value: params.isVibrating ? 1.0 : 0.0 },
      
      // New uniforms
      uMeshType: { value: meshType },
      uShapeType: { value: params.shapeType === 'classic' ? 0.0 : params.shapeType === 'realistic' ? 1.0 : params.shapeType === 'fantasy' ? 2.0 : 3.0 },
      uRealisticVeins: { value: params.realisticVeins },
      uRealisticGlans: { value: params.realisticGlans ? 1.0 : 0.0 },
      uFantasyType: { value: params.fantasyType === 'dragon' ? 0.0 : params.fantasyType === 'alien' ? 1.0 : 2.0 },
      uBaseType: { value: params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0 },
      uTaper: { value: params.taper },
      uFirmness: { value: params.firmness === 'soft' ? 0.0 : params.firmness === 'medium' ? 1.0 : params.firmness === 'firm' ? 2.0 : 3.0 },
      uInclusions: { value: params.inclusions === 'none' ? 0.0 : params.inclusions === 'glitter' ? 1.0 : params.inclusions === 'metallic' ? 2.0 : 3.0 },
      uThermochromic: { value: params.thermochromic ? 1.0 : 0.0 },
      uBlacklightMode: { value: params.blacklightMode ? 1.0 : 0.0 },
      uBallOffset: { value: ballOffset },
      uBallYOffset: { value: ballYOffset },
      uAlpha: { value: 1.0 }
    };
  };

  const outerUniforms = useMemo(() => createUniforms(0), []);
  const innerUniforms = useMemo(() => createUniforms(1), []);
  const tubeUniforms = useMemo(() => createUniforms(3), []);
  const leftBallUniforms = useMemo(() => createUniforms(2, -0.55 * params.shaftGirth, -params.length / 2 + 0.15), []);
  const rightBallUniforms = useMemo(() => createUniforms(2, 0.55 * params.shaftGirth, -params.length / 2 + 0.15), []);

  const updateUniformValuesDirectly = (u: any, meshType: number, ballOffset = 0, ballYOffset = 0) => {
    u.uLength.value = params.length;
    u.uShaftGirth.value = params.shaftGirth;
    u.uBaseGirth.value = params.baseGirth;
    u.uCurvature.value = params.curvature;
    u.uSuctionCup.value = params.suctionCup ? 1.0 : 0.0;
    u.uGeometryStyle.value = params.baseGeometry === 'wave' ? 1.0 : params.baseGeometry === 'ergonomic' ? 2.0 : 0.0;
    u.uTextureStyle.value = textureId;
    u.uColor1.value.set(params.color1);
    u.uColor2.value.set(params.color2);
    u.uColorMode.value = params.colorMode;
    u.uVibration.value = params.isVibrating ? 1.0 : 0.0;
    
    u.uMeshType.value = meshType;
    u.uShapeType.value = params.shapeType === 'classic' ? 0.0 : params.shapeType === 'realistic' ? 1.0 : params.shapeType === 'fantasy' ? 2.0 : 3.0;
    u.uRealisticVeins.value = params.realisticVeins;
    u.uRealisticGlans.value = params.realisticGlans ? 1.0 : 0.0;
    u.uFantasyType.value = params.fantasyType === 'dragon' ? 0.0 : params.fantasyType === 'alien' ? 1.0 : 2.0;
    u.uBaseType.value = params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0;
    u.uTaper.value = params.taper;
    u.uFirmness.value = params.firmness === 'soft' ? 0.0 : params.firmness === 'medium' ? 1.0 : params.firmness === 'firm' ? 2.0 : 3.0;
    u.uInclusions.value = params.inclusions === 'none' ? 0.0 : params.inclusions === 'glitter' ? 1.0 : params.inclusions === 'metallic' ? 2.0 : 3.0;
    u.uThermochromic.value = params.thermochromic ? 1.0 : 0.0;
    u.uBlacklightMode.value = params.blacklightMode ? 1.0 : 0.0;
    u.uBallOffset.value = ballOffset;
    u.uBallYOffset.value = ballYOffset;
    u.uAlpha.value = (meshType === 0 && params.firmness === 'dual-density') ? 0.55 : 1.0;
  };

  updateUniformValuesDirectly(outerUniforms, 0);
  updateUniformValuesDirectly(innerUniforms, 1);
  updateUniformValuesDirectly(tubeUniforms, 3);
  updateUniformValuesDirectly(leftBallUniforms, 2, -0.55 * params.shaftGirth, -params.length / 2 + 0.15);
  updateUniformValuesDirectly(rightBallUniforms, 2, 0.55 * params.shaftGirth, -params.length / 2 + 0.15);

  const elapsedTimeRef = useRef<number>(0);

  useFrame((_state, delta) => {
    elapsedTimeRef.current += delta;
    const time = elapsedTimeRef.current;
    
    const updateMaterialUniforms = (mat: THREE.ShaderMaterial | null, meshType: number, ballOffset = 0, ballYOffset = 0) => {
      if (!mat) return;
      const u = mat.uniforms;
      u.uTime.value = time;
      u.uLength.value = params.length;
      u.uShaftGirth.value = params.shaftGirth;
      u.uBaseGirth.value = params.baseGirth;
      u.uCurvature.value = params.curvature;
      u.uSuctionCup.value = params.suctionCup ? 1.0 : 0.0;
      u.uGeometryStyle.value = params.baseGeometry === 'wave' ? 1.0 : params.baseGeometry === 'ergonomic' ? 2.0 : 0.0;
      u.uTextureStyle.value = textureId;
      u.uColor1.value.set(params.color1);
      u.uColor2.value.set(params.color2);
      u.uColorMode.value = params.colorMode;
      u.uVibration.value = params.isVibrating ? 1.0 : 0.0;
      
      u.uMeshType.value = meshType;
      u.uShapeType.value = params.shapeType === 'classic' ? 0.0 : params.shapeType === 'realistic' ? 1.0 : params.shapeType === 'fantasy' ? 2.0 : 3.0;
      u.uRealisticVeins.value = params.realisticVeins;
      u.uRealisticGlans.value = params.realisticGlans ? 1.0 : 0.0;
      u.uFantasyType.value = params.fantasyType === 'dragon' ? 0.0 : params.fantasyType === 'alien' ? 1.0 : 2.0;
      u.uBaseType.value = params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0;
      u.uTaper.value = params.taper;
      u.uFirmness.value = params.firmness === 'soft' ? 0.0 : params.firmness === 'medium' ? 1.0 : params.firmness === 'firm' ? 2.0 : 3.0;
      u.uInclusions.value = params.inclusions === 'none' ? 0.0 : params.inclusions === 'glitter' ? 1.0 : params.inclusions === 'metallic' ? 2.0 : 3.0;
      u.uThermochromic.value = params.thermochromic ? 1.0 : 0.0;
      u.uBlacklightMode.value = params.blacklightMode ? 1.0 : 0.0;
      u.uBallOffset.value = ballOffset;
      u.uBallYOffset.value = ballYOffset;
      u.uAlpha.value = (meshType === 0 && params.firmness === 'dual-density') ? 0.55 : 1.0;
    };

    updateMaterialUniforms(outerMaterialRef.current, 0);
    updateMaterialUniforms(innerMaterialRef.current, 1);
    updateMaterialUniforms(tubeMaterialRef.current, 3);
    updateMaterialUniforms(leftBallMaterialRef.current, 2, -0.55 * params.shaftGirth, -params.length / 2 + 0.15);
    updateMaterialUniforms(rightBallMaterialRef.current, 2, 0.55 * params.shaftGirth, -params.length / 2 + 0.15);

    if (groupRef.current && params.isVibrating) {
      const vibrationFreq = 95.0;
      const vibrationAmp = 0.004;
      groupRef.current.position.set(
        Math.sin(time * vibrationFreq) * vibrationAmp,
        Math.cos(time * vibrationFreq * 0.95) * vibrationAmp,
        Math.sin(time * vibrationFreq * 1.05) * vibrationAmp
      );
    } else if (groupRef.current) {
      groupRef.current.position.set(0, 0, 0);
    }
  });

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    uniform float uLength;
    uniform float uShaftGirth;
    uniform float uBaseGirth;
    uniform float uCurvature;
    uniform float uSuctionCup;
    uniform float uGeometryStyle;
    uniform float uVibration;
    uniform float uTime;
    
    uniform float uMeshType;
    uniform float uShapeType;
    uniform float uRealisticVeins;
    uniform float uRealisticGlans;
    uniform float uFantasyType;
    uniform float uBaseType;
    uniform float uTaper;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vec3 pos = position; // base cylinder is height 1.0, so y goes from -0.5 to 0.5
      float normY = pos.y + 0.5;

      if (uMeshType == 2.0) {
        // Balls: keep local sphere coordinates, do not bend or taper
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        vPosition = pos;
        gl_Position = projectionMatrix * mvPosition;
        return;
      }

      // Base flare / Suction Cup / Harness ring / Flat Base
      float shapeScale = uShaftGirth;
      
      // Apply base profile
      if (normY < 0.25) {
        float t = normY / 0.25;
        if (uBaseType == 0.0) {
          // Flared Suction Cup
          shapeScale = mix(uBaseGirth, uShaftGirth, t);
          if (uSuctionCup > 0.5 && normY < 0.1) {
            float t2 = normY / 0.1;
            float flare = pow(1.0 - t2, 2.2);
            shapeScale = mix(uBaseGirth, uBaseGirth * 2.3, flare);
          }
        } else if (uBaseType == 1.0) {
          // Flat base
          shapeScale = uBaseGirth;
        } else if (uBaseType == 2.0) {
          // Harness collar
          float groove = 0.0;
          if (normY > 0.08 && normY < 0.22) {
            float gt = (normY - 0.08) / 0.14;
            groove = 0.22 * sin(gt * 3.14159);
          }
          shapeScale = mix(uBaseGirth, uShaftGirth, t) - groove * uShaftGirth;
        }
      } 
      // Head curvature details (bulbous head & corona ridge)
      else if (normY > 0.76) {
        float t = (normY - 0.76) / 0.24;
        float ridge = 0.0;
        
        if (uShapeType == 1.0 || uRealisticGlans > 0.5) {
          // Realistic Glans
          float angle = atan(pos.z, pos.x);
          float cleft = 0.035 * cos(angle * 2.0);
          if (t < 0.25) {
            ridge = 0.18 * sin((t / 0.25) * 3.14159);
          }
          float dome = sqrt(1.0 - pow(t, 2.0));
          shapeScale = (uShaftGirth + ridge + cleft) * dome;
        } else {
          // Classic Glans
          if (t < 0.25) {
            ridge = 0.14 * sin((t / 0.25) * 3.14159);
          }
          float dome = sqrt(1.0 - pow(t, 2.0));
          shapeScale = (uShaftGirth + ridge) * dome;
        }
      }

      // Taper (applied continuously across the main shaft body)
      float taperScale = mix(1.0 + uTaper * 0.20, 1.0 - uTaper * 0.45, normY);
      shapeScale *= taperScale;

      // Geometry styles (Waves / G-spot necking / Fantasy types)
      if (uShapeType == 2.0) {
        // Fantasy geometries
        if (normY >= 0.25 && normY <= 0.76) {
          float angle = atan(pos.z, pos.x);
          if (uFantasyType == 0.0) {
            // Dragon: ridged nodes + scales
            float dragonKnot = 0.14 * sin(pos.y * 2.5);
            float scaleBump = 0.07 * cos(angle * 5.0 + pos.y * 9.0);
            shapeScale += dragonKnot + scaleBump;
          } else if (uFantasyType == 1.0) {
            // Alien: egg nodes + ribs
            float alienRidge = 0.16 * sin(pos.y * 3.5);
            float alienBumps = 0.04 * sin(angle * 3.0 + pos.y * 2.0);
            shapeScale += alienRidge + alienBumps;
          } else if (uFantasyType == 2.0) {
            // Tentacle: spiral rings
            float spiral = sin(pos.y * 5.5 - angle * 2.0);
            shapeScale += 0.12 * smoothstep(0.0, 1.0, spiral);
          }
        }
      } else {
        // Standard shape styles
        if (uGeometryStyle > 0.5 && uGeometryStyle < 1.5) {
          // Wave
          if (normY >= 0.25 && normY <= 0.76) {
            shapeScale += sin((normY - 0.25) * 22.0) * 0.07;
          }
        } else if (uGeometryStyle > 1.5) {
          // Ergonomic
          if (normY > 0.4 && normY < 0.76) {
            shapeScale -= sin((normY - 0.4) / 0.36 * 3.14159) * 0.14;
          }
        }
      }

      // Apply inner core scaling
      if (uMeshType == 1.0) {
        // Inner Core: stop slightly below tip to stay internal
        float innerScale = 0.46;
        if (normY > 0.82) {
          float cap = (1.0 - normY) / 0.18;
          innerScale *= cap;
        }
        shapeScale *= innerScale;
      }
      // Apply internal tube scaling
      else if (uMeshType == 3.0) {
        shapeScale *= 0.06;
      }

      pos.x *= shapeScale;
      pos.z *= shapeScale;

      // Oval flat-head shaping for ergonomic curve / targeted
      if ((uGeometryStyle > 1.5 || uShapeType == 3.0) && normY > 0.6) {
        float flatFactor = (normY - 0.6) / 0.4;
        pos.z *= (1.0 - flatFactor * 0.28);
        pos.x *= (1.0 + flatFactor * 0.18);
      }

      // Curvature bend along X
      if (normY > 0.25) {
        float curveT = (normY - 0.25) / 0.75;
        pos.x += pow(curveT, 3.0) * uCurvature * 1.9;
      }

      // Scale height
      pos.y *= uLength;

      // Live vibration micro-ripple
      if (uVibration > 0.5) {
        pos.x += sin(uTime * 105.0 + pos.y * 18.0) * 0.007;
        pos.z += cos(uTime * 95.0 + pos.y * 15.0) * 0.007;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vPosition = pos;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform int uColorMode;
    uniform int uTextureStyle;
    uniform float uTime;
    uniform float uVibration;
    uniform float uLength;
    uniform float uShaftGirth;
    
    uniform float uMeshType;
    uniform float uShapeType;
    uniform float uRealisticVeins;
    uniform float uRealisticGlans;
    uniform float uFantasyType;
    uniform float uBaseType;
    uniform float uTaper;
    uniform float uFirmness;
    uniform float uInclusions;
    uniform float uThermochromic;
    uniform float uBlacklightMode;
    uniform float uBallOffset;
    uniform float uBallYOffset;
    uniform float uAlpha;

    // 3D hash & noise for seamless marble swirl
    float hash3(vec3 p) {
      p = fract(p * vec3(443.8975, 397.2973, 491.1871));
      p += dot(p.xyz, p.yzx + 19.19);
      return fract(p.x * p.y * p.z);
    }

    float noise3(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);
      
      return mix(
        mix(
          mix(hash3(i + vec3(0.0,0.0,0.0)), hash3(i + vec3(1.0,0.0,0.0)), u.x),
          mix(hash3(i + vec3(0.0,1.0,0.0)), hash3(i + vec3(1.0,1.0,0.0)), u.x),
          u.y
        ),
        mix(
          mix(hash3(i + vec3(0.0,0.0,1.0)), hash3(i + vec3(1.0,0.0,1.0)), u.x),
          mix(hash3(i + vec3(0.0,1.0,1.0)), hash3(i + vec3(1.0,1.0,1.0)), u.x),
          u.y
        ),
        u.z
      );
    }

    float fbm3(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100.0);
      for (int i = 0; i < 4; ++i) {
        v += a * noise3(p);
        p = p * 2.02 + shift;
        a *= 0.5;
      }
      return v;
    }

    // Finite difference bump mapping helper
    float getBump(vec3 pos, float normY, int textureStyle) {
      if (normY <= 0.22 || normY >= 0.78) return 0.0;
      
      float fade = smoothstep(0.22, 0.28, normY) * (1.0 - smoothstep(0.72, 0.78, normY));
      
      if (textureStyle == 1) { // Concentric Ribbed
        float arg = pos.y * 18.0;
        float s = sin(arg);
        float val = smoothstep(-0.3, 0.5, s);
        return val * 0.06 * fade;
      } 
      else if (textureStyle == 2) { // Helical Swirl
        float angle = atan(pos.z, pos.x);
        float arg = pos.y * 12.0 + angle * 4.0;
        float s = sin(arg);
        float val = smoothstep(-0.3, 0.5, s);
        return val * 0.06 * fade;
      } 
      else if (textureStyle == 3) { // Sensory Studded
        float angle = atan(pos.z, pos.x);
        float sY = sin(pos.y * 22.0);
        float sA = sin(angle * 12.0 + pos.y * 6.0);
        float studs = max(sY * sA, 0.0);
        return pow(studs, 2.5) * 0.08 * fade;
      }
      return 0.0;
    }

    // Organic Veins bump function
    float getVeinsBump(vec3 pos, float normY, float shapeType, float realisticVeins) {
      if (shapeType < 0.5 || shapeType > 1.5 || realisticVeins < 0.05) return 0.0;
      if (normY <= 0.2 || normY >= 0.8) return 0.0;
      
      float fade = smoothstep(0.2, 0.3, normY) * (1.0 - smoothstep(0.74, 0.8, normY));
      
      // Two organic winding veins using 3D noise
      float n1 = noise3(pos * vec3(1.6, 1.3, 1.6) + vec3(1.2, 3.4, 0.5));
      float vein1 = smoothstep(0.62, 0.67, n1) * (1.0 - smoothstep(0.67, 0.72, n1)) * 4.0;
      
      float n2 = noise3(pos * vec3(1.4, 1.5, 1.4) + vec3(-2.0, -1.0, 4.0));
      float vein2 = smoothstep(0.60, 0.65, n2) * (1.0 - smoothstep(0.65, 0.70, n2)) * 4.0;
      
      return max(vein1, vein2) * 0.022 * realisticVeins * fade;
    }

    float getCombinedBump(vec3 pos, float normY, int textureStyle, float shapeType, float realisticVeins) {
      float b = getBump(pos, normY, textureStyle);
      float v = getVeinsBump(pos, normY, shapeType, realisticVeins);
      return b + v;
    }

    void main() {
      if (uMeshType == 3.0) {
        // Ejaculation Tube: opaque milk white
        gl_FragColor = vec4(0.96, 0.96, 0.98, 0.92);
        return;
      }

      vec3 normalVec = normalize(vNormal);
      vec3 viewVec = normalize(vViewPosition);
      vec3 lightVec = normalize(vec3(1.2, 1.5, 2.0));

      float normY = (vPosition.y + (uLength / 2.0)) / uLength;

      // Adjust coordinate system if this is a ball mesh
      vec3 adjPos = vPosition;
      if (uMeshType == 2.0) {
        adjPos.x += uBallOffset;
        adjPos.y += uBallYOffset;
        normY = (adjPos.y + (uLength / 2.0)) / uLength;
      }

      // 1. PROCEDURAL BUMP MAPPING via Finite Differences
      float bumpCenter = getCombinedBump(adjPos, normY, uTextureStyle, uShapeType, uRealisticVeins);
      
      vec3 up = vec3(0.0, 1.0, 0.0);
      vec3 tangent = normalize(cross(normalVec, up));
      vec3 bitangent = cross(normalVec, tangent);
      
      float eps = 0.015;
      float bumpT = getCombinedBump(adjPos + tangent * eps, normY, uTextureStyle, uShapeType, uRealisticVeins);
      float bumpB = getCombinedBump(adjPos + bitangent * eps, normY, uTextureStyle, uShapeType, uRealisticVeins);
      
      float gradT = (bumpT - bumpCenter) / eps;
      float gradB = (bumpB - bumpCenter) / eps;
      
      normalVec = normalize(normalVec - tangent * gradT * 0.25 - bitangent * gradB * 0.25);

      // 2. CREVICE AMBIENT OCCLUSION (AO)
      float ao = 1.0;
      if (normY > 0.22 && normY < 0.78) {
        if (uTextureStyle == 1 || uTextureStyle == 2) {
          float normalizedBump = bumpCenter / (0.06 * smoothstep(0.22, 0.28, normY) * (1.0 - smoothstep(0.72, 0.78, normY)) + 0.0001);
          ao = mix(0.55, 1.0, smoothstep(0.0, 0.5, normalizedBump));
        } else if (uTextureStyle == 3) {
          float normalizedBump = bumpCenter / (0.08 * smoothstep(0.22, 0.28, normY) * (1.0 - smoothstep(0.72, 0.78, normY)) + 0.0001);
          ao = mix(0.65, 1.0, smoothstep(0.0, 0.4, normalizedBump));
        }
      }
      
      float baseTransition = smoothstep(0.0, 0.18, normY);
      ao *= mix(0.6, 1.0, baseTransition);

      // 3. MATERIAL COLOR (Solid / Liquid Marbled / Gradient / Split Pour)
      vec3 baseColor = uColor1;

      if (uMeshType == 1.0) {
        // Inner Core: slightly more saturated and solid
        baseColor = mix(uColor1 * 1.1, vec3(1.0), 0.15);
      } else {
        if (uColorMode == 1) {
          // Marble
          vec3 p = adjPos * 0.7;
          vec3 q = vec3(fbm3(p), fbm3(p + vec3(1.7, 3.2, 2.1)), fbm3(p + vec3(4.3, 0.9, 5.2)));
          vec3 r = vec3(fbm3(p + q * 2.5 + vec3(2.5, 4.3, 1.1)), fbm3(p + q * 1.8 + vec3(7.3, 1.9, 8.4)), fbm3(p + q * 2.2));
          float f = fbm3(p + r * 3.5 + vec3(uTime * 0.05, 0.0, 0.0));
          float mixTerm = smoothstep(0.15, 0.85, f);
          baseColor = mix(uColor1, uColor2, mixTerm);
        } else if (uColorMode == 2) {
          // Gradient
          baseColor = mix(uColor1, uColor2, normY);
        } else if (uColorMode == 3) {
          // Split Pour (wavy vertical split)
          float splitNoise = noise3(adjPos * vec3(1.6, 2.2, 1.6)) * 0.07;
          float splitLine = adjPos.x + splitNoise;
          baseColor = mix(uColor1, uColor2, smoothstep(-0.02, 0.02, splitLine));
        }
      }

      // Thermochromic Heat shift (flowing from tip)
      if (uThermochromic > 0.5 && uMeshType != 1.0) {
        float heatFactor = smoothstep(0.55, 0.95, normY + sin(uTime * 1.4) * 0.04);
        vec3 heatColor = vec3(0.96, 0.25, 0.45); // vibrant thermo-pink
        baseColor = mix(baseColor, heatColor, heatFactor);
      }

      // 4. PHOTOGRAPHIC LIGHTING WITH HALF-LAMBERT DIFFUSE
      float wrap = 0.5;
      float diff = max((dot(normalVec, lightVec) + wrap) / (1.0 + wrap), 0.0);

      // 5. FRESNEL & DUAL-LOBE SPECULARITY
      float fresnel = pow(1.0 - max(dot(normalVec, viewVec), 0.0), 4.5);
      
      vec3 halfVec = normalize(lightVec + viewVec);
      float specSharp = pow(max(dot(normalVec, halfVec), 0.0), 64.0) * 0.2;
      float specSatin = pow(max(dot(normalVec, halfVec), 0.0), 8.0) * 0.08;
      vec3 specularTotal = vec3(specSharp + specSatin) * mix(0.8, 1.4, fresnel);

      // 6. STUDIO ENVIRONMENT REFLECTION
      vec3 reflectVec = reflect(-viewVec, normalVec);
      float skyReflection = smoothstep(0.75, 0.98, reflectVec.z) * 0.14;
      skyReflection += smoothstep(0.8, 0.98, -reflectVec.x) * 0.1;
      vec3 envColor = vec3(skyReflection) * mix(vec3(0.5, 0.6, 0.8), vec3(1.0), skyReflection);

      // 7. SUBSURFACE SCATTERING (SSS) Backlit Rim glow
      float radialThickness = length(adjPos.xz) / (uShaftGirth * 1.5 + 0.0001);
      float thickness = radialThickness + bumpCenter * 2.0;
      
      if (normY > 0.76) {
        float tipFactor = (1.0 - normY) / 0.24;
        thickness *= smoothstep(0.0, 1.0, tipFactor);
      }
      
      float sssFactor = exp(-thickness * 2.5);
      float backlight = max(dot(-viewVec, lightVec), 0.0);
      vec3 sssColor = vec3(0.98, 0.35, 0.4) * sssFactor * (backlight * 0.7 + 0.3) * 0.45;

      // 8. FINAL SHADING BLEND
      vec3 finalColor = baseColor * (0.24 + diff * 0.76) * ao + specularTotal + sssColor + envColor;

      // Inclusions (Glitter / Metallic)
      if (uInclusions > 0.5 && uInclusions < 1.5) {
        // Glitter sparkle specks
        float sparkleNoise = hash3(floor(adjPos * 85.0));
        if (sparkleNoise > 0.93) {
          vec3 flakeNormal = normalize(normalVec + (vec3(
            hash3(adjPos * 90.0),
            hash3(adjPos * 95.0),
            hash3(adjPos * 100.0)
          ) - 0.5) * 0.7);
          float flakeSpec = pow(max(dot(flakeNormal, halfVec), 0.0), 128.0);
          float sparkle = smoothstep(0.85, 1.0, flakeSpec) * 3.5;
          float twinkle = sin(uTime * 4.5 + sparkleNoise * 12.0) * 0.45 + 0.55;
          specularTotal += vec3(sparkle * twinkle) * vec3(0.95, 0.98, 1.0);
        }
      }
      
      if (uInclusions > 1.5 && uInclusions < 2.5) {
        // Metallic sheen
        specularTotal *= 2.2;
        vec3 metalSheen = mix(vec3(1.0), vec3(1.0, 0.82, 0.4), 0.5);
        finalColor += envColor * metalSheen * 0.7;
      }

      if (uVibration > 0.5) {
        float glowPulse = sin(uTime * 20.0) * 0.06 + 0.06;
        finalColor += vec3(0.95, 0.2, 0.6) * glowPulse;
      }

      // Blacklight UV / Fluorescent Glow
      if (uBlacklightMode > 0.5) {
        // Dim the normal reflections
        finalColor = mix(finalColor * 0.15, finalColor, 0.1);
        
        // Fluorescent base glow
        vec3 uvGlow = vec3(0.18, 0.05, 0.45) * 0.35;
        
        // Convert baseColor to fluorescent emission
        float brightness = dot(baseColor, vec3(0.299, 0.587, 0.114));
        vec3 neonColor = mix(vec3(0.9, 0.1, 0.75), vec3(0.1, 0.85, 0.9), sin(adjPos.y * 1.5 + uTime) * 0.5 + 0.5);
        vec3 fluorEmission = neonColor * brightness * 0.8;
        
        finalColor += uvGlow + fluorEmission;
        
        // Glow pigment
        if (uInclusions > 2.5 && uInclusions < 3.5) {
          finalColor += vec3(0.2, 0.95, 0.35) * 0.85;
        }
      }

      gl_FragColor = vec4(finalColor, uAlpha);
    }
  `;

  return (
    <group ref={groupRef}>
      {/* Outer Shaft Mesh */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 1.0, 128, 128, true]} />
        <shaderMaterial
          ref={outerMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={outerUniforms}
          transparent={params.firmness === 'dual-density'}
          depthWrite={params.firmness !== 'dual-density'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Core Mesh (only rendered for Dual-Density) */}
      {params.firmness === 'dual-density' && (
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 1.0, 128, 128, true]} />
          <shaderMaterial
            ref={innerMaterialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={innerUniforms}
            transparent={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Internal Ejaculation Tube Mesh */}
      {params.internalTube && (
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 1.0, 64, 64, true]} />
          <shaderMaterial
            ref={tubeMaterialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={tubeUniforms}
            transparent={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Testicles Base (only rendered if hasBalls is true) */}
      {params.hasBalls && (
        <>
          {/* Left Ball */}
          <mesh 
            position={[-0.55 * params.shaftGirth, -params.length / 2 + 0.15, -0.1]} 
            castShadow 
            receiveShadow
          >
            <sphereGeometry args={[0.5 * params.shaftGirth, 32, 32]} />
            <shaderMaterial
              ref={leftBallMaterialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={leftBallUniforms}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Right Ball */}
          <mesh 
            position={[0.55 * params.shaftGirth, -params.length / 2 + 0.15, -0.1]} 
            castShadow 
            receiveShadow
          >
            <sphereGeometry args={[0.5 * params.shaftGirth, 32, 32]} />
            <shaderMaterial
              ref={rightBallMaterialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={rightBallUniforms}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

const SceneSetup = () => {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = null;
  }, [scene]);
  return null;
};

const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch((err) => {
        console.error("Failed to access camera", err);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
        pointerEvents: 'none',
        transform: 'scaleX(-1)'
      }}
    />
  );
};

const ShowerWater: React.FC<{ floorY: number }> = ({ floorY }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;
  
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6.0;
      pos[i * 3 + 1] = Math.random() * 8.0 + floorY;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
      sp[i] = 4.0 + Math.random() * 3.0;
    }
    return [pos, sp];
  }, [floorY]);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    if (!posAttr) return;
    
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y -= speeds[i] * delta;
      if (y < floorY) {
        y = floorY + 7.0;
        posAttr.setX(i, (Math.random() - 0.5) * 6.0);
        posAttr.setZ(i, (Math.random() - 0.5) * 4.0);
      }
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a5f3fc"
        size={0.06}
        transparent
        opacity={0.6}
      />
    </points>
  );
};

const ShowerEnvironment: React.FC<{ length: number }> = ({ length }) => {
  const floorY = -length / 2 - 0.3;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial 
          color="#334155" 
          roughness={0.4} 
          metalness={0.1}
        />
      </mesh>
      
      <gridHelper 
        args={[15, 15, '#1e293b', '#1e293b']}
        position={[0, floorY + 0.005, 0]}
      />

      <mesh position={[0, 0.5, -2.5]}>
        <planeGeometry args={[8, 8]} />
        <meshPhysicalMaterial 
          color="#bae6fd"
          transmission={0.95} 
          roughness={0.05} 
          thickness={0.5} 
          transparent 
          opacity={0.3} 
        />
      </mesh>

      <ShowerWater floorY={floorY} />
    </group>
  );
};

const LuxuryCaseEnvironment: React.FC<{ length: number; shaftGirth: number }> = ({ length, shaftGirth }) => {
  const floorY = -length / 2 - 0.3;
  const boxWidth = Math.max(shaftGirth * 4.0, 4.0);
  const boxHeight = length + 2.0;
  const boxDepth = 3.0;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY + 0.05, -boxDepth / 4]} receiveShadow>
        <planeGeometry args={[boxWidth, boxDepth]} />
        <meshStandardMaterial 
          color="#0f172a" 
          roughness={0.9} 
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, floorY + boxHeight / 2, -boxDepth / 2]} receiveShadow>
        <planeGeometry args={[boxWidth, boxHeight]} />
        <meshStandardMaterial 
          color="#0f172a" 
          roughness={0.9} 
          metalness={0.1} 
        />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]} position={[-boxWidth / 2, floorY + boxHeight / 2, -boxDepth / 4]} receiveShadow>
        <planeGeometry args={[boxDepth, boxHeight]} />
        <meshStandardMaterial 
          color="#0f172a" 
          roughness={0.9} 
          metalness={0.1} 
        />
      </mesh>

      <mesh rotation={[0, -Math.PI / 2, 0]} position={[boxWidth / 2, floorY + boxHeight / 2, -boxDepth / 4]} receiveShadow>
        <planeGeometry args={[boxDepth, boxHeight]} />
        <meshStandardMaterial 
          color="#0f172a" 
          roughness={0.9} 
          metalness={0.1} 
        />
      </mesh>

      <mesh position={[0, floorY + boxHeight, 0]}>
        <boxGeometry args={[boxWidth + 0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, floorY, 0]}>
        <boxGeometry args={[boxWidth + 0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[-boxWidth / 2, floorY + boxHeight / 2, 0]}>
        <boxGeometry args={[0.1, boxHeight, 0.1]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[boxWidth / 2, floorY + boxHeight / 2, 0]}>
        <boxGeometry args={[0.1, boxHeight, 0.1]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
};

const CustomGridHelper: React.FC<{ length: number }> = ({ length }) => {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useEffect(() => {
    if (gridRef.current) {
      const material = gridRef.current.material as THREE.LineBasicMaterial;
      material.transparent = true;
      material.opacity = 0.08;
    }
  }, []);

  return (
    <gridHelper 
      ref={gridRef}
      args={[18, 18, '#ffffff', '#ffffff']} 
      position={[0, -length / 2 - 0.3, 0]} 
    />
  );
};

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ params }) => {

  // Dynamic calculations for physical dimension text HUD
  const insertableLength = useMemo(() => {
    return params.suctionCup ? (params.length - 0.8).toFixed(1) : params.length.toFixed(1);
  }, [params.length, params.suctionCup]);

  const shaftDiameter = useMemo(() => {
    return (params.shaftGirth * 1.4).toFixed(2);
  }, [params.shaftGirth]);

  const baseDiameter = useMemo(() => {
    return (params.baseGirth * 2.0).toFixed(2);
  }, [params.baseGirth]);

  return (
    <div 
      className="canvas-container"
      style={{
        background: params.arMode 
          ? 'transparent' 
          : 'radial-gradient(circle at 50% 50%, var(--bg-tertiary) 0%, var(--bg-primary) 100%)'
      }}
    >
      {params.arMode && <WebcamFeed />}

      <Canvas
        camera={{ position: [0, 1.8, 8.0], fov: 40 }}
        shadows={{ type: THREE.PCFShadowMap }}
        style={{ position: 'relative', zIndex: 1, background: 'transparent' }}
      >
        <SceneSetup />
        
        {/* Dynamic environmental lights */}
        {params.sceneEnvironment === 'shower' ? (
          <>
            <ambientLight 
              intensity={params.blacklightMode ? 0.04 : 0.6} 
              color="#bae6fd" 
            />
            <directionalLight 
              position={[7, 9, 8]} 
              intensity={params.blacklightMode ? 0.08 : 1.3} 
              color="#ffffff"
              castShadow 
              shadow-mapSize-width={2048} 
              shadow-mapSize-height={2048} 
            />
            <directionalLight 
              position={[-7, 5, -8]} 
              intensity={params.blacklightMode ? 0.4 : 1.2} 
              color={params.blacklightMode ? "#581c87" : "#38bdf8"} 
            />
            <pointLight 
              position={[0, -6, 3]} 
              intensity={params.blacklightMode ? 0.02 : 0.3} 
              color="#0ea5e9"
            />
          </>
        ) : params.sceneEnvironment === 'case' ? (
          <>
            <ambientLight 
              intensity={params.blacklightMode ? 0.04 : 0.2} 
              color="#fef08a" 
            />
            <directionalLight 
              position={[7, 9, 8]} 
              intensity={params.blacklightMode ? 0.08 : 1.5} 
              color="#ffffff"
              castShadow 
              shadow-mapSize-width={2048} 
              shadow-mapSize-height={2048} 
            />
            <directionalLight 
              position={[-7, 5, -8]} 
              intensity={params.blacklightMode ? 0.4 : 1.0} 
              color={params.blacklightMode ? "#581c87" : "#fbbf24"} 
            />
            <pointLight 
              position={[0, -6, 3]} 
              intensity={params.blacklightMode ? 0.02 : 0.1} 
              color="#fbbf24"
            />
          </>
        ) : (
          <>
            <ambientLight intensity={params.blacklightMode ? 0.04 : 0.5} />
            <directionalLight 
              position={[7, 9, 8]} 
              intensity={params.blacklightMode ? 0.08 : 1.1} 
              castShadow 
              shadow-mapSize-width={2048} 
              shadow-mapSize-height={2048} 
            />
            <directionalLight 
              position={[-7, 5, -8]} 
              intensity={params.blacklightMode ? 0.4 : 0.8} 
              color={params.blacklightMode ? "#581c87" : "#fda4af"} 
            />
            <pointLight position={[0, -6, 3]} intensity={params.blacklightMode ? 0.02 : 0.4} />
          </>
        )}
        
        <Center>
          <CustomToyMesh params={params} />
        </Center>
        
        {/* Transparent glass device scale reference comparison */}
        {params.showScaleRef && !params.arMode && <ScaleReferenceDevice />}
        
        {/* Scenery Situations Environments */}
        {!params.arMode && params.sceneEnvironment === 'shower' && (
          <ShowerEnvironment length={params.length} />
        )}
        {!params.arMode && params.sceneEnvironment === 'case' && (
          <LuxuryCaseEnvironment length={params.length} shaftGirth={params.shaftGirth} />
        )}

        {/* Studio floor projection grid */}
        {params.sceneEnvironment === 'studio' && !params.arMode && (
          <CustomGridHelper length={params.length} />
        )}

        <OrbitControls 
          enablePan={params.arMode}
          minDistance={3.5}
          maxDistance={30.0}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>

      {/* FLOATING REAL-WORLD SPECIFICATIONS HUD PANEL */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '16px', 
          right: '16px', 
          backgroundColor: 'var(--bg-glass)', 
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          fontSize: '12px',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '210px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-gold)' }}>
          Real-World Scale Specs
        </div>
        <hr style={{ borderColor: 'var(--border-color)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Total Length:</span>
          <span style={{ fontWeight: 600 }}>{params.length.toFixed(1)} in</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Insertable:</span>
          <span style={{ fontWeight: 600 }}>{insertableLength} in</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Shaft Ø (Girth):</span>
          <span style={{ fontWeight: 600 }}>{shaftDiameter} in</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Base Flange Ø:</span>
          <span style={{ fontWeight: 600 }}>{baseDiameter} in</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Curvature Bend:</span>
          <span style={{ fontWeight: 600 }}>{Math.abs(params.curvature * 15).toFixed(0)}°</span>
        </div>
      </div>

      {/* Size Reference toggle notice */}
      {params.showScaleRef && (
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '16px', 
            right: '16px', 
            backgroundColor: 'rgba(255,255,255,0.06)', 
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            fontSize: '11px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
          1:1 Scale Device Overlay (5.8" iPhone Reference)
        </div>
      )}

      {/* Viewport UI Controls */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '16px', 
          left: '16px', 
          backgroundColor: 'var(--bg-glass)', 
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 14px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.05em'
        }}
      >
        DRAG TO ROTATE | PINCH TO ZOOM
      </div>
      
      {params.isVibrating && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '16px', 
            left: '16px', 
            backgroundColor: 'rgba(217, 70, 239, 0.12)', 
            border: '1px solid var(--accent-pink)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 18px',
            fontSize: '11px',
            color: 'var(--accent-pink)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 15px rgba(217, 70, 239, 0.25)',
            letterSpacing: '0.05em'
          }}
        >
          <span 
            style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent-pink)', 
              display: 'inline-block',
              animation: 'pulse 1s infinite alternate'
            }}
          />
          VIBRO-CORE SIGNAL ON
        </div>
      )}
    </div>
  );
};
