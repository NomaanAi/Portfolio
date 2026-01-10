import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative z-10 w-full overflow-x-hidden">
       <Hero />
      <Projects />
    </main>
  );
}
