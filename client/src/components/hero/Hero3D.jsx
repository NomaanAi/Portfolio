"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

function EngineeredSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} scale={2}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#0a0a0a"
        emissive="#1e293b" // Slate-800 for a subtle blue-grey technical glow
        emissiveIntensity={0.2}
        roughness={0.2}
        metalness={0.9}
        distort={0.4}
        speed={2}
      />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }}>
        <fog attach="fog" args={["#080808", 5, 20]} />
        <ambientLight intensity={1.0} />
        {/* Rim Light - Sharper for structure */}
        <pointLight position={[10, 10, 5]} intensity={3} color="#e2e8f0" />
        {/* Fill Light */}
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#1e293b" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <EngineeredSphere />
        </Float>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} // Slow rotation
        />
      </Canvas>
      
      {/* Structural grainy overlay for realism */}
      <div className="absolute inset-0 bg-transparent opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
