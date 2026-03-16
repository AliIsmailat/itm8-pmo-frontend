import React from "react";
import { Search } from "lucide-react";
import type { EntityType, PendingDeletion } from "../../utils/deletions";
import { ENTITY_CONFIG } from "./archiveUtils";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: EntityType | "All";
  onFilterChange: (filter: EntityType | "All") => void;
  deletions: PendingDeletion[];
}

const ArchiveFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  deletions,
}) => {
  const availableTypes = Array.from(
    new Set(deletions.map((d) => d.entityType)),
  ) as EntityType[];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Sök efter namn eller typ..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onFilterChange("All")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            activeFilter === "All"
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
          }`}
        >
          Alla ({deletions.length})
        </button>
        {availableTypes.map((type) => {
          const config = ENTITY_CONFIG[type];
          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                activeFilter === type
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
              }`}
            >
              {config?.label ?? type} (
              {deletions.filter((d) => d.entityType === type).length})
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ArchiveFilters;
