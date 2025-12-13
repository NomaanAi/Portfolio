
import { useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import SEO from "../../components/SEO";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", error: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    
    try {
      await api.post("/api/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || "Failed to send. Please check your connection.";
      setStatus("error");
      setForm((prev) => ({ ...prev, error: errorMsg })); // Helper to store error
      // Revert status to idle after delay but keep error visible if needed? 
      // Actually let's just show the error state text.
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid md:grid-cols-2 gap-12 items-start"
    >
      <SEO 
        title="Contact | Noman.dev" 
        description="Get in touch with Noman for collaborations or inquiries."
      />
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Let's Connect</h1>
          <p className="text-slate-400">
            Have a project in mind or just want to chat? I'm always open to new opportunities and collaborations.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 rounded-full bg-accent/10 text-accent">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="font-medium">nomanshaikh0998@gmail.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 rounded-full bg-accent/10 text-accent">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Location</p>
              <p className="font-medium">Ahmedabad, India</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border p-6 rounded-2xl shadow-lg">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-backgroundDark border border-slate-700 focus:border-accent outline-none transition-colors"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl bg-backgroundDark border border-slate-700 focus:border-accent outline-none transition-colors"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            className="w-full px-4 py-3 rounded-xl bg-backgroundDark border border-slate-700 focus:border-accent outline-none transition-colors min-h-[120px]"
            placeholder="Tell me about your project..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending" || status === "success"}
          className="w-full py-3 rounded-xl bg-accent text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {status === "idle" && <><Send size={18} /> Send Message</>}
          {status === "sending" && "Sending..."}
          {status === "success" && "Message Sent!"}
          {status === "error" && (form.error || "Failed to send. Try again.")}
        </button>
      </form>
    </motion.div>
  );
}
