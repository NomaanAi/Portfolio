"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Snappier Apple-style physics
  const springConfig = { damping: 20, stiffness: 400, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "hover"
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main defined cursor dot - Solid Color, Low Opacity */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-foreground/30 rounded-full pointer-events-none z-[9999]"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          scale: hovered ? 1.5 : 1, 
          opacity: hovered ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Subtle follower ring - REMOVED for minimalism or kept extremely faint */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] opacity-10"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: "-50%",
          y: "-50%",
          border: "1px solid var(--color-foreground)"
        }}
        animate={{
          scale: hovered ? 2 : 1,
            opacity: hovered ? 0.2 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}
