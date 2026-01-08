"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SmartCursorProps {
    theme: string;
}

export default function SmartCursor({ theme }: SmartCursorProps) {
    const { viewport, mouse } = useThree();
    const trailRef = useRef<THREE.InstancedMesh>(null);
    const TRAIL_COUNT = 8;
    
    const isDark = theme === 'dark';
    
    // Theme Colors
    // Dark: Cyan glow (#06b6d4)
    // Light: Slate inner (#475569)
    const color = new THREE.Color(isDark ? "#06b6d4" : "#475569");
    const emissive = isDark ? new THREE.Color("#06b6d4") : new THREE.Color("#000000");
    const emissiveIntensity = isDark ? 2 : 0;

    // History of positions for trails
    const history = useRef<THREE.Vector3[]>(
        Array(TRAIL_COUNT).fill(new THREE.Vector3(0,0,0))
    );

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!trailRef.current) return;

        // Convert normalized mouse coordinates (-1 to 1) to world coordinates
        // We assume z=0 plane for cursor
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        const currentPos = new THREE.Vector3(x, y, 0);

        // Shift history
        // history.current.pop();
        // history.current.unshift(currentPos);
        // Better: Interpolate for smoother trails
        // For simple trail, just unshift/pop is okay, but lerping gives "fluidity"
        
        // Let's implement a 'drag' effect where trails follow the head
        const head = history.current[0];
        head.lerp(currentPos, 0.4); // Head follows mouse fast

        for (let i = 1; i < TRAIL_COUNT; i++) {
             // Each subsequent node follows the previous one
             history.current[i].lerp(history.current[i-1], 0.25);
        }

        // Apply transformations to instances
        for (let i = 0; i < TRAIL_COUNT; i++) {
            const pos = history.current[i];
            // Scale down trailing nodes
            const scale = 1 - (i / TRAIL_COUNT);
            
            dummy.position.copy(pos);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            
            trailRef.current.setMatrixAt(i, dummy.matrix);
        }
        trailRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
             <instancedMesh ref={trailRef} args={[undefined, undefined, TRAIL_COUNT]}>
                <sphereGeometry args={[0.12, 16, 16]} /> 
                {/* 0.12 units roughly corresponds to 8-12px depending on viewport/camera z */}
                <meshStandardMaterial 
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                    transparent
                    opacity={0.8}
                    roughness={0.5}
                />
             </instancedMesh>
        </group>
    );
}
