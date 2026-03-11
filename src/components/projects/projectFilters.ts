import type { Project } from "../../utils/projects";

export interface ProjectFilterState {
  startDate?: string;
  endDate?: string;
  status?: string;
}

export function filterProjects(
  projects: Project[],
  query: string,
  filters?: ProjectFilterState,
) {
  const q = query.toLowerCase();

  return projects.filter((p) => {
    const resourceNames = (p.resources ?? []).map((r) => r.name?.toLowerCase() ?? "");

    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.client?.name.toLowerCase().includes(q) ||
      p.projectLeader?.name.toLowerCase().includes(q) ||
      resourceNames.some((r) => r.includes(q));

    const matchesStart =
      !filters?.startDate || p.startDate >= filters.startDate;

    const matchesEnd = !filters?.endDate || p.endDate <= filters.endDate;

    return matchesQuery && matchesStart && matchesEnd;
  });
}