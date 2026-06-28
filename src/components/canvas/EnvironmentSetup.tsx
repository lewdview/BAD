/* eslint-disable react-hooks/purity */
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BuilderParams } from '../../types';

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

export const ShowerEnvironment: React.FC<{ length: number }> = ({ length }) => {
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

export const LuxuryCaseEnvironment: React.FC<{ length: number; shaftGirth: number }> = ({ length, shaftGirth }) => {
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

export const CustomGridHelper: React.FC<{ length: number; demoMode: boolean }> = ({ length, demoMode }) => {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useEffect(() => {
    if (gridRef.current) {
      const material = gridRef.current.material as THREE.LineBasicMaterial;
      material.transparent = true;
      material.opacity = demoMode ? 0.12 : 0.08;
    }
  }, [demoMode]);

  const gridColor = demoMode ? '#000000' : '#ffffff';

  return (
    <gridHelper 
      ref={gridRef}
      key={demoMode ? 'black-grid' : 'white-grid'}
      args={[18, 18, gridColor, gridColor]} 
      position={[0, -length / 2 - 0.3, 0]} 
    />
  );
};

interface EnvironmentSetupProps {
  params: BuilderParams;
}

export const EnvironmentSetup: React.FC<EnvironmentSetupProps> = ({ params }) => {
  if (params.sceneEnvironment === 'shower') {
    return (
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
    );
  }

  if (params.sceneEnvironment === 'case') {
    return (
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
    );
  }

  return (
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
  );
};
