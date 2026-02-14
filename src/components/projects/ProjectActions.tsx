import React from "react";
import { Search, Plus } from "lucide-react";
import type { ProjectFilterState } from "./projectFilters";

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  filters: ProjectFilterState;
  onFilterChange: (f: ProjectFilterState) => void;
  onAdd?: () => void;
}

const ProjectActions: React.FC<Props> = ({
  query,
  onQueryChange,
  filters,
  onFilterChange,
  onAdd,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center justify-start gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Sök projekt, kund eller resurs..."
            className="border border-gray-300 rounded-lg p-2 pl-10 w-[28rem] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={onAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          Lägg till projekt
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, startDate: e.target.value })
          }
          className="border rounded p-1"
        />
        <input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, endDate: e.target.value })
          }
          className="border rounded p-1"
        />

        <select
          value={filters.phase || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, phase: e.target.value || undefined })
          }
          className="border rounded p-1"
        >
          <option value="">Alla faser</option>
          <option value="Planering">Planering</option>
          <option value="Pågående">Pågående</option>
          <option value="Avslutat">Avslutat</option>
        </select>
        <button
          onClick={() => {
            onQueryChange("");
            onFilterChange({});
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg"
        >
          Rensa filter
        </button>
      </div>
    </div>
  );
};

export default ProjectActions;
