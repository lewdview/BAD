import React from 'react';

// Sleek glass smartphone model acting as a 1:1 real-world scale reference (iPhone dimensions: 5.78" x 2.82" x 0.3")
export const ScaleRuler: React.FC = () => {
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
