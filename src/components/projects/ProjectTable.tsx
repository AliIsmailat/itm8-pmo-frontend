import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import ProjectActions from "./ProjectActions";
import { filterProjects } from "./projectFilters";
import type { ProjectFilterState } from "./projectFilters";

export interface Project {
  id: number;
  name: string;
  customer: string;
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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ProjectFilterState>({});

  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenuId !== null &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId]!.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const filteredProjects = filterProjects(projects, query, filters);

  return (
    <div>
      <ProjectActions
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm text-gray-600">
              <th className="p-4 font-bold">Kund</th>
              <th className="p-4">Projekt ({filteredProjects.length})</th>{" "}
              <th className="p-4">Start</th>
              <th className="p-4">Slut</th>
              <th className="p-4">Resurser</th>
              <th className="p-4">Budget (h)</th>
              <th className="p-4">Förbrukade (h)</th>
              <th className="p-4 text-center w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelect?.(p)}
                className="border-t text-sm hover:bg-purple-50 cursor-pointer transition"
              >
                <td className="p-4 font-medium">{p.customer}</td>
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.startDate}</td>
                <td className="p-4">{p.endDate}</td>
                <td className="p-4">
                  <div className="flex -space-x-2">
                    {p.resources.slice(0, 3).map((r) => (
                      <div
                        key={r}
                        className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center border-2 border-white"
                        title={r}
                      >
                        {r[0]}
                      </div>
                    ))}

                    {p.resources.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-gray-300 text-gray-700 text-lg flex items-center justify-center border-2 border-white">
                        …
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-4">{p.budgetHours}</td>
                <td className="p-4">{p.usedHours}</td>
                <td className="p-4 text-center relative">
                  <div
                    ref={(el) => {
                      menuRefs.current[p.id] = el;
                    }}
                    className="inline-block"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === p.id ? null : p.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 transition"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {openMenuId === p.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-20">
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit?.(p);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Redigera
                        </button>
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            onDelete?.(p);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        >
                          Ta bort
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
