import type { Project } from "./ProjectTable";

export interface ProjectFilterState {
  startDate?: string;
  endDate?: string;
  phase?: string;
}

export function filterProjects(
  projects: Project[],
  query: string,
  filters?: ProjectFilterState
) {
  const q = query.toLowerCase();

  return projects.filter((p) => {
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.customer.toLowerCase().includes(q) ||
      p.resources.some((r) => r.toLowerCase().includes(q));

    const matchesStart =
      !filters?.startDate || p.startDate >= filters.startDate;

    const matchesEnd = !filters?.endDate || p.endDate <= filters.endDate;

    const matchesPhase = !filters?.phase || p.phase === filters.phase;

    return (
      matchesQuery &&
      matchesStart &&
      matchesEnd &&
      matchesPhase
    );
  });
}
