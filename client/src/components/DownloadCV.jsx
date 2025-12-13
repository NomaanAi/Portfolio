const API_BASE = import.meta.env.VITE_API_URL;

export default function DownloadCV() {
  return (
    <a
      href={`${API_BASE}/api/resume`}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-slate-950 font-medium
                 hover:bg-accentSoft transition-all duration-200 shadow-sm"
    >
      Download CV
    </a>
  );
}
