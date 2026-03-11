import React, { useState } from "react";
import ProjectActions from "./ProjectActions";
import { filterProjects } from "./projectFilters";
import type { ProjectFilterState } from "./projectFilters";
import GridView from "./GridView";
import TableView from "./TableView";
import type { Project } from "../../utils/projects";
import { Folder } from "lucide-react";
import Pagination from "../ui/Pagination";
import { usePagination } from "../../hooks/usePagination";

export type { Project };

const PAGE_SIZE = 10;

interface ProjectTableProps {
  projects: Project[];
  onSelect?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onAdd?: () => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onSelect,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ProjectFilterState>({});
  const [view, setView] = useState<"table" | "grid">("table");

  const filteredProjects = filterProjects(projects, query, filters);
  const { currentPage, totalPages, paginated, setCurrentPage } = usePagination(
    filteredProjects,
    PAGE_SIZE,
  );

  return (
    <div>
      <ProjectActions
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setCurrentPage(1);
        }}
        filters={filters}
        onFilterChange={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        view={view}
        onViewChange={setView}
        onAdd={onAdd}
      />

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Folder className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">
            {projects.length === 0 ? "Inga projekt ännu" : "Inga träffar"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {projects.length === 0
              ? "Skapa ditt första projekt för att komma igång"
              : "Prova att ändra sökning eller filter"}
          </p>
        </div>
      ) : view === "table" ? (
        <>
          <TableView
            projects={paginated}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <>
          <GridView projects={paginated} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default ProjectTable;
