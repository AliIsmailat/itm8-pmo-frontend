import React from "react";
import { Search, Plus, X } from "lucide-react";
import type { ProjectFilterState } from "./projectFilters";
import ViewSwitch from "./ViewSwitch";

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  filters: ProjectFilterState;
  onFilterChange: (f: ProjectFilterState) => void;
  onAdd?: () => void;
  view: "table" | "grid";
  onViewChange: (v: "table" | "grid") => void;
}

const ProjectActions: React.FC<Props> = ({
  query,
  onQueryChange,
  filters,
  onFilterChange,
  onAdd,
  view,
  onViewChange,
}) => {
  const hasFilters = query || filters.startDate || filters.endDate;

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Sök projekt, kund eller resurs..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, startDate: e.target.value })
          }
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition"
        />
        <span className="text-gray-300 text-sm">–</span>
        <input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, endDate: e.target.value })
          }
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition"
        />

        {hasFilters && (
          <button
            onClick={() => {
              onQueryChange("");
              onFilterChange({});
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <X className="w-3.5 h-3.5" />
            Rensa
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ViewSwitch view={view} onChange={onViewChange} />
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Lägg till projekt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectActions;
