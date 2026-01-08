"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useChatStore } from "@/store/useChatStore";
import * as THREE from "three";

// Configuration
const PARTICLE_COUNT = 150;
const RADIUS = 2;
const CONNECTION_DISTANCE = 0.5;

function NeuralNetwork({ theme, isOpen, setOpen }: { theme: string, isOpen: boolean, setOpen: (v: boolean) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  // Theme colors
  const mainColor = theme === "dark" ? new THREE.Color("#22d3ee") : new THREE.Color("#0ea5e9");
  const glowColor = theme === "dark" ? new THREE.Color("#ffffff") : new THREE.Color("#0284c7");

  // Generate particles on a sphere surface (Fibonacci Sphere)
  const particles = useMemo(() => {
    const temp = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y); // Radius at y
        const theta = phi * i; // Golden angle increment

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        temp.push(new THREE.Vector3(x * RADIUS, y * RADIUS, z * RADIUS));
    }
    return temp;
  }, []);

  // Generate connections (static for performance)
  const linesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = particles[i].distanceTo(particles[j]);
        if (dist < CONNECTION_DISTANCE * RADIUS) {
            positions.push(particles[i].x, particles[i].y, particles[i].z);
            positions.push(particles[j].x, particles[j].y, particles[j].z);
        }
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [particles]);

  // Animation
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Rotation (slow float)
    const speed = isOpen ? 0.05 : hovered ? 0.1 : 0.2;
    groupRef.current.rotation.y += delta * 0.1 * speed;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;

    // Breathing scale
    const breath = 1 + Math.sin(state.clock.getElapsedTime()) * 0.02;
    // Lerp scale
    const targetScale = isOpen ? 0.8 : 1.2;
    const currentScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale * breath, 0.1);
    groupRef.current.scale.setScalar(currentScale);
    
    // Move aside when chat is open
    const targetX = isOpen ? 1.5 : 0;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
  });

  return (
    <group ref={groupRef}
       onClick={() => setOpen(true)}
       onPointerOver={() => {
           setHover(true);
           document.body.style.cursor = 'pointer';
       }}
       onPointerOut={() => {
           setHover(false);
           document.body.style.cursor = 'auto';
       }}
    >
      {/* Nodes (Points) */}
      <points>
         <bufferGeometry>
            <bufferAttribute
                attach="attributes-position"
                count={particles.length}
                array={new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
            />
         </bufferGeometry>
         <pointsMaterial
            size={0.06}
            color={mainColor}
            transparent
            opacity={0.9}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
         />
      </points>

      {/* Connections (Lines) */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial
            color={mainColor}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
        />
      </lineSegments>

      {/* Core Glow (Subtle) */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.8, 32, 32]} />
        <meshBasicMaterial
            color={mainColor}
            transparent
            opacity={0.02}
            side={THREE.DoubleSide}
        />
      </mesh>

       {/* Label */}
       {!isOpen && (
        <Html position={[0, -2.8, 0]} center zIndexRange={[100, 0]}>
          <div 
             className="px-4 py-2 bg-background/80 backdrop-blur-md border border-cyan-500/30 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-500 shadow-lg shadow-cyan-500/10 pointer-events-none whitespace-nowrap transition-all duration-300"
             style={{ opacity: hovered ? 1 : 0.7, transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          >
             Initialize Interface
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Sphere3D() {
  const { theme } = useTheme();
  const { isOpen, setOpen } = useChatStore();

  return (
    <div className="w-full h-full min-h-[500px] relative fade-in-scale">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        {/* Simple Fog to blend depth */}
        <fog attach="fog" args={[theme === 'dark' ? '#000000' : '#ffffff', 5, 15]} />
        
        <NeuralNetwork theme={theme} isOpen={isOpen} setOpen={setOpen} />
      </Canvas>
    </div>
  );
}
