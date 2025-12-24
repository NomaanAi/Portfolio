"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BackgroundMeshProps {
    themeValue: string;
    visible?: boolean;
    opacityScale?: number;
}

export default function BackgroundMesh({ themeValue, visible = true, opacityScale = 1 }: BackgroundMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isDark = themeValue === "dark";
  
  // Dark: White wireframe
  // Light: Black wireframe
  const color = isDark ? "#ffffff" : "#000000";

  useFrame((state) => {
    if (meshRef.current) {
        const time = state.clock.getElapsedTime();
        // Ultra slow rotation
        meshRef.current.rotation.z += 0.0005;
        meshRef.current.rotation.y += 0.0002;
        
        // "Living" Vertex/Structure Movement (Breathing distortion)
        const breathe = 1 + Math.sin(time * 0.5) * 0.02; // Slow pulse
        meshRef.current.scale.set(30 * breathe, 30 * breathe, 30 + Math.sin(time * 0.2) * 2);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={30} visible={visible}>
      <icosahedronGeometry args={[1, 1]} /> {/* Detail 1 = Low Poly aesthetic */}
      <meshBasicMaterial 
        color={color} 
        wireframe 
        transparent 
        opacity={0.03 * opacityScale} // Very subtle depth
      />
    </mesh>
  );
}
