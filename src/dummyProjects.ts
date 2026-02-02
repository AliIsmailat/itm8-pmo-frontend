import type { Project } from "./components/ProjectTable"

export const projects: Project[] = [
  {
    id: 1,
    name: "Ny webbplats",
    customer: "Acme AB",
    startDate: "2026-01-10",
    endDate: "2026-03-01",
    budgetHours: 120,
    resources: ["Alice", "Bob"],
    usedHours: 48,
  },
  {
    id: 2,
    name: "Mobilapp",
    customer: "Nordic Tech",
    startDate: "2026-02-01",
    endDate: "2026-04-15",
    budgetHours: 200,
    resources: ["Charlie", "Diana", "Eve"],
    usedHours: 95,
  },
  {
    id: 3,
    name: "Dashboard system",
    customer: "FinCorp",
    startDate: "2026-01-20",
    endDate: "2026-05-01",
    budgetHours: 300,
    resources: ["Alice", "Bob", "Eve"],
    usedHours: 140,
  },
];
