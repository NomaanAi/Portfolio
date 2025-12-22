"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, Icosahedron } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";

function FloatingShapes({ isDark }: { isDark: boolean }) {
  const { viewport } = useThree();
  
  // Colors based on theme (passed as prop or simpler logic here if strict sync is hard in canvas)
  // We can use generic colors that work on both or check prop.
  // Dark mode: #1e293b (slate-800), Light mode: #cbd5e1 (slate-300)
  const mainColor = isDark ? "#1e293b" : "#cbd5e1";
  const accentColor = isDark ? "#334155" : "#94a3b8";

  return (
    <>
      {/* Large Background Sphere - Subtle Anchor */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[viewport.width / 3, -viewport.height / 3, -5]} scale={4}>
           <sphereGeometry args={[1, 64, 64]} />
           <meshStandardMaterial 
             color={mainColor} 
             transparent 
             opacity={0.1} 
             wireframe 
           />
        </mesh>
      </Float>

      {/* Floating Triangles / Icosahedrons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Float 
          key={i} 
          speed={1 + i * 0.2} 
          rotationIntensity={0.5} 
          floatIntensity={1}
          position={[
             (Math.random() - 0.5) * viewport.width,
             (Math.random() - 0.5) * viewport.height,
             (Math.random() - 0.5) * 5
          ]}
        >
          <Icosahedron args={[0.5, 0]}>
            <meshStandardMaterial 
              color={accentColor} 
              transparent 
              opacity={0.15} 
              wireframe
            />
          </Icosahedron>
        </Float>
      ))}
    </>
  );
}

function Scene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.8} />
      <directionalLight position={[10, 10, 5]} intensity={isDark ? 0.5 : 1} />
      <FloatingShapes isDark={isDark} />
    </>
  );
}

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none w-full h-full bg-background transition-colors duration-300">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
