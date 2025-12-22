"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function SubtleForm() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#333"
        wireframe
        transparent
        opacity={0.05}
      />
    </mesh>
  );
}

export default function Contact3D() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={1} />
        <SubtleForm />
      </Canvas>
    </div>
  );
}
