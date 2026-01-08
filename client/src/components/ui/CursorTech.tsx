"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "@/components/theme/ThemeProvider";
import { usePathname } from "next/navigation";
import * as THREE from "three";

// --- Cursor Logic Component ---
function TechCursorScene({ theme }: { theme: string }) {
    const { size, viewport, mouse } = useThree();
    const mainRef = useRef<THREE.Mesh>(null);
    const trailRef = useRef<THREE.InstancedMesh>(null);
    const hoverState = useRef(0); // 0 = normal, 1 = hover

    // Theme Config
    const isDark = theme === 'dark';
    const mainColor = new THREE.Color(isDark ? "#38bdf8" : "#1e293b"); // Cyan vs Slate
    const trailColor = new THREE.Color(isDark ? "#a855f7" : "#eab308"); // Purple vs Gold

    // Trail Config
    const TRAIL_COUNT = 12;
    const trailPositions = useRef(new Float32Array(TRAIL_COUNT * 3));
    const trailAges = useRef(new Float32Array(TRAIL_COUNT)); // 0 = fresh, 1 = dead

    useEffect(() => {
        // Handle Hover Listeners
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
                hoverState.current = 1;
            } else {
                hoverState.current = 0;
            }
        };
        document.addEventListener('mouseover', handleMouseOver);
        return () => document.removeEventListener('mouseover', handleMouseOver);
    }, []);

    useFrame((state, delta) => {
        if (!mainRef.current || !trailRef.current) return;

        // 1. Move Main Cursor
        // Convert normalized mouse (-1 to 1) to world coordinates
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;

        // Smooth Lerp
        mainRef.current.position.x += (x - mainRef.current.position.x) * 0.2;
        mainRef.current.position.y += (y - mainRef.current.position.y) * 0.2;

        // Pulse/Expand on hover
        const targetScale = hoverState.current === 1 ? 2.0 : 1.0;
        mainRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);

        // 2. Update Trail
        // Shift history
        for (let i = TRAIL_COUNT - 1; i > 0; i--) {
             trailPositions.current[i*3] = trailPositions.current[(i-1)*3];
             trailPositions.current[i*3+1] = trailPositions.current[(i-1)*3+1];
             trailPositions.current[i*3+2] = trailPositions.current[(i-1)*3+2];
        }
        // New head
        trailPositions.current[0] = mainRef.current.position.x;
        trailPositions.current[1] = mainRef.current.position.y;
        trailPositions.current[2] = 0;

        // Update Instance Matrix
        const dummy = new THREE.Object3D();
        for (let i = 0; i < TRAIL_COUNT; i++) {
             dummy.position.set(trailPositions.current[i*3], trailPositions.current[i*3+1], 0);
             // Size fades out
             const scale = (1 - i / TRAIL_COUNT) * 0.5; 
             dummy.scale.setScalar(scale);
             dummy.updateMatrix();
             trailRef.current.setMatrixAt(i, dummy.matrix);
             
             // Color fade could be instanced attribute but simpler to just keep uniform color for now
        }
        trailRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
             {/* Main Cursor */}
             <mesh ref={mainRef} position={[0,0,0]}>
                 <ringGeometry args={[0.15, 0.2, 32]} />
                 <meshBasicMaterial color={mainColor} transparent opacity={0.8} />
             </mesh>
             
             {/* Trail Particles */}
             <instancedMesh ref={trailRef} args={[undefined, undefined, TRAIL_COUNT]}>
                 <circleGeometry args={[0.1, 16]} />
                 <meshBasicMaterial color={trailColor} transparent opacity={0.4} />
             </instancedMesh>
        </group>
    );
}

// --- Main Wrapper ---

export default function CursorTech() {
    const pathname = usePathname();
    const { theme } = useTheme();

    if (pathname?.startsWith('/admin')) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none hidden md:block">
             <Canvas
                 dpr={[1, 1.5]}
                 gl={{ alpha: true, antialias: true }}
                 camera={{ position: [0, 0, 5], fov: 75 }}
                 className="pointer-events-none"
             >
                 <TechCursorScene theme={theme || 'dark'} />
             </Canvas>
        </div>
    );
}
