/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps */
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateTextHeightmap } from '../../utils/textHeightmap';
import type { BuilderParams } from '../../types';

interface ToyModelProps {
  params: BuilderParams;
  demoMode?: boolean;
}

export const ToyModel: React.FC<ToyModelProps> = ({ params }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const innerMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const tubeMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const leftBallMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const rightBallMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const centerBallMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate offscreen text heightmap
  const textHeightmap = useMemo(() => {
    return generateTextHeightmap(
      params.engraveText || '',
      params.engraveSize !== undefined ? params.engraveSize : 44,
      1.0 - (params.engravePosition !== undefined ? params.engravePosition : 0.5)
    );
  }, [params.engraveText, params.engraveSize, params.engravePosition]);

  const textTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(textHeightmap.canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }, [textHeightmap]);

  useEffect(() => {
    return () => {
      textTexture.dispose();
    };
  }, [textTexture]);

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
      uShapeType: { value: 
        params.shapeType === 'classic' ? 0.0 : 
        params.shapeType === 'realistic' ? 1.0 : 
        params.shapeType === 'fantasy' ? 2.0 : 
        params.shapeType === 'targeted' ? 3.0 : 
        params.shapeType === 'candle' ? 4.0 : 
        params.shapeType === 'soap' ? 5.0 : 
        params.shapeType === 'kitchen' ? 6.0 : 7.0 
      },
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
      uAlpha: { value: 1.0 },
      uTextTexture: { value: textTexture },
      uTextStyle: { value: (!params.engraveStyle || params.engraveStyle === 'none') ? 0.0 : params.engraveStyle === 'embossed' ? 1.0 : 2.0 },
      uTextDepth: { value: params.engraveDepth !== undefined ? params.engraveDepth : 0.5 }
    };
  };

  const outerUniforms = useMemo(() => createUniforms(0), []);
  const innerUniforms = useMemo(() => createUniforms(1), []);
  const tubeUniforms = useMemo(() => createUniforms(3), []);
  const leftBallUniforms = useMemo(() => createUniforms(2, -0.55 * params.shaftGirth, -0.25 * params.length), []);
  const rightBallUniforms = useMemo(() => createUniforms(2, 0.55 * params.shaftGirth, -0.25 * params.length), []);
  const centerBallUniforms = useMemo(() => createUniforms(2, 0.0, -0.28 * params.length), []);

  useEffect(() => {
    const update = (u: Record<string, THREE.IUniform>, material: THREE.ShaderMaterial | null, meshType: number, ballOffset = 0, ballYOffset = 0) => {
      // 1. Update local uniforms object reference
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
      u.uShapeType.value = 
        params.shapeType === 'classic' ? 0.0 : 
        params.shapeType === 'realistic' ? 1.0 : 
        params.shapeType === 'fantasy' ? 2.0 : 
        params.shapeType === 'targeted' ? 3.0 : 
        params.shapeType === 'candle' ? 4.0 : 
        params.shapeType === 'soap' ? 5.0 : 
        params.shapeType === 'kitchen' ? 6.0 : 7.0;
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
      u.uTextTexture.value = textTexture;
      u.uTextStyle.value = (!params.engraveStyle || params.engraveStyle === 'none') ? 0.0 : params.engraveStyle === 'embossed' ? 1.0 : 2.0;
      u.uTextDepth.value = params.engraveDepth !== undefined ? params.engraveDepth : 0.5;

      // 2. Update active WebGL material instance uniforms directly
      if (material) {
        const mu = material.uniforms;
        mu.uLength.value = params.length;
        mu.uShaftGirth.value = params.shaftGirth;
        mu.uBaseGirth.value = params.baseGirth;
        mu.uCurvature.value = params.curvature;
        mu.uSuctionCup.value = params.suctionCup ? 1.0 : 0.0;
        mu.uGeometryStyle.value = params.baseGeometry === 'wave' ? 1.0 : params.baseGeometry === 'ergonomic' ? 2.0 : 0.0;
        mu.uTextureStyle.value = textureId;
        mu.uColor1.value.set(params.color1);
        mu.uColor2.value.set(params.color2);
        mu.uColorMode.value = params.colorMode;
        mu.uVibration.value = params.isVibrating ? 1.0 : 0.0;
        
        mu.uMeshType.value = meshType;
        mu.uShapeType.value = 
          params.shapeType === 'classic' ? 0.0 : 
          params.shapeType === 'realistic' ? 1.0 : 
          params.shapeType === 'fantasy' ? 2.0 : 
          params.shapeType === 'targeted' ? 3.0 : 
          params.shapeType === 'candle' ? 4.0 : 
          params.shapeType === 'soap' ? 5.0 : 
          params.shapeType === 'kitchen' ? 6.0 : 7.0;
        mu.uRealisticVeins.value = params.realisticVeins;
        mu.uRealisticGlans.value = params.realisticGlans ? 1.0 : 0.0;
        mu.uFantasyType.value = params.fantasyType === 'dragon' ? 0.0 : params.fantasyType === 'alien' ? 1.0 : 2.0;
        mu.uBaseType.value = params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0;
        mu.uTaper.value = params.taper;
        mu.uFirmness.value = params.firmness === 'soft' ? 0.0 : params.firmness === 'medium' ? 1.0 : params.firmness === 'firm' ? 2.0 : 3.0;
        mu.uInclusions.value = params.inclusions === 'none' ? 0.0 : params.inclusions === 'glitter' ? 1.0 : params.inclusions === 'metallic' ? 2.0 : 3.0;
        mu.uThermochromic.value = params.thermochromic ? 1.0 : 0.0;
        mu.uBlacklightMode.value = params.blacklightMode ? 1.0 : 0.0;
        mu.uBallOffset.value = ballOffset;
        mu.uBallYOffset.value = ballYOffset;
        mu.uAlpha.value = (meshType === 0 && params.firmness === 'dual-density') ? 0.55 : 1.0;
        mu.uTextTexture.value = textTexture;
        mu.uTextStyle.value = (!params.engraveStyle || params.engraveStyle === 'none') ? 0.0 : params.engraveStyle === 'embossed' ? 1.0 : 2.0;
        mu.uTextDepth.value = params.engraveDepth !== undefined ? params.engraveDepth : 0.5;
      }
    };

    update(outerUniforms, outerMaterialRef.current, 0);
    update(innerUniforms, innerMaterialRef.current, 1);
    update(tubeUniforms, tubeMaterialRef.current, 3);
    update(leftBallUniforms, leftBallMaterialRef.current, 2, -0.55 * params.shaftGirth, -0.25 * params.length);
    update(rightBallUniforms, rightBallMaterialRef.current, 2, 0.55 * params.shaftGirth, -0.25 * params.length);
    update(centerBallUniforms, centerBallMaterialRef.current, 2, 0.0, -0.28 * params.length);
  }, [params, textureId, textTexture, outerUniforms, innerUniforms, tubeUniforms, leftBallUniforms, rightBallUniforms, centerBallUniforms]);

  const elapsedTimeRef = useRef<number>(0);

  useFrame((_state, delta) => {
    elapsedTimeRef.current += delta;
    const time = elapsedTimeRef.current;
    
    // Only update uTime on every frame
    outerUniforms.uTime.value = time;
    innerUniforms.uTime.value = time;
    tubeUniforms.uTime.value = time;
    leftBallUniforms.uTime.value = time;
    rightBallUniforms.uTime.value = time;
    centerBallUniforms.uTime.value = time;

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

    uniform sampler2D uTextTexture;
    uniform float uTextStyle;
    uniform float uTextDepth;

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
      
      if (uShapeType < 3.5) {
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
      }

      // Taper (applied continuously across the main shaft body)
      float taperScale = mix(1.0 + uTaper * 0.20, 1.0 - uTaper * 0.45, normY);
      shapeScale *= taperScale;

      // Apply custom text displacement
      if (uTextStyle > 0.5) {
        float textVal = texture2D(uTextTexture, uv).r;
        float disp = 0.0;
        if (uTextStyle == 1.0) {
          disp = textVal * uTextDepth * 0.08;
        } else if (uTextStyle == 2.0) {
          disp = -textVal * uTextDepth * 0.08;
        }
        shapeScale += disp;
      }

      // Use Scenario shapes (Candle, Soap, Kitchenware, Collectible)
      if (uShapeType == 4.0) {
        // Candle: add longitudinal ridges, then apply spiral twist
        float angle = atan(pos.z, pos.x);
        shapeScale += 0.12 * sin(angle * 6.0);
      } else if (uShapeType == 5.0) {
        // Soap: square/rectangular block with chamfered look
        float angle = atan(pos.z, pos.x);
        float cos4 = cos(angle * 4.0);
        shapeScale *= (1.0 - 0.16 * cos4);
        if (normY < 0.15) {
          shapeScale *= smoothstep(0.0, 1.0, normY / 0.15);
        }
        if (normY > 0.85) {
          shapeScale *= smoothstep(0.0, 1.0, (1.0 - normY) / 0.15);
        }
      } else if (uShapeType == 6.0) {
        // Kitchenware (Muffin baking cup)
        float angle = atan(pos.z, pos.x);
        shapeScale = uShaftGirth * (0.7 + normY * 0.9);
        shapeScale += 0.07 * sin(angle * 18.0) * (0.2 + normY * 0.8);
        if (normY < 0.1) {
          shapeScale *= smoothstep(0.0, 1.0, normY / 0.1);
        }
      } else if (uShapeType == 7.0) {
        // Collectible
        float profile = 1.0;
        if (normY < 0.45) {
          profile = 1.25 - 0.5 * (normY / 0.45);
        } else if (normY < 0.6) {
          profile = 0.75;
        } else {
          float t = (normY - 0.6) / 0.4;
          profile = 0.75 + 0.55 * sin(t * 3.14159);
        }
        shapeScale = uShaftGirth * profile;
        
        float angle = atan(pos.z, pos.x);
        float octAngle = floor(angle * 8.0 / 6.28318 + 0.5) * 6.28318 / 8.0;
        pos.x = cos(octAngle);
        pos.z = sin(octAngle);
      }
      // Standard shape styles
      else if (uShapeType == 2.0) {
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

      // Twist twist for Candle
      if (uShapeType == 4.0) {
        float theta = normY * 3.14159 * 2.0; 
        float c = cos(theta);
        float s = sin(theta);
        float rx = pos.x * c - pos.z * s;
        float rz = pos.x * s + pos.z * c;
        pos.x = rx;
        pos.z = rz;
      }

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

    uniform sampler2D uTextTexture;
    uniform float uTextStyle;
    uniform float uTextDepth;

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

      if (uTextStyle > 0.5) {
        float textVal = texture2D(uTextTexture, vUv).r;
        float epsU = 0.003;
        float epsV = 0.005;
        float textValU = texture2D(uTextTexture, vUv + vec2(epsU, 0.0)).r;
        float textValV = texture2D(uTextTexture, vUv + vec2(0.0, epsV)).r;
        
        float gradU = (textValU - textVal) / epsU;
        float gradV = (textValV - textVal) / epsV;
        
        float bumpSign = (uTextStyle == 1.0) ? 1.0 : -1.0;
        float textStrength = uTextDepth * 0.16;
        
        normalVec = normalize(normalVec - tangent * gradU * bumpSign * textStrength - bitangent * gradV * bumpSign * textStrength);
      }

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
      
      // Reflect reflections
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
            position={[-0.55 * params.shaftGirth, -0.25 * params.length, -0.5 * params.shaftGirth - 0.1]} 
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
            position={[0.55 * params.shaftGirth, -0.25 * params.length, -0.5 * params.shaftGirth - 0.1]} 
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

          {/* Scrotal Sack Base Connector */}
          <mesh 
            position={[0, -0.28 * params.length, -0.6 * params.shaftGirth - 0.1]} 
            scale={[1.25, 1.15, 0.9]}
            castShadow 
            receiveShadow
          >
            <sphereGeometry args={[0.5 * params.shaftGirth, 32, 32]} />
            <shaderMaterial
              ref={centerBallMaterialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={centerBallUniforms}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* Candle Wick (only rendered if shapeType is 'candle') */}
      {params.shapeType === 'candle' && (
        <mesh position={[params.curvature * 1.9, params.length / 2 + 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#2d2d30" roughness={0.8} />
        </mesh>
      )}
    </group>
  );
};
