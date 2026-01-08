"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { ArrowRight, Code2, ExternalLink, Github, Linkedin } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import PageLoader from "@/components/layout/PageLoader";
import NeuralSphere from "@/components/visuals/NeuralSphere";


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
    <main className="min-h-screen relative overflow-hidden">
      <PageLoader isLoading={isPageLoading} />
      
      {/* Hero Section */}
      <section className="min-h-screen pt-24 pb-12 flex items-center relative z-10">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
            {/* Left: Content */}
            <div className="flex flex-col justify-center items-start space-y-8 max-w-3xl w-full z-20">
                 <div className="relative w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col items-start space-y-6"
                        >
                            <h1 className={cn(
                                "text-5xl md:text-6xl lg:text-8xl font-bold font-heading tracking-tight leading-[1] text-left",
                                "bg-clip-text text-transparent bg-gradient-to-r",
                                HERO_SLIDES[currentSlide].gradient
                            )}>
                                {HERO_SLIDES[currentSlide].title}
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed text-left">
                                {HERO_SLIDES[currentSlide].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                 </div>
                 
                <div className="flex flex-wrap items-center gap-6 pt-6">
                    <Link 
                        href="/projects" 
                        className="inline-flex h-14 min-w-[160px] items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:-translate-y-1 active:scale-95 gap-2 shadow-lg shadow-primary/20"
                    >
                        View Work 
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                        href="/contact" 
                        className="inline-flex h-14 min-w-[160px] items-center justify-center rounded-lg border border-input bg-background/50 px-8 text-base font-bold text-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:-translate-y-1 active:scale-95 backdrop-blur-sm"
                    >
                        Contact Me
                    </Link>
                </div>
            </div>

            {/* Right: Neural Sphere */}
            <div className="hidden lg:flex h-full relative z-10 items-center justify-center">
                 <NeuralSphere />
            </div>
        </div>
        
         {/* Scroll Indicator */}

         
         {/* Social Links Positioned Absolute Bottom Right */}

      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
         <section className="py-24 px-6 container-wide relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-border/30 pb-6">
                <div>
                   <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-2">Featured Work</h2>
                   <p className="text-muted-foreground text-lg">A selection of recent projects.</p>
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
            
            <div className="mt-8 md:hidden flex justify-center">
                 <Link href="/projects" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition group text-muted-foreground">
                    View Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </Link>
            </div>
         </section>
      )}
      
      {/* Skill DNA (Teaser) */}
      <section className="py-24 border-t border-border/30 bg-background/50 backdrop-blur-sm relative z-10">
         <div className="container-wide text-center">
            <h2 className="text-sm font-bold font-mono tracking-[0.3em] uppercase text-muted-foreground/80 mb-12">Core Technologies</h2>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 max-w-6xl mx-auto">
                 {skills.slice(0, 15).map((skill: any) => (
                     <div key={skill._id} className="flex items-center gap-3 text-base font-medium text-foreground/80 hover:text-foreground transition-colors cursor-default">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span> {skill.name}
                     </div>
                 ))}
            </div>
            <div className="mt-16">
                 <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-mono border border-border px-6 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <Code2 className="w-4 h-4" /> Initialize Full Stack View
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
