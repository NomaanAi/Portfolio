"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

interface HeroNetwork3DProps {
    themeValue: string;
    opacityScale?: number;
}

export default function HeroNetwork3D({ themeValue, opacityScale = 1 }: HeroNetwork3DProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const noise3D = useMemo(() => createNoise3D(), []);

    // Configuration
    const COUNT = 100; // Increased density for "Intelligence" feel
    const CONNECTION_DIST = 3.5;
    
    // Theme Logic - STRICT adherence
    const isDark = themeValue === "dark";
    // Dark: Cyan-400 (#22d3ee) Nodes, Slate-400 (#94a3b8) Edges
    // Light: Slate-600 (#475569) Nodes, Slate-300 (#cbd5e1) Edges
    const nodeColor = isDark ? new THREE.Color("#22d3ee") : new THREE.Color("#475569"); 
    const edgeColor = isDark ? new THREE.Color("#94a3b8") : new THREE.Color("#cbd5e1");
    // Base edge opacity
    const baseEdgeOpacity = isDark ? 0.2 : 0.25;
    const edgeOpacity = baseEdgeOpacity * opacityScale;

    // Initial Data
    const { positions, velocities, phases } = useMemo(() => {
        const pos = new Float32Array(COUNT * 3);
        const vel = new Float32Array(COUNT * 3);
        const phs = new Float32Array(COUNT); // Independent phases for breathing
        for (let i = 0; i < COUNT; i++) {
            // CENTERED CLUSTER (Local Space)
            // We generate the cloud around (0,0,0) so we can position the group precisely.
            
            pos[i * 3] = (Math.random() - 0.5) * 8; // X: [-4, 4] width
            pos[i * 3 + 1] = (Math.random() - 0.5) * 12; // Y: [-6, 6] height
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8;  // Z: [-4, 4] depth
            
            // Random velocities
            vel[i * 3] = (Math.random() - 0.5) * 0.002;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

            phs[i] = Math.random() * Math.PI * 2;
        }
        return { positions: pos, velocities: vel, phases: phs };
    }, []);

    // Geometry for lines
    const lineGeo = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        // Max connections estimate: COUNT * COUNT is upper bound, but usually far fewer fit within dist.
        // For 100 nodes, 100*100 = 10000 max edges. 
        // Safely allocating for worst case 5000 segments (10000 vertices)
        const count = 5000 * 2; 
        const positions = new Float32Array(count * 3);
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame(() => {
        if (!meshRef.current || !linesRef.current) return;

        const currentPositions = positions; 
        const currentVelocities = velocities;
        
        // Update Nodes
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < COUNT; i++) {
            const i3 = i * 3;
            
            // Apply velocity
            currentPositions[i3] += currentVelocities[i3];
            currentPositions[i3+1] += currentVelocities[i3+1];
            currentPositions[i3+2] += currentVelocities[i3+2];

            // Bounce off boundaries (Box roughly 10x15x10)
            if (currentPositions[i3] < -5 || currentPositions[i3] > 5) currentVelocities[i3] *= -1;
            if (currentPositions[i3+1] < -7 || currentPositions[i3+1] > 7) currentVelocities[i3+1] *= -1;
            if (currentPositions[i3+2] < -5 || currentPositions[i3+2] > 5) currentVelocities[i3+2] *= -1;

            // Update Instance
            dummy.position.set(
                currentPositions[i3],
                currentPositions[i3+1],
                currentPositions[i3+2]
            );
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;

        // Update Lines
        const linePos = (linesRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        let lineIndex = 0;
        
        // Find connections
        for (let i = 0; i < COUNT; i++) {
            for (let j = i + 1; j < COUNT; j++) {
                const i3 = i * 3;
                const j3 = j * 3;
                
                const dx = currentPositions[i3] - currentPositions[j3];
                const dy = currentPositions[i3+1] - currentPositions[j3+1];
                const dz = currentPositions[i3+2] - currentPositions[j3+2];
                const distSq = dx*dx + dy*dy + dz*dz;

                if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
                    // Add segment
                    linePos[lineIndex++] = currentPositions[i3];
                    linePos[lineIndex++] = currentPositions[i3+1];
                    linePos[lineIndex++] = currentPositions[i3+2];

                    linePos[lineIndex++] = currentPositions[j3];
                    linePos[lineIndex++] = currentPositions[j3+1];
                    linePos[lineIndex++] = currentPositions[j3+2];
                }
            }
        }
        
        linesRef.current.geometry.setDrawRange(0, lineIndex / 3);
        linesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    const { width } = useThree((state) => state.viewport);
    
    // Responsive Layout Logic (Global Space)
    // Desktop (>12): Move center of mass to X=5 (Right 2/3rds)
    // Tablet (8-12): Move to X=3
    // Mobile (<8): Center X=0, Push down Y? No, center is fine if opacity is low.
    
    let xPosition = 0;
    let scale = 0.6; 

    if (width > 12) {
        xPosition = 5; // Clearly on the right
        scale = 1;
    } else if (width > 8) {
        xPosition = 3;
        scale = 0.8;
    }

    // ...

    return (
        <group position={[xPosition, 0, 0]} scale={scale}>
             {/* Nodes */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial 
                    color={nodeColor}
                    emissive={nodeColor}
                    emissiveIntensity={isDark ? 0.4 : 0} // Reduced glow for "Calm"
                    roughness={0.2}
                    metalness={0.5}
                />
            </instancedMesh>

            {/* Edges */}
            <lineSegments ref={linesRef} geometry={lineGeo}>
                <lineBasicMaterial 
                    color={edgeColor} 
                    transparent 
                    opacity={edgeOpacity} 
                    depthWrite={false} 
                />
            </lineSegments>
        </group>
    );
}
