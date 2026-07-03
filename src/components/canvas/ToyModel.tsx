/* eslint-disable react-hooks/immutability */
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateTextHeightmap } from '../../utils/textHeightmap';
import type { BuilderParams } from '../../types';
import { vertexShader, fragmentShader } from './ToyShaders';

const getBallCoords = (params: BuilderParams) => {
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
    zShift
  };
};

interface ToyModelProps {
  params: BuilderParams;
  demoMode?: boolean;
}

export const ToyModel: React.FC<ToyModelProps> = ({ params, demoMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const innerMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const tubeMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const leftBallMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const rightBallMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const ballCoords = useMemo(() => {
    return getBallCoords(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.shaftGirth, params.length, params.ballSize, params.ballAsymmetry, params.curvature, params.curvatureAngle, params.baseGirth, params.baseType]);

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
      uCurvatureAngle: { value: params.curvatureAngle || 0 },
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
      uHeadType: { value: 
        params.headType === 'classic' ? 0.0 : 
        params.headType === 'realistic' ? 1.0 : 
        params.headType === 'bulbous' ? 2.0 : 
        params.headType === 'tapered' ? 3.0 : 
        params.headType === 'alien' ? 4.0 : 5.0 
      },
      uHeadScale: { value: params.headScale !== undefined ? params.headScale : 1.0 },
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
      uTextDepth: { value: params.engraveDepth !== undefined ? params.engraveDepth : 0.5 },
      uHasOrifice: { value: params.hasOrifice ? 1.0 : 0.0 },
      uOrificeType: { value: params.orificeType === 'vaginal' ? 0.0 : params.orificeType === 'anal' ? 1.0 : 2.0 },
      uOrificeDepth: { value: params.orificeDepth || 0.4 }
    };
  };

  // Create stable uniforms once on mount to prevent React Three Fiber material rebuilds.
  // We mutate uniform values imperatively inside the useFrame loop at 60fps for high performance.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const outerUniforms = useMemo(() => createUniforms(0), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const innerUniforms = useMemo(() => createUniforms(1), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tubeUniforms = useMemo(() => createUniforms(3), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const leftBallUniforms = useMemo(() => createUniforms(2, -0.32 * params.shaftGirth, -0.26 * params.length), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rightBallUniforms = useMemo(() => createUniforms(2, 0.32 * params.shaftGirth, -0.26 * params.length), []);

  useEffect(() => {
    return () => {
      textTexture.dispose();
    };
  }, [textTexture]);

  const elapsedTimeRef = useRef<number>(0);

  useFrame((_state, delta) => {
    elapsedTimeRef.current += delta;
    const time = elapsedTimeRef.current;
    
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

    const updateMaterial = (material: THREE.ShaderMaterial | null, meshType: number, ballOffset = 0, ballYOffset = 0) => {
      if (!material) return;
      const mu = material.uniforms;
      mu.uTime.value = time;
      mu.uLength.value = params.length;
      mu.uShaftGirth.value = params.shaftGirth;
      mu.uBaseGirth.value = params.baseGirth;
      mu.uCurvature.value = params.curvature;
      mu.uCurvatureAngle.value = params.curvatureAngle || 0;
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
      mu.uHeadType.value = 
        params.headType === 'classic' ? 0.0 : 
        params.headType === 'realistic' ? 1.0 : 
        params.headType === 'bulbous' ? 2.0 : 
        params.headType === 'tapered' ? 3.0 : 
        params.headType === 'alien' ? 4.0 : 5.0;
      mu.uHeadScale.value = params.headScale !== undefined ? params.headScale : 1.0;
      mu.uFantasyType.value = params.fantasyType === 'dragon' ? 0.0 : params.fantasyType === 'alien' ? 1.0 : 2.0;
      mu.uBaseType.value = params.baseType === 'flared' ? 0.0 : params.baseType === 'flat' ? 1.0 : 2.0;
      mu.uTaper.value = params.taper;
      mu.uFirmness.value = params.firmness === 'soft' ? 0.0 : params.firmness === 'medium' ? 1.0 : params.firmness === 'firm' ? 2.0 : 3.0;
      mu.uInclusions.value = params.inclusions === 'none' ? 0.0 : params.inclusions === 'glitter' ? 1.0 : params.inclusions === 'metallic' ? 2.0 : 3.0;
      mu.uThermochromic.value = params.thermochromic ? 1.0 : 0.0;
      mu.uBlacklightMode.value = params.blacklightMode ? 1.0 : 0.0;
      mu.uBallOffset.value = ballOffset;
      mu.uBallYOffset.value = ballYOffset;
      mu.uAlpha.value = (meshType === 0 || meshType === 2) 
        ? (params.firmness === 'dual-density' ? 0.55 : 0.72) 
        : 1.0;
      mu.uTextTexture.value = textTexture;
      mu.uTextStyle.value = (!params.engraveStyle || params.engraveStyle === 'none') ? 0.0 : params.engraveStyle === 'embossed' ? 1.0 : 2.0;
      mu.uTextDepth.value = params.engraveDepth !== undefined ? params.engraveDepth : 0.5;
      mu.uHasOrifice.value = params.hasOrifice ? 1.0 : 0.0;
      mu.uOrificeType.value = params.orificeType === 'vaginal' ? 0.0 : params.orificeType === 'anal' ? 1.0 : 2.0;
      mu.uOrificeDepth.value = params.orificeDepth || 0.4;
    };

    updateMaterial(outerMaterialRef.current, 0);
    updateMaterial(innerMaterialRef.current, 1);
    updateMaterial(tubeMaterialRef.current, 3);
    updateMaterial(leftBallMaterialRef.current, 2, ballCoords.left.x, ballCoords.left.y);
    updateMaterial(rightBallMaterialRef.current, 2, ballCoords.right.x, ballCoords.right.y);
  });



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
          transparent={true}
          depthWrite={true}
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

      {/* Testicles Base (only rendered if hasBalls is true and NOT in demoMode) */}
      {params.hasBalls && !demoMode && (
        <>
          {/* Left Lobe */}
          <mesh 
            position={[ballCoords.left.x, ballCoords.left.y, ballCoords.left.z]} 
            scale={[1.0, 1.15, 0.9]}
            rotation={[0, ballCoords.theta, 0]}
            castShadow 
            receiveShadow
          >
            <sphereGeometry args={[ballCoords.left.r, 32, 32]} />
            <shaderMaterial
              ref={leftBallMaterialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={leftBallUniforms}
              transparent={true}
              depthWrite={true}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Right Lobe */}
          <mesh 
            position={[ballCoords.right.x, ballCoords.right.y, ballCoords.right.z]} 
            scale={[1.0, 1.15, 0.9]}
            rotation={[0, ballCoords.theta, 0]}
            castShadow 
            receiveShadow
          >
            <sphereGeometry args={[ballCoords.right.r, 32, 32]} />
            <shaderMaterial
              ref={rightBallMaterialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={rightBallUniforms}
              transparent={true}
              depthWrite={true}
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
