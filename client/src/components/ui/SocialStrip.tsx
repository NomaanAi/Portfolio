"use client";

import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function SocialStrip() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  // Outbound links are now strictly limited to the Contact page per new compliance rules.
  return null;
}
