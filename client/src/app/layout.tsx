import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"; // Updated imports
import "./globals.css";
// Removed CustomCursor
import ChatWidget from "@/components/chat/ChatWidget";
// Removed NeuralBackground
import ClientProviders from "@/components/layout/ClientProviders";
import ClientLayout from "@/components/layout/ClientLayout";
import { ThemeScript } from "@/components/theme/ThemeScript";

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
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeScript />
        <ClientProviders>
            <ClientLayout>
                {/* Reset: Removed CustomCursor and ChatWidget (temporarily checked if Widget needs to stay) - User said Chatbot UI remains fully functional */}
                {/* Keeping ChatWidget as per 'Chatbot UI remains fully functional' rule, but removing visual fluff */}
                <ChatWidget />
                <div className="min-h-screen flex flex-col">
                    {children}
                </div>
            </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
