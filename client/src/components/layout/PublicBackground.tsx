import React, { useState, useEffect, Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";
import HeroNetwork3D from "@/components/three/HeroNetwork3D";
import BackgroundMesh from "@/components/three/BackgroundMesh";
import { isWebGLAvailable } from "@/utils/capabilities";
import { useProgress } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import LoaderScene from "@/components/three/LoaderScene";

// Dynamically import Canvas to ensure it ONLY runs on client and avoids Strict Mode double-mount issues
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
  loading: () => null,
});

// Separate component to handle the context bridging safely
const ThemeConsumer = ({ children }: { children: (theme: string, pathname: string) => React.ReactNode }) => {
  const { theme } = useTheme();
  const pathname = usePathname();
  return <>{children(theme, pathname)}</>;
};

// Orchestrates the Fade In/Out logic
// This must be INSIDE the Canvas to access useFrame/useProgress
function TransitionOrchestrator({ theme, pathname }: { theme: string, pathname: string }) {
    const { active, progress } = useProgress();
    const [mountMain, setMountMain] = useState(false);
    
    // Smooth opacity states (0 to 1)
    const loaderOpacity = useRef(1);
    const mainOpacity = useRef(0);
    
    // Route Logic
    const isHero = pathname === "/";
    const isContentPage = pathname.includes("/skills") || pathname.includes("/about") || pathname.includes("/experience");

    useFrame((state, delta) => {
        // Simple linear interpolation based on loading state
        // If loading is done (!active) -> Fade OUT loader, Fade IN main
        // If loading (active) -> Fade IN loader (starts at 1), Main stays 0
        
        const FADE_SPEED = 2.0 * delta; // Adjust speeed
        
        if (!active && progress === 100) {
             // Loading Complete
             loaderOpacity.current = THREE.MathUtils.lerp(loaderOpacity.current, 0, FADE_SPEED);
             mainOpacity.current = THREE.MathUtils.lerp(mainOpacity.current, 1, FADE_SPEED);
             
             // Ensure main is mounted once we start valid loading
             if (!mountMain) setMountMain(true);
        } else {
             // Still Loading
             // Ensure loader is visible
             loaderOpacity.current = THREE.MathUtils.lerp(loaderOpacity.current, 1, FADE_SPEED);
             mainOpacity.current = 0;
        }
    });

    return (
        <>
             {/* Shared Lighting */}
             <ambientLight intensity={theme === 'dark' ? 0.3 : 0.6} />
             <directionalLight position={[10, 10, 5]} intensity={1} color={theme === 'dark' ? "#4f46e5" : "#ffffff"} />

             {/* 1. Loader Layer (Always present until faded out) */}
             <LoaderScene themeValue={theme} opacity={loaderOpacity} />

             {/* 2. Main Content (Wrapped in Suspense) */}
                        {/* We use React.Suspense to ensure assets load before showing */}
                        {/* But visuals are controlled by opacity, so it doesn't pop */}
                        <Suspense fallback={null}>
                            <group visible={true}>
                                    <BackgroundMesh themeValue={theme} visible={false} opacityScale={0} />
                                    <MainSceneContent 
                                        theme={theme} 
                                        isHero={isHero} 
                                        isContentPage={isContentPage} 
                                        transitionOpacity={mainOpacity} 
                                    />
                            </group>
                        </Suspense>
                    </>
                );
            }
            
            // Wrapper to prevent re-renders of the entire tree every frame
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function MainSceneContent({ theme, isHero, isContentPage, transitionOpacity }: any) {
                // Pass refs down directly
                return (
                     <HeroNetwork3D themeValue={theme} opacityScale={transitionOpacity} isHero={isHero} />
                );
            }

class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("WebGL Context Creation Failed or R3F Error:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function PublicBackground() {
  const [canRender, setCanRender] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebGLAvailable(false);
      return;
    }

    let frameId: number;
    const startRender = () => {
       frameId = requestAnimationFrame(() => {
          setCanRender(true);
       });
    };
    const timeoutId = setTimeout(startRender, 100);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const FallbackUI = (
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 opacity-50" />
  );

  if (!webGLAvailable) return FallbackUI;
  if (!canRender) return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none w-full h-full bg-background transition-colors duration-300">
        <ErrorBoundary fallback={FallbackUI}>
            <ThemeConsumer>
                {(theme, pathname) => (
                  <Canvas 
                    camera={{ position: [0, 0, 10], fov: 45 }}
                    dpr={[1, 1.5]}
                    gl={{ 
                      alpha: true, 
                      antialias: false,
                      powerPreference: "low-power", 
                      preserveDrawingBuffer: false,
                      failIfMajorPerformanceCaveat: false,
                      stencil: false
                    }}
                    onCreated={({ gl }) => {
                        gl.domElement.addEventListener("webglcontextlost", (e) => {
                            e.preventDefault();
                            console.warn("WebGL Context Lost");
                        });
                    }}
                  >
                      <TransitionOrchestrator theme={theme} pathname={pathname} />
                  </Canvas>
                )}
            </ThemeConsumer>
        </ErrorBoundary>
    </div>
  );
}

