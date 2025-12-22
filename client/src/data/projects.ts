export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  status: "Completed" | "In Progress" | "Archived";
}

// REAL DATA ONLY. Leave empty if no projects are ready for showcase.
export const PROJECTS: Project[] = [
  // Example structure (uncomment when ready):
  // {
  //   id: "1",
  //   title: "Production AI Pipeline",
  //   description: "Scalable inference engine using TorchServe and Kubernetes.",
  //   techStack: ["Python", "PyTorch", "Docker", "K8s"],
  //   status: "Completed"
  // }
];
