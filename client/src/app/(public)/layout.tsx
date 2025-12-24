"use client";

import Navbar from "@/components/layout/Navbar";
import PublicBackground from "@/components/layout/PublicBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicBackground />
      <Navbar />
      {children}
    </>
  );
}
