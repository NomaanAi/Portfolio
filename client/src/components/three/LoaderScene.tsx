"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LoaderSceneProps {
    themeValue: string;
    opacity: React.MutableRefObject<number> | number;
}

export default function LoaderScene({ themeValue, opacity }: LoaderSceneProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const linesRef = useRef<THREE.LineSegments>(null);

    // Minimal config for loader
    const COUNT = 35;
    const CONNECTION_DIST = 4.5;
    
    // Theme Logic
    const isDark = themeValue === "dark";
    const nodeColor = isDark ? new THREE.Color("#22d3ee") : new THREE.Color("#475569");
    const edgeColor = isDark ? new THREE.Color("#64748b") : new THREE.Color("#cbd5e1");

    // Initial Data (Seed)
    const { positions } = useMemo(() => { // eslint-disable-line react-hooks/exhaustive-deps
        const pos = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            // Centered cluster
            pos[i * 3] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        return { positions: pos };
    }, []);

    const lineGeo = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const maxLines = COUNT * 10;
        const linePos = new Float32Array(maxLines * 6);
        geo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
        return geo;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current || !linesRef.current) return;
        
        const currentOpacity = typeof opacity === 'number' ? opacity : opacity.current;
        if (currentOpacity <= 0.01) {
             meshRef.current.visible = false;
             linesRef.current.visible = false;
             return;
        }
        
        meshRef.current.visible = true;
        linesRef.current.visible = true;
        
        // Update opacity manually for performance
        // @ts-ignore
        if (meshRef.current.material) meshRef.current.material.opacity = currentOpacity;
        // @ts-ignore
        if (linesRef.current.material) linesRef.current.material.opacity = 0.3 * currentOpacity;

        const time = state.clock.getElapsedTime();
        const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;
        let lineIdx = 0;

        // Calm breathing rotation for the whole group would be nice, 
        // but let's just pulse the nodes for "Initializing" feel
        
        for (let i = 0; i < COUNT; i++) {
            const i3 = i * 3;
            
            // Gentle Pulse
            const scale = 1 + Math.sin(time * 2 + i) * 0.2;
            
            dummy.position.set(positions[i3], positions[i3+1], positions[i3+2]);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        
        // Static Connections (No movement in loader, just "structure")
        for (let i = 0; i < COUNT; i++) {
            for (let j = i + 1; j < COUNT; j++) {
                const dx = positions[i*3] - positions[j*3];
                const dy = positions[i*3+1] - positions[j*3+1];
                const dz = positions[i*3+2] - positions[j*3+2];
                
                if (dx*dx+dy*dy+dz*dz < CONNECTION_DIST * CONNECTION_DIST) {
                    linePositions[lineIdx++] = positions[i*3];
                    linePositions[lineIdx++] = positions[i*3+1];
                    linePositions[lineIdx++] = positions[i*3+2];
                    
                    linePositions[lineIdx++] = positions[j*3];
                    linePositions[lineIdx++] = positions[j*3+1];
                    linePositions[lineIdx++] = positions[j*3+2];
                }
            }
        }
         linesRef.current.geometry.setDrawRange(0, lineIdx / 3);
         linesRef.current.geometry.attributes.position.needsUpdate = true;
         
         // Rotate the whole loader system slowly
         const rotationSpeed = 0.1;
         meshRef.current.rotation.y = time * rotationSpeed;
         linesRef.current.rotation.y = time * rotationSpeed;
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} visible={true}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial 
                    color={nodeColor}
                    emissive={nodeColor}
                    emissiveIntensity={(isDark ? 0.5 : 0)}
                    transparent
                    opacity={1} // Controlled by useFrame
                />
            </instancedMesh>
            <lineSegments ref={linesRef} geometry={lineGeo} visible={true}>
                <lineBasicMaterial 
                    color={edgeColor} 
                    transparent 
                    opacity={0.3} // Controlled by useFrame
                    depthWrite={false} 
                />
            </lineSegments>
        </group>
    );
}
