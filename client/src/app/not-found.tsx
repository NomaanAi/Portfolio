import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground space-y-4">
      <h1 className="text-6xl font-black font-heading text-primary">404</h1>
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground">The resource you requested could not be found.</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity mt-4"
      >
        Return Home
      </Link>
    </div>
  );
}
