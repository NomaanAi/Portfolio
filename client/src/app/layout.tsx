import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"; // Updated imports
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import ChatWidget from "@/components/chat/ChatWidget";
import NeuralBackground from "@/components/ui/NeuralBackground"; // Correct path
import ClientProviders from "@/components/layout/ClientProviders";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noman.Dev | AI & Full Stack", // Updated Title
  description: "Building the future of AI & Web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground overflow-x-hidden transition-colors duration-300 relative`}
      >
        <NeuralBackground />
        <ClientProviders>
            <ClientLayout>
                <div className="relative z-10">
                    <CustomCursor />
                    <ChatWidget />
                    {children}
                </div>
            </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
