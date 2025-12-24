"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PageLoaderProps {
    isLoading: boolean;
    minDuration?: number; // Minimum time to show loader in ms
}

export default function PageLoader({ isLoading, minDuration = 600 }: PageLoaderProps) {
    const [shouldRender, setShouldRender] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (!isLoading) {
            // Wait for minimum duration or fade out immediately if fast? 
            // Better to rely on the parent managing 'isLoading' truth, 
            // but we handle the fade out animation delay here.
            
            // Start fade out
            setIsVisible(false);
            
            // Unmount after transition
            timeoutId = setTimeout(() => {
                setShouldRender(false);
            }, 800); // 800ms transition match
        } else {
            setShouldRender(true);
            setIsVisible(true);
        }

        return () => clearTimeout(timeoutId);
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div 
            className={cn(
                "fixed inset-0 z-40 flex items-center justify-center transition-all duration-700 ease-out pointer-events-none",
                // Light: White backdrop with blur. Dark: Black backdrop with blur.
                // Using bg-background/80 for glass effect, allowing Navbar (z-50) to shine through if desired
                "bg-background/90 backdrop-blur-sm",
                isVisible ? "opacity-100" : "opacity-0"
            )}
        >
            <div className="relative">
                {/* 1. Outer Ring (Static, Subtle) */}
                <div className="absolute inset-0 rounded-full border border-primary/20" />
                
                {/* 2. Spinning Ring (Active) */}
                <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                
                {/* 3. Pulse Center (Node) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}
