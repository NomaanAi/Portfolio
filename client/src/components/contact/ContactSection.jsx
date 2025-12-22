"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section id="contact" className="py-32 w-full bg-background border-t border-white/5 relative overflow-hidden">
      <div className="container px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-sm font-bold tracking-widest text-accent-secondary uppercase mb-6 block">
            What's Next?
          </span>

          <h2 className="text-4xl md:text-7xl font-bold font-heading mb-10 text-foreground leading-tight">
            Let's build <br />
            <span className="text-accent-secondary">something incredible.</span>
          </h2>
          
          <p className="text-xl text-accent-secondary mb-12 font-normal max-w-xl mx-auto">
            Available for select freelance opportunities and consulting.
          </p>
          
          <Link 
            href="/contact"
            data-cursor="hover"
            className="inline-block px-10 py-5 bg-foreground text-background font-bold text-sm tracking-widest hover:scale-105 transition-transform duration-300"
          >
            START A PROJECT
          </Link>
          
          <div className="mt-20 flex justify-center gap-12">
            {["LinkedIn", "GitHub", "Twitter"].map((social) => (
              <a 
                key={social} 
                href="#" 
                data-cursor="hover"
                className="text-sm font-bold tracking-widest text-accent-secondary hover:text-foreground transition-colors uppercase"
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
