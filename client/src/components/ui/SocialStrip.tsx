"use client";

import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function SocialStrip() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  const socialLinks = [
    { icon: Github, href: "https://github.com/NomaanAi", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/noman-shaikh-ai", label: "LinkedIn" },
    { icon: Mail, href: "mailto:contact@noman.dev", label: "Email" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[990] hidden md:flex flex-col gap-6 items-center">
        {/* Line Decoration */}
      <div className="w-[1px] h-24 bg-gradient-to-t from-border to-transparent opacity-50"></div>
      
      {socialLinks.map((social, index) => (
        <motion.a 
            key={index} 
            href={social.href} 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, x: -5 }}
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary/20"
        >
            <social.icon size={20} />
            <span className="sr-only">{social.label}</span>
        </motion.a>
      ))}
    </div>
  );
}
