/* eslint-disable react-hooks/immutability */
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

import type { BuilderParams } from '../types';
import { ToyModel } from './canvas/ToyModel';
import { ScaleRuler } from './canvas/ScaleRuler';
import { 
  EnvironmentSetup, 
  ShowerEnvironment, 
  LuxuryCaseEnvironment, 
  CustomGridHelper 
} from './canvas/EnvironmentSetup';

interface ThreeCanvasProps {
  params: BuilderParams;
  demoMode: boolean;
}

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

const ScreenshotTaker: React.FC<{ params: BuilderParams; demoMode: boolean }> = ({ params, demoMode }) => {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const handleExport = () => {
      // Force render to capture pixel buffer
      gl.render(scene, camera);
      const imgData = gl.domElement.toDataURL('image/png');

      const img = new Image();
      img.onload = () => {
        // Create high-res 2400x1800 composting canvas
        const canvas = document.createElement('canvas');
        canvas.width = 2400;
        canvas.height = 1800;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (demoMode) {
          const bgGrad = ctx.createLinearGradient(0, 0, 0, 1800);
          bgGrad.addColorStop(0, '#fefefe');
          bgGrad.addColorStop(0.75, '#fcfbf7');
          bgGrad.addColorStop(1, '#f5f4ef');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, 2400, 1800);

          ctx.fillStyle = 'rgba(14, 165, 233, 0.03)';
          ctx.beginPath();
          ctx.arc(1200, 700, 600, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Luxury Dark Gradient Background
          const bgGrad = ctx.createLinearGradient(0, 0, 0, 1800);
          bgGrad.addColorStop(0, '#131317');
          bgGrad.addColorStop(0.75, '#0a0a0c');
          bgGrad.addColorStop(1, '#050507');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, 2400, 1800);

          // Subtle background light focus glow
          ctx.fillStyle = 'rgba(212, 175, 55, 0.02)';
          ctx.beginPath();
          ctx.arc(1200, 700, 600, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Draw WebGL Render Image (resize/center inside viewport)
        const webglWidth = img.width;
        const webglHeight = img.height;
        const targetMaxH = 1200;
        const targetMaxW = 2100;
        let drawW = targetMaxW;
        let drawH = (webglHeight / webglWidth) * drawW;

        if (drawH > targetMaxH) {
          drawH = targetMaxH;
          drawW = (webglWidth / webglHeight) * drawH;
        }

        const drawX = (2400 - drawW) / 2;
        const drawY = 80 + (targetMaxH - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // 4. Draw luxury Gold specifications card at the bottom
        if (demoMode) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
          ctx.fillRect(80, 1330, 2240, 390);
          
          ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
          ctx.lineWidth = 3;
          ctx.strokeRect(80, 1330, 2240, 390);

          ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(86, 1336, 2228, 378);

          ctx.fillStyle = '#0ea5e9';
          ctx.font = 'bold 36px Georgia, serif';
          ctx.fillText('BAD MOLD STUDIO  |  CAD SPECIFICATION SHEET', 130, 1400);

          ctx.fillStyle = 'rgba(71, 85, 105, 0.6)';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText('TRUE-TO-LIFE 1:1 PHYSICAL SCALE PREVIEW', 2210, 1400);
          ctx.textAlign = 'left';
        } else {
          ctx.fillStyle = 'rgba(18, 18, 20, 0.95)';
          ctx.fillRect(80, 1330, 2240, 390);
          
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
          ctx.lineWidth = 3;
          ctx.strokeRect(80, 1330, 2240, 390);

          ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(86, 1336, 2228, 378);

          ctx.fillStyle = '#d4af37';
          ctx.font = 'bold 36px Georgia, serif';
          ctx.fillText('BAD PLATFORM  |  CAD SPECIFICATION SHEET', 130, 1400);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText('TRUE-TO-LIFE 1:1 PHYSICAL SCALE PREVIEW', 2210, 1400);
          ctx.textAlign = 'left';
        }

        // Split Divider line
        ctx.strokeStyle = demoMode ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(130, 1425);
        ctx.lineTo(2270, 1425);
        ctx.stroke();

        // Columns layout
        const colY = 1465;
        const rowH = 34;

        const drawColValue = (title: string, value: string, x: number, y: number) => {
          ctx.fillStyle = demoMode ? 'rgba(71, 85, 105, 0.7)' : 'rgba(255, 255, 255, 0.4)';
          ctx.font = '17px system-ui, sans-serif';
          ctx.fillText(title + ':', x, y);

          ctx.fillStyle = demoMode ? '#0f172a' : '#f3f4f6';
          ctx.font = 'bold 19px system-ui, sans-serif';
          ctx.fillText(value, x + 185, y);
        };

        if (demoMode) {
          // Col 1: Craft Scenario
          ctx.fillStyle = '#ec4899';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillText('CRAFT SCENARIO', 130, colY);
          
          let craftShape = params.shapeType.toUpperCase();
          if (craftShape === 'CANDLE') craftShape = 'SPIRAL PILLAR CANDLE';
          else if (craftShape === 'SOAP') craftShape = 'HONEYCOMB SOAP MOLD';
          else if (craftShape === 'KITCHEN') craftShape = 'SILICONE BAKING CUP';
          else if (craftShape === 'COLLECTIBLE') craftShape = 'CHIBI FIGURINE MOLD';

          drawColValue('USE SCENARIO', craftShape, 130, colY + 50);
          drawColValue('SURFACE TEXTURE', params.texture.toUpperCase(), 130, colY + 50 + rowH);
          drawColValue('SWEEP BEND', `${params.curvature.toFixed(1)}x`, 130, colY + 50 + rowH * 2);

          // Col 2: Geometric Metrics
          ctx.fillStyle = '#0ea5e9';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillText('GEOMETRIC METRICS', 680, colY);
          drawColValue('HEIGHT', `${params.length.toFixed(1)}"`, 680, colY + 50);
          drawColValue('BODY DIAMETER', `${(params.shaftGirth * 1.4).toFixed(2)}"`, 680, colY + 50 + rowH);
          drawColValue('BASE DIAMETER', `${(params.baseGirth * 2.0).toFixed(2)}"`, 680, colY + 50 + rowH * 2);

          // Col 3: Production Material
          ctx.fillStyle = '#ec4899';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillText('PRODUCTION MATERIAL', 1230, colY);
          let colorModeName = 'SOLID';
          if (params.colorMode === 1) colorModeName = 'MARBLE';
          else if (params.colorMode === 2) colorModeName = 'GRADIENT';
          else if (params.colorMode === 3) colorModeName = 'SPLIT POUR';

          let matType = 'Food-Safe Silicone';
          if (params.shapeType === 'candle' || params.shapeType === 'soap') {
            matType = 'High-Temp Wax/Soap Safe';
          }
          drawColValue('SILICONE TYPE', matType, 1230, colY + 50);
          
          let hardness = 'Shore 20A';
          if (params.firmness === 'soft') hardness = 'Shore 10A (Super Soft)';
          else if (params.firmness === 'medium') hardness = 'Shore 20A (Standard)';
          else if (params.firmness === 'firm') hardness = 'Shore 40A (Rigid)';
          drawColValue('HARDNESS', hardness, 1230, colY + 50 + rowH);
          drawColValue('PIGMENTATION', `${colorModeName} (${params.color1} / ${params.color2})`, 1230, colY + 50 + rowH * 2);

          // Col 4: Quality & Verification
          ctx.fillStyle = '#0ea5e9';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillText('SPEC & QUALITY', 1780, colY);
          
          const seedVal = `${params.shapeType}-${params.length}-${params.shaftGirth}-${params.curvature}`;
          let hash = 0;
          for (let i = 0; i < seedVal.length; i++) {
            hash = (hash << 5) - hash + seedVal.charCodeAt(i);
            hash |= 0;
          }
          const hashStr = `MC-${Math.abs(hash).toString(16).toUpperCase().substring(0, 8)}`;
          
          drawColValue('ADDITIVES', params.inclusions.toUpperCase(), 1780, colY + 50);
          drawColValue('COMPLIANCE', 'FDA FOOD-GRADE', 1780, colY + 50 + rowH);
          drawColValue('MOLD HASH', hashStr, 1780, colY + 50 + rowH * 2);
        } else {
          // Col 1: Anatomy Profile
          ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillText('ANATOMICAL PROFILE', 130, colY);
          let anatShape = params.shapeType.toUpperCase();
          if (params.shapeType === 'fantasy') {
            anatShape += ` (${params.fantasyType.toUpperCase()})`;
          }
          drawColValue('SHAPE TYPE', anatShape, 130, colY + 50);
          drawColValue('TEXTURE', params.texture.toUpperCase(), 130, colY + 50 + rowH);
          drawColValue('CURVATURE', `${params.curvature.toFixed(1)}x`, 130, colY + 50 + rowH * 2);

          // Col 2: Physical Metrics
          ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillText('PHYSICAL METRICS', 680, colY);
          const calcLength = params.suctionCup ? (params.length - 0.8).toFixed(1) : params.length.toFixed(1);
          drawColValue('LENGTH', `${calcLength}" (${params.length.toFixed(1)}" Total)`, 680, colY + 50);
          drawColValue('SHAFT girth', `${(params.shaftGirth * 1.4).toFixed(2)}" / ${(params.shaftGirth * Math.PI * 1.4).toFixed(1)}" circ.`, 680, colY + 50 + rowH);
          drawColValue('BASE DIAM', `${(params.baseGirth * 2.0).toFixed(2)}"`, 680, colY + 50 + rowH * 2);

          // Col 3: Material System
          ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillText('MATERIAL SYSTEM', 1230, colY);
          let colorModeName = 'SOLID';
          if (params.colorMode === 1) colorModeName = 'MARBLE';
          else if (params.colorMode === 2) colorModeName = 'GRADIENT';
          else if (params.colorMode === 3) colorModeName = 'SPLIT POUR';
          drawColValue('SILICONE', 'Platinum Cured', 1230, colY + 50);
          drawColValue('FIRMNESS', params.firmness.toUpperCase(), 1230, colY + 50 + rowH);
          drawColValue('PIGMENTS', `${colorModeName} (${params.color1} / ${params.color2})`, 1230, colY + 50 + rowH * 2);

          // Col 4: Quality & Verification
          ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
          ctx.font = 'bold 18px system-ui, sans-serif';
          ctx.fillText('SYSTEM VERIFICATION', 1780, colY);
          const seedVal = `${params.shapeType}-${params.length}-${params.shaftGirth}-${params.curvature}`;
          let hash = 0;
          for (let i = 0; i < seedVal.length; i++) {
            hash = (hash << 5) - hash + seedVal.charCodeAt(i);
            hash |= 0;
          }
          const hashStr = `MD-${Math.abs(hash).toString(16).toUpperCase().substring(0, 8)}`;
          drawColValue('INCLUSIONS', params.inclusions.toUpperCase(), 1780, colY + 50);
          drawColValue('QC STATUS', 'FDA COMPLIANT', 1780, colY + 50 + rowH);
          drawColValue('CAD HASH', hashStr, 1780, colY + 50 + rowH * 2);
        }

        // Open high-res download
        const seedVal = `${params.shapeType}-${params.length}-${params.shaftGirth}-${params.curvature}`;
        let hash = 0;
        for (let i = 0; i < seedVal.length; i++) {
          hash = (hash << 5) - hash + seedVal.charCodeAt(i);
          hash |= 0;
        }
        const hashStr = (demoMode ? 'MC-' : 'MD-') + Math.abs(hash).toString(16).toUpperCase().substring(0, 8);

        const link = document.createElement('a');
        link.download = `bad_spec_sheet_${hashStr}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      img.src = imgData;
    };

    window.addEventListener('export-hires', handleExport);
    return () => window.removeEventListener('export-hires', handleExport);
  }, [gl, scene, camera, params, demoMode]);

  return null;
};

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ params, demoMode }) => {

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
        camera={{ position: [3.5, 1.8, 7.2], fov: 40 }}
        shadows={{ type: THREE.PCFShadowMap }}
        gl={{ preserveDrawingBuffer: true }}
        style={{ position: 'relative', zIndex: 1, background: 'transparent' }}
      >
        <SceneSetup />
        <ScreenshotTaker params={params} demoMode={demoMode} />
        
        {/* Dynamic environmental lights */}
        <EnvironmentSetup params={params} />
        
        <Center>
          <ToyModel params={params} demoMode={demoMode} />
        </Center>
        
        {/* Transparent glass device scale reference comparison */}
        {params.showScaleRef && !params.arMode && <ScaleRuler />}
        
        {/* Scenery Situations Environments */}
        {!params.arMode && params.sceneEnvironment === 'shower' && (
          <ShowerEnvironment length={params.length} />
        )}
        {!params.arMode && params.sceneEnvironment === 'case' && (
          <LuxuryCaseEnvironment length={params.length} shaftGirth={params.shaftGirth} />
        )}

        {/* Studio floor projection grid */}
        {params.sceneEnvironment === 'studio' && !params.arMode && (
          <CustomGridHelper length={params.length} demoMode={demoMode} />
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
          {demoMode ? 'Craft Spec Sheet' : 'Real-World Scale Specs'}
        </div>
        <hr style={{ borderColor: 'var(--border-color)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? 'Total Height:' : 'Total Length:'}</span>
          <span style={{ fontWeight: 600 }}>{params.length.toFixed(1)} in</span>
        </div>
        {!demoMode && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Insertable:</span>
            <span style={{ fontWeight: 600 }}>{insertableLength} in</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? 'Body Diameter:' : 'Shaft Ø (Girth):'}</span>
          <span style={{ fontWeight: 600 }}>{shaftDiameter} in</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? 'Base Diameter:' : 'Base Flange Ø:'}</span>
          <span style={{ fontWeight: 600 }}>{baseDiameter} in</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{demoMode ? 'Sweep Bend:' : 'Curvature Bend:'}</span>
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
