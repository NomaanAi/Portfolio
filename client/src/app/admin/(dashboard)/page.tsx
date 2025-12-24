"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          api.get("/projects"),
          api.get("/skills")
        ]);
        setStats({
          projects: (pRes.data.data?.data?.length) || (pRes.data.data?.projects?.length) || (Array.isArray(pRes.data.data) ? pRes.data.data.length : 0),
          skills: (sRes.data.data?.data?.length) || (sRes.data.data?.skills?.length) || (Array.isArray(sRes.data.data) ? sRes.data.data.length : 0)
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-heading text-foreground">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-surface border border-foreground/10 rounded-xl">
          <h3 className="text-accent-secondary text-sm font-mono uppercase">Total Projects</h3>
          <p className="text-4xl font-bold text-foreground mt-2">{stats.projects}</p>
        </div>
        <div className="p-6 bg-surface border border-foreground/10 rounded-xl">
          <h3 className="text-accent-secondary text-sm font-mono uppercase">Total Skills</h3>
          <p className="text-4xl font-bold text-foreground mt-2">{stats.skills}</p>
        </div>
        <div className="p-6 bg-surface border border-foreground/10 rounded-xl">
          <h3 className="text-accent-secondary text-sm font-mono uppercase">System Status</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">ONLINE</p>
        </div>
      </div>

       <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/admin/projects" className="px-6 py-3 bg-foreground text-background font-bold uppercase text-sm hover:opacity-90 transition-opacity flex items-center justify-center">
            Manage Projects
          </Link>
          <Link href="/admin/skills" className="px-6 py-3 border border-foreground/20 text-foreground font-bold uppercase text-sm hover:bg-foreground hover:text-background transition-colors flex items-center justify-center">
            Manage Skills
          </Link>
        </div>
      </div>
    </div>
  );
}
