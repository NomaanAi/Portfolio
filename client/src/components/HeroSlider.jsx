
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Building Intelligent Systems",
    description: "Specializing in AI/ML solutions that drive business value.",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "Full-Stack Excellence",
    description: "Creating seamless web experiences with modern technologies.",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    title: "Cloud Native Architecture",
    description: "Scalable, reliable, and secure infrastructure design.",
    color: "from-orange-500 to-red-600"
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden mb-12 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[current].color} opacity-20`}
        />
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center p-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              {slides[current].title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300">
              {slides[current].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-backgroundDark/80 to-transparent" />

      {/* Controls */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              current === idx ? "bg-white w-6" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
