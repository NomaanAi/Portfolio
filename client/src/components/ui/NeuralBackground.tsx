"use client";

import React, { useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Configuration
    const particleCount = 40; // Reduced for minimalism
    const connectionDistance = 150;
    const mouseDistance = 150;
    
    // Brand Colors - Muted Slate/Indigo
    const colorParticle = "rgba(148, 163, 184, 0.5)"; // Slate-400
    const colorLine = "rgba(148, 163, 184, 0.15)"; // Very subtle slate lines
    
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.2; // Very slow movement
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 1.5 + 0.5; // Smaller, finer particles
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = colorParticle;
        ctx.fill();
        
        // Removed heavy shadow glow
      }
    }

    const init = () => {
      particles = [];
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;

      // Responsive particle count
      const count = window.innerWidth < 768 ? 30 : particleCount;
      
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(innerWidth, innerHeight));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      particles.forEach((particle, index) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
        // ctx.shadowBlur = 0; // Removed as no shadow was added

        // Draw connections
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.1})`; // Very faint lines
            ctx.lineWidth = 0.5; // Thinner lines
            ctx.moveTo(particles[j].x, particles[j].y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
          }
        }
        
        // Mouse interaction (connect to nearby particles)
        const dxMouse = mouseRef.current.x - particle.x;
        const dyMouse = mouseRef.current.y - particle.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < mouseDistance) {
            ctx.beginPath();
            const opacity = 1 - distMouse / mouseDistance;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`; // Muted Indigo interaction
            ctx.lineWidth = 1;
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    
    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20"
      aria-hidden="true"
    />
  );
};

export default NeuralBackground;
