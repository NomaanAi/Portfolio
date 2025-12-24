import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/Cursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noman.Dev | Portfolio",
  description: "Full Stack Engineer & Interface Designer.",
};

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground overflow-x-hidden transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CustomCursor />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
