'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

// Fallback geometric shape if model fails to load
const FallbackCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6a3fb3" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

const Model = ({ url }: { url?: string }) => {
  // We use a try-catch pattern indirectly by checking if URL exists
  // If the user hasn't provided a valid .glb/.gltf file, we fallback
  if (!url) return <FallbackCube />;
  
  try {
    const { scene } = useGLTF(url);
    const modelRef = useRef<THREE.Group>(null);
    
    useFrame((state, delta) => {
      if (modelRef.current) {
        modelRef.current.rotation.y += delta * 0.2;
      }
    });

    return (
      <Center>
        <primitive object={scene} ref={modelRef} scale={1.5} />
      </Center>
    );
  } catch (error) {
    console.error("Failed to load 3D model:", error);
    return <FallbackCube />;
  }
};

interface Product3DViewerProps {
  modelUrl?: string; // e.g. '/models/sneaker.glb'
}

export default function Product3DViewer({ modelUrl }: Product3DViewerProps) {
  return (
    <div className="w-full h-[400px] md:h-[600px] bg-gradient-to-b from-[#0a0f1c] to-[#04060c] rounded-2xl overflow-hidden relative border border-white/5">
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 text-xs font-bebas tracking-widest rounded-full border border-purple-500/30">
          3D PREVIEW
        </span>
      </div>
      <div className="absolute bottom-4 left-0 w-full text-center z-10 pointer-events-none">
        <span className="text-white/40 text-xs font-sans">Drag to rotate • Scroll to zoom</span>
      </div>
      
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={2} 
          maxDistance={10} 
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

// Preload common models if any
// useGLTF.preload('/models/sneaker.glb');
