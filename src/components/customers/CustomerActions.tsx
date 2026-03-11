import React from "react";
import { Search, Plus, X } from "lucide-react";

export interface CustomerFilterState {
  hasProjects?: "yes" | "no";
}

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  filters: CustomerFilterState;
  onFilterChange: (f: CustomerFilterState) => void;
  onAdd?: () => void;
  totalCount?: number;
  filteredCount?: number;
  pageCount?: number;
}

const CustomerActions: React.FC<Props> = ({
  query,
  onQueryChange,
  filters,
  onFilterChange,
  onAdd,
  totalCount,
  filteredCount,
  pageCount,
}) => {
  const hasFilters = query || filters.hasProjects;

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Sök efter kund..."
          className="w-1/2 pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-sm px-1 py-1">
          {[
            { label: "Alla", value: undefined },
            { label: "Med projekt", value: "yes" as const },
            { label: "Utan projekt", value: "no" as const },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => onFilterChange({ ...filters, hasProjects: value })}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                filters.hasProjects === value
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
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
          Lägg till kund
        </button>
      </div>

      {totalCount !== undefined &&
        filteredCount !== undefined &&
        pageCount !== undefined && (
          <p className="text-sm text-gray-500">
            Visar{" "}
            <span className="font-semibold text-gray-700">{pageCount}</span> av{" "}
            <span className="font-semibold text-gray-700">{totalCount}</span>{" "}
            kunder
          </p>
        )}
    </div>
  );
};

export default CustomerActions;
