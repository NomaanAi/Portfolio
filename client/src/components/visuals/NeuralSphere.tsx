"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface Point {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

export default function NeuralSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Configuration
  const particleCount = 250;
  const radius = 200;
  const connectionDistance = 60;
  const rotationSpeed = 0.002;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: Point[] = [];
    let animationFrameId: number;
    let rotationX = 0;
    let rotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Initialize points on a sphere
    const initPoints = () => {
      points = [];
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

      for (let i = 0; i < particleCount; i++) {
        const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
        const r = Math.sqrt(1 - y * y); // radius at y
        const theta = phi * i; // golden angle increment

        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;

        // Scale by radius
        points.push({
          x: x * radius,
          y: y * radius,
          z: z * radius,
          baseX: x * radius,
          baseY: y * radius,
          baseZ: z * radius,
        });
      }
    };

    const resize = () => {
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      // Center assumes width/height are roughly similar or we just center in the box
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - canvas.width / 2) * 0.0005;
      mouseY = (e.clientY - rect.top - canvas.height / 2) * 0.0005;
    };

    let lastTime = 0;
    
    const draw = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Determine colors based on theme/CSS variables
      const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
      const pointColor = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(15, 23, 42, 0.8)";
      const lineColor = isDark ? "rgba(6, 182, 212, 0.15)" : "rgba(37, 99, 235, 0.15)"; 
      const accentColor = isDark ? "rgba(6, 182, 212, 0.8)" : "rgba(37, 99, 235, 0.8)";

      // Normalize speed: originally 0.002 per frame.
      // Target 60fps -> 16.6ms per frame.
      // 0.002 * 60 = 0.12 radians per second.
      // So speed per ms approx = 0.00012
      const speedFactor = 0.06; // Adjusted for pleasant speed with delta (ms)

      // Auto rotation with Delta Time
      // deltaTime is in ms. 
      // rotationSpeed (0.002) was per frame. 
      // Let's use a calibrated value.
      rotationX += 0.00003 * deltaTime * 20; // Calibrated for similar look to original
      rotationY += 0.000015 * deltaTime * 20;

      // Add mouse influence (damped, so valid to keep per frame or scale with delta too)
      rotationX += mouseY * 0.1;
      rotationY += mouseX * 0.1;

      // Update and project points
      const projectedPoints = points.map((p) => {
        // Rotate Y
        let x = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
        let z = p.x * Math.sin(rotationY) + p.z * Math.cos(rotationY);
        
        // Rotate X
        let y = p.y * Math.cos(rotationX) - z * Math.sin(rotationX);
        z = p.y * Math.sin(rotationX) + z * Math.cos(rotationX);

        const scale = 400 / (400 - z); 
        const x2d = x * scale + centerX;
        const y2d = y * scale + centerY;
        const opacity = Math.max(0.1, (z + radius) / (2 * radius)); 

        return { x: x2d, y: y2d, z, opacity };
      });

      // Draw connections first (behind points)
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        if (p1.z < -100) continue; 

        for (let j = i + 1; j < projectedPoints.length; j++) {
            const p2 = projectedPoints[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < connectionDistance) {
                 const alpha = 1 - (dist / connectionDistance);
                 ctx.moveTo(p1.x, p1.y);
                 ctx.lineTo(p2.x, p2.y);
            }
        }
      }
      ctx.stroke();

      // Draw points
      projectedPoints.forEach((p) => {
          const size = Math.max(0.5, (p.z + radius) / (1.5 * radius) * 2.5);
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          
          if (p.z > 50) {
              ctx.fillStyle = accentColor;
              ctx.shadowBlur = 10;
              ctx.shadowColor = accentColor;
          } else {
              ctx.fillStyle = pointColor;
              ctx.shadowBlur = 0;
          }
          
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    initPoints();
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Use a container to define size
  return (
    <div 
        ref={containerRef} 
        className="w-full h-full min-h-[500px] flex items-center justify-center relative z-20"
        aria-hidden="true"
    >
        <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
