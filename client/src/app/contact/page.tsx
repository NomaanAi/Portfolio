"use client";

import ContactForm from "@/components/contact/ContactForm";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-16 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 text-foreground">
            Get in <span className="text-accent-secondary">Touch.</span>
          </h1>
          <p className="text-xl text-accent-secondary max-w-2xl leading-relaxed">
            I'm always interested in hearing about new projects and opportunities.
            Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </main>
  );
}
