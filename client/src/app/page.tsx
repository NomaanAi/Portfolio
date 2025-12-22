"use client";

import HeroSection from "@/components/hero/HeroSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import AboutPreview from "@/components/about/AboutPreview";
import SkillsPreview from "@/components/skills/SkillsPreview";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <HeroSection />
      
      {/* Featured Projects - Limit 3 */}
      <ProjectsSection limit={3} />

      <AboutPreview />
      
      <SkillsPreview />

      <ContactSection />
    </main>
  );
}
