// Section import removed to avoid double animation (PageTransition handles load)
export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-background border-b border-border/50">
      <div className="container-max w-full pt-12 md:pt-0">
        <div className="max-w-2xl py-12">
          {/* Badge */}
          <div className="inline-flex items-center px-2 py-1 rounded border border-border bg-surface mb-6 select-none">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Full-Stack AI Engineer</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Scalable Systems.<br />
            Reliable Intelligence.
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            Specializing in RAG pipelines, inference optimization, and production-grade architecture.
            No fluff, just high-performance engineering.
          </p>

          <div className="flex gap-4">
            <button className="h-10 px-6 bg-foreground text-background rounded font-medium text-sm hover:opacity-90 active:scale-[0.97] transition-all duration-150 ease-out active:duration-100">
              View Projects
            </button>
            <button className="h-10 px-6 text-muted-foreground border border-border rounded font-medium text-sm hover:text-foreground hover:bg-surface active:scale-[0.97] transition-all duration-150 ease-out active:duration-100">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
