"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the heavy scene content
const NebulaContent = dynamic(() => import("./NebulaContent"), { 
  ssr: false,
  loading: () => null 
});

export default function NebulaScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
         <Suspense fallback={null}>
            <NebulaContent />
         </Suspense>
      </Canvas>
    </div>
  );
}
