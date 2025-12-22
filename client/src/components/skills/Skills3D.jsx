"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, RoundedBox } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

function SkillTile({ position, label, color }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <motion-group 
           scale={hovered ? 1.1 : 1} 
           onPointerOver={() => setHovered(true)} 
           onPointerOut={() => setHovered(false)}
        >
          <RoundedBox args={[1.5, 1.5, 0.5]} radius={0.2} smoothness={4}>
            <meshStandardMaterial 
              color={hovered ? "#00f0ff" : "#1e1e1e"} 
              emissive={hovered ? "#00f0ff" : "#000"}
              emissiveIntensity={hovered ? 0.5 : 0}
              roughness={0.3} 
              metalness={0.8} 
            />
          </RoundedBox>
          <Text 
            position={[0, 0, 0.3]} 
            fontSize={0.4} 
            color={hovered ? "black" : "white"} 
            font="/fonts/Inter-Bold.ttf" // Assuming generic font or default
            anchorX="center" 
            anchorY="middle"
          >
            {label}
          </Text>
        </motion-group>
      </Float>
    </group>
  );
}

// Wrapper for framer-motion-like scaling in R3F if using library, 
// here standard group with useSpring would be better but keeping it simple for now.
const motionGroup = (props) => <group {...props} />;

export default function Skills3D() {
  const skills = [
    { label: "JS", pos: [-2, 2, 0] }, { label: "TS", pos: [0, 2, 0] }, { label: "PY", pos: [2, 2, 0] },
    { label: "AI", pos: [-2, 0, 0] }, { label: "DL", pos: [0, 0, 0] }, { label: "ML", pos: [2, 0, 0] },
    { label: "R*", pos: [-2, -2, 0] }, { label: "GH", pos: [0, -2, 0] }, { label: "AWS", pos: [2, -2, 0] },
  ];

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-1/2 h-full z-0 opacity-100 mix-blend-normal">
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#5b21b6" />
        
        <group rotation={[0.5, -0.5, 0]}>
          {skills.map((s, i) => (
             <SkillTile key={i} position={s.pos} label={s.label} />
          ))}
        </group>
      </Canvas>
    </div>
  );
}
