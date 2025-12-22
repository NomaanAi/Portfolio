"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as THREE from "three";

export default function NebulaContent() {
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Stars />
    </group>
  );
}

function Stars(props: any) {
  const ref = useRef<any>();
  
  // Manual star generation to prevent NaN issues from external libs
  const sphere = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const radius = 1.5;

    for (let i = 0; i < count; i++) {
        // Generate random point in sphere
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * radius; // Cubic root for uniform distribution

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Fallback safety
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
             positions[i * 3] = 0;
             positions[i * 3 + 1] = 0;
             positions[i * 3 + 2] = 0;
        }
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.x -= delta / 15;
        ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#8b5cf6" // Violet accent
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
