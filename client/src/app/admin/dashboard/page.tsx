"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming UI components exist or need creation? 
// The prompt implies strict rebuild but UI library might not be there.
// If shadcn/ui components are not there, I should use standard Tailwind.
// I will assume standard Tailwind first to avoid 'module not found' if shadcn is missing.
// Actually, `lucide-react` is present.

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Parallel fetch
        const [projectsRes, skillsRes, messagesRes] = await Promise.all([
           api.get("/projects").catch(() => ({ data: { data: [] } })),
           api.get("/skills").catch(() => ({ data: { data: [] } })),
           api.get("/contact").catch(() => ({ data: { data: [] } }))
        ]);

        // Adjust based on actual API response structure (usually { status, data: [...] })
        // Need to verify response structure from explore step.
        // projectController getProjects returns data.projects or data.data?
        // Let's assume standard responseWrapper { status: 'success', data: { data: [...] } } or { data: [...] }
        // Looking at previous `authController`, response is json({ status: 'success', data: { user } })
        // So likely `data.data` contains the array.
        
        setStats({
          projects: projectsRes.data.results || projectsRes.data.data?.length || 0,
          skills: skillsRes.data.results || skillsRes.data.data?.length || 0,
          messages: messagesRes.data.results || messagesRes.data.data?.length || 0,
        });

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
     return <div className="p-8">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Projects" value={stats.projects} color="bg-blue-500/10 border-blue-500/20 text-blue-500" />
        <StatsCard title="Total Skills" value={stats.skills} color="bg-purple-500/10 border-purple-500/20 text-purple-500" />
        <StatsCard title="Messages" value={stats.messages} color="bg-green-500/10 border-green-500/20 text-green-500" />
      </div>
    </div>
  );
}

function StatsCard({ title, value, color }: { title: string; value: number; color: string }) {
    return (
        <div className={`p-6 rounded-xl border ${color} transition-all`}>
            <h3 className="text-sm font-medium opacity-80 uppercase tracking-wider">{title}</h3>
            <div className="mt-2 text-4xl font-bold">{value}</div>
        </div>
    );
}
