"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
// import { AuthProvider } from "@/context/AuthContext";
// import { GoogleOAuthProvider } from '@react-oauth/google';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}


