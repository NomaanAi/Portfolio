"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
// @ts-ignore
import * as THREE from "three";

export function Scene() {
  return (
    <>
      <Stars />
      <HeroObject />
    </>
  );
}

function HeroObject() {
    // Abstract geometric shape for Hero
    return (
       <Float speed={2} rotationIntensity={1} floatIntensity={1}>
         <mesh rotation={[0, Math.PI / 4, 0]} position={[2, 0, 0]}>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial 
                color="#050505" 
                emissive="#06b6d4"
                emissiveIntensity={0.5}
                wireframe 
                transparent
                opacity={0.3}
            />
         </mesh>
       </Float>
    );
}

function Stars(props: any) {
  const ref = useRef<any>();
  
  // Manual star generation (Safe from NaN)
  const sphere = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const radius = 3; 

    for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * radius;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = isNaN(x) ? 0 : x;
        positions[i * 3 + 1] = isNaN(y) ? 0 : y;
        positions[i * 3 + 2] = isNaN(z) ? 0 : z;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.x -= delta / 20;
        ref.current.rotation.y -= delta / 25;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#94a3b8"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
