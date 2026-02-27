import React, { useState } from "react";
import ProjectActions from "./ProjectActions";
import { filterProjects } from "./projectFilters";
import type { ProjectFilterState } from "./projectFilters";
import GridView from "./GridView";
import TableView from "./TableView";

export interface Project {
  id: number;
  name: string;
  customer: string;
  customerId: number;
  startDate: string;
  endDate: string;
  budgetHours: number;
  usedHours: number;
  resources: string[];
  phase: string;
}

interface ProjectTableProps {
  projects: Project[];
  onSelect?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ProjectFilterState>({});
  const [view, setView] = useState<"table" | "grid">("table");

  const filteredProjects = filterProjects(projects, query, filters);

  return (
    <div>
      <ProjectActions
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFilterChange={setFilters}
        view={view}
        onViewChange={setView}
      />

      {view === "table" ? (
        <TableView
          projects={filteredProjects}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <GridView projects={filteredProjects} />
      )}
    </div>
  );
};

export default ProjectTable;
