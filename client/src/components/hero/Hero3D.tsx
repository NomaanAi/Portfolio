"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "@/three/Scene";

export default function Hero3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3] }} dpr={[1, 1.5]}>
         <Suspense fallback={null}>
            <Scene />
         </Suspense>
         <ambientLight intensity={0.5} />
         <pointLight position={[10, 10, 10]} color="#06b6d4" intensity={1} />
      </Canvas>
    </div>
  );
}
