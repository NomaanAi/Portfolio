import { useState } from "react";
import api from "../services/api";
import { Download } from "lucide-react";

export default function DownloadCV() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    setDownloading(true);
    try {
      const response = await api.get('/api/resume', {
        responseType: 'blob', // Important for binary data
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Try to extract filename from content-disposition if available, else default
      link.setAttribute('download', 'Noman_Resume.pdf'); 
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download resume. Please login or try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-slate-950 font-medium hover:bg-accentSoft transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={18} />
      {downloading ? "Downloading..." : "Download CV"}
    </button>
  );
}
