"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPreview() {
  return (
    <section id="about" className="py-32 bg-background border-t border-white/5">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-bold tracking-widest text-accent-secondary uppercase mb-4 block">
              About Me
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-8 leading-tight">
              Engineering with <br />
              <span className="text-accent-secondary">Purpose & Precision.</span>
            </h2>
          </div>
          
          <div className="text-accent-secondary text-lg leading-relaxed space-y-8">
            <p>
              I am a Full Stack Engineer focused on building scalable, performant, and beautiful applications.
              With a background in advanced computation and a passion for design, I bridge the gap between
              complex backend logic and intuitive user experiences.
            </p>
            <p>
              My philosophy is simple: clarity above all. Every line of code and every pixel is placed
              with intention.
            </p>
            
            <Link 
              href="/about" 
              data-cursor="hover"
              className="inline-block text-sm font-bold tracking-widest text-foreground pb-1 border-b border-white/20 hover:border-white transition-colors"
            >
              READ FULL BIO
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
