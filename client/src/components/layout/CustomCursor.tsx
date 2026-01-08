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
      {/* Main defined cursor dot - Solid Color, No Blend Mode */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999]"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          scale: hovered ? 1 : 1, // Don't scale the dot, only the ring
          opacity: 1,
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Subtle follower ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary/50 rounded-full pointer-events-none z-[9998] opacity-30 backdrop-blur-[1px]"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          scale: hovered ? 2.5 : 1,
          opacity: hovered ? 0.5 : 0.3,
          backgroundColor: hovered ? "var(--primary)" : "rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
    </>
  );
}
