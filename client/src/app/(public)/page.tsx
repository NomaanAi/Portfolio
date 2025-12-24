"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { ArrowRight, Code2, ExternalLink, Github, Linkedin } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/layout/PageLoader";

const HERO_SLIDES = [
  {
    title: "AI & Full Stack Engineer",
    subtitle: "Building intelligent, scalable systems.",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    title: "From Models to Production",
    subtitle: "ML, APIs, distributed systems, and UI.",
    gradient: "from-purple-500 to-pink-400"
  },
  {
    title: "Engineering with Purpose",
    subtitle: "Research-driven, product-focused development.",
    gradient: "from-emerald-400 to-teal-500"
  }
];
export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Minimum safety delay (500ms) to ensure loader is seen and doesn't flicker
      // This is "Amazon-style" polish - ensuring the UI feels settled before revealing.
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));
      
      try {
        const [projRes, skillRes] = await Promise.all([
           api.get("/projects").catch(() => ({ data: { data: [] } })),
           api.get("/skills").catch(() => ({ data: { data: [] } })),
           minLoadTime // efficient parallel wait
        ]);

        const allProjects = projRes.data.data?.data || projRes.data.data?.projects || projRes.data.data || [];
        const featured = allProjects.filter((p: any) => p.featured).slice(0, 3);
        setFeaturedProjects(featured);

        const allSkills = skillRes.data.data?.data || skillRes.data.data || [];
        // Filter out "Other" for teaser too
        setSkills(allSkills.filter((s:any) => s.category !== "Other"));
      } catch (error) {
        console.error("Home fetch error", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen">
      <PageLoader isLoading={isPageLoading} />
      
      {/* Hero Section */}
      <section className="h-screen flex items-center container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
            {/* Left: Content */}
            <div className="text-left space-y-8">
                 <div className="h-[200px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 flex flex-col justify-center space-y-4"
                        >
                            <h1 className={cn(
                                "text-5xl md:text-7xl font-black font-heading tracking-tight leading-tight",
                                "bg-clip-text text-transparent bg-gradient-to-r",
                                HERO_SLIDES[currentSlide].gradient
                            )}>
                                {HERO_SLIDES[currentSlide].title}
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide max-w-lg">
                                {HERO_SLIDES[currentSlide].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                 </div>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex gap-4 pt-4"
                >
                    <Link href="/projects" className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40">
                        View Work 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/contact" className="px-8 py-4 bg-background/50 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-foreground rounded-full font-bold hover:bg-secondary/50 transition-all">
                        Contact Me
                    </Link>
                </motion.div>
            </div>

            {/* Right: 3D Spacer (The Sphere is fixed in GlobalBackground) */}
            <div className="hidden lg:block h-full pointer-events-none">
                {/* 3D Model sits here visually via GlobalBackground canvas */}
            </div>
        </div>
        
         {/* Scroll Indicator */}
         <motion.div 
            className="absolute bottom-10 left-10 flex items-center gap-4 opacity-30"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
         >
            <div className="h-[1px] w-12 bg-foreground"></div>
            <span className="text-[10px] uppercase tracking-widest font-mono">System Online</span>
         </motion.div>
         {/* Social Links */}
         <motion.div 
            className="absolute bottom-10 right-10 flex items-center gap-6 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
         >
             <a href="https://github.com/NomaanAi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-200">
                <Github className="w-5 h-5" />
             </a>
             <a href="https://www.linkedin.com/in/nomaanai/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-200">
                <Linkedin className="w-5 h-5" />
             </a>
         </motion.div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
         <section className="py-32 px-6 container-wide relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6 border-b border-border/30 pb-6">
                <div>
                   <h2 className="text-4xl font-bold font-heading tracking-tight">Output / <span className="text-muted-foreground font-light">Featured</span></h2>
                </div>
                <Link href="/projects" className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition group text-muted-foreground">
                    View Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                {featuredProjects.map((project: any, index: number) => (
                    <TiltCard key={project._id} index={index}>
                         <ProjectCardContent project={project} />
                    </TiltCard>
                ))}
            </div>
         </section>
      )}
      
      {/* Skill DNA (Teaser) */}
      <section className="py-24 border-t border-border/30 bg-background/50 backdrop-blur-sm relative z-10">
         <div className="container-wide text-center">
            <h2 className="text-xs font-bold font-mono tracking-[0.3em] uppercase text-muted-foreground/60 mb-12">System Architecture</h2>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 max-w-6xl mx-auto">
                 {skills.slice(0, 15).map((skill: any) => (
                     <div key={skill._id} className="flex items-center gap-2 text-sm md:text-base font-medium opacity-60 hover:opacity-100 transition-opacity cursor-default">
                         <span className="w-1 h-1 rounded-full bg-primary"></span> {skill.name}
                     </div>
                 ))}
            </div>
            <div className="mt-12">
                 <Link href="/skills" className="text-xs font-mono border border-border px-4 py-2 rounded hover:bg-muted transition-colors">
                    Initialize Full Stack View
                 </Link>
            </div>
         </div>
      </section>
    </main>
  );
}

// 3D Tilt Wrapper
function TiltCard({ children, index }: { children: React.ReactNode, index: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]); // Inverse tilt
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{ rotateX, rotateY }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="h-full transform-style-3d"
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

function ProjectCardContent({ project }: { project: any }) {
    return (
        <Link href={`/projects#${project._id}`} className="block h-full relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur-xl"></div>
             
             <div className="h-full bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden flex flex-col relative z-10 transition-colors group-hover:border-primary/30">
                 {/* Header */}
                 <div className="h-56 relative bg-secondary/20 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
                      
                      <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          {project.githubUrl && <div className="p-2 bg-background/50 backdrop-blur rounded-full hover:text-primary"><Github className="w-4 h-4"/></div>}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-9xl font-black opacity-[0.03] scale-150 select-none group-hover:scale-100 transition-transform duration-700">
                              {project.title.substring(0,2)}
                          </h3>
                      </div>
                 </div>

                 {/* Body */}
                 <div className="p-8 flex-1 flex flex-col gap-4">
                      <div>
                          <h3 className="text-2xl font-bold font-heading mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                          <p className="text-sm font-mono text-primary/70">{project.tagline}</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                          {project.desc}
                      </p>

                      <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-border/30">
                          {project.stack.slice(0, 4).map((t: string) => (
                              <span key={t} className="text-[10px] font-mono border border-border/50 px-2 py-1 rounded text-muted-foreground">
                                  {t}
                              </span>
                          ))}
                      </div>
                 </div>
             </div>
        </Link>
    )
}
