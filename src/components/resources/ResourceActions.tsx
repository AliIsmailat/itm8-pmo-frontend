import React from "react";
import { Search, Plus, X } from "lucide-react";

export interface ResourceFilterState {
  clLevel?: string;
}

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  filters: ResourceFilterState;
  onFilterChange: (f: ResourceFilterState) => void;
  onAdd?: () => void;
  totalCount?: number;
  filteredCount?: number;
  pageCount?: number;
}

const CL_LEVELS = ["CL1", "CL2", "CL3", "CL4", "CL5"];

const ResourceActions: React.FC<Props> = ({
  query,
  onQueryChange,
  filters,
  onFilterChange,
  onAdd,
  totalCount,
  filteredCount,
  pageCount,
}) => {
  const hasFilters = query || filters.clLevel;

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Sök efter namn eller ort..."
          className="w-1/2 pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-sm px-1 py-1">
          <button
            onClick={() => onFilterChange({ ...filters, clLevel: undefined })}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              !filters.clLevel
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Alla
          </button>
          {CL_LEVELS.map((cl) => (
            <button
              key={cl}
              onClick={() => onFilterChange({ ...filters, clLevel: cl })}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                filters.clLevel === cl
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cl}
            </button>
          ))}
        </div>

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

        <button
          onClick={onAdd}
          className="ml-auto flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Lägg till resurs
        </button>
      </div>

      {totalCount !== undefined &&
        filteredCount !== undefined &&
        pageCount !== undefined && (
          <p className="text-sm text-gray-500">
            Visar{" "}
            <span className="font-semibold text-gray-700">{pageCount}</span> av{" "}
            <span className="font-semibold text-gray-700">{totalCount}</span>{" "}
            resurser
          </p>
        )}
    </div>
  );
};

export default ResourceActions;
