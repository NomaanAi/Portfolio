"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}
