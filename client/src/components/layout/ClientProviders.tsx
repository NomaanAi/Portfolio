"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                {/* Runtime Check for Debugging */}
                <AuthDebug />
                <AuthProvider>
                    {children}
                </AuthProvider>
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
}

function AuthDebug() {
    if (typeof window !== 'undefined') {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "PLACEHOLDER_CLIENT_ID") {
             console.error("❌ Google Client ID is MISSING. Login will fail. Check .env.local");
        } else {
             console.log("✅ Google Client ID Loaded:", clientId.substring(0, 10) + "...");
        }
    }
    return null;
}
