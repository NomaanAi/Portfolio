import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import ChatWidget from "@/components/chat/ChatWidget";
import NeuralBackground from "@/components/visuals/NeuralBackground";
import ClientProviders from "@/components/layout/ClientProviders";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noman.Dev | Portfolio",
  description: "Full Stack Engineer & Interface Designer.",
};

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
        <ClientProviders>
            <ClientLayout>
                <CustomCursor />
                <NeuralBackground />
                <ChatWidget />
                {children}
            </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
