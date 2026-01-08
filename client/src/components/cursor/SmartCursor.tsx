"use client";

import React, { useEffect, useRef, useState } from "react";

interface SmartCursorProps {
    theme: string;
}

export default function SmartCursor({ theme }: SmartCursorProps) {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Hide default cursor
        document.body.style.cursor = 'none';

        const moveCursor = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
            if (followerRef.current) {
                // simple lag effect can be achieved with transition in CSS, 
                // but for better precise control we could use RAF. 
                // For now, let's use a slight delay via CSS transition which is performant.
                followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", moveCursor);
        document.body.addEventListener("mouseenter", handleMouseEnter);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener("mousemove", moveCursor);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isVisible]);

    const isDark = theme === 'dark';
    // Colors based on original: Dark: #06b6d4 (Cyan), Light: #475569 (Slate)
    const cursorColor = isDark ? "bg-cyan-500" : "bg-slate-600";
    const followerBorder = isDark ? "border-cyan-500" : "border-slate-600";

    // Don't render on mobile/touch devices if possible, but for now just returning null if not mounted isn't enough detection.
    // CSS media query `pointer: fine` is handled best in CSS, but here we render always and let CSS handle visibility or just keep it simple.

    return (
        <>
            {/* Main Dot Cursor */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-3 h-3 ${cursorColor} rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform`}
                style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s', mixBlendMode: 'difference' }}
            />
            {/* Follower Ring */}
            <div
                ref={followerRef}
                className={`fixed top-0 left-0 w-8 h-8 border ${followerBorder} rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 will-change-transform transition-transform duration-100 ease-out`}
                style={{ opacity: isVisible ? 0.6 : 0, transition: 'opacity 0.2s, transform 0.1s ease-out' }}
            />
        </>
    );
}
