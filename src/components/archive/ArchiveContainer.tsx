import React, { useEffect, useState, useCallback } from "react";
import { RotateCcw, RefreshCw } from "lucide-react";
import { getPendingDeletions, cancelDeletion } from "../../utils/deletions";
import type { PendingDeletion, EntityType } from "../../utils/deletions";
import ArchiveFilters from "./ArchiveFilters";
import ArchiveGroup from "./ArchiveGroup";

const ArchiveContainer: React.FC = () => {
  const [deletions, setDeletions] = useState<PendingDeletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<EntityType | "All">("All");

  const load = useCallback(() => {
    setLoading(true);
    getPendingDeletions()
      .then(setDeletions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const handleRestore = async (deletion: PendingDeletion) => {
    setRestoringId(deletion.id);
    try {
      await cancelDeletion(deletion.id);
      setDeletions((prev) => prev.filter((d) => d.id !== deletion.id));
    } catch (err) {
      console.error("Failed to restore:", err);
      alert("Kunde inte återställa. Kolla konsolen.");
    } finally {
      setRestoringId(null);
    }
  };

  const filtered = deletions.filter((d) => {
    const matchesType = activeFilter === "All" || d.entityType === activeFilter;
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      !search ||
      (d.entityName ?? "").toLowerCase().includes(searchTerm) ||
      d.entityType.toLowerCase().includes(searchTerm) ||
      String(d.entityId).includes(searchTerm);
    return matchesType && matchesSearch;
  });

  const grouped = filtered.reduce<Record<string, PendingDeletion[]>>(
    (acc, d) => {
      if (!acc[d.entityType]) acc[d.entityType] = [];
      acc[d.entityType].push(d);
      return acc;
    },
    {},
  );

  const entityTypes = Object.keys(grouped) as EntityType[];

  if (loading)
    return <div className="text-gray-400 text-sm">Laddar arkiv...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <ArchiveFilters
          search={search}
          onSearchChange={(v) => setSearch(v)}
          activeFilter={activeFilter}
          onFilterChange={(f) => setActiveFilter(f)}
          deletions={deletions}
        />
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition self-start"
        >
          <RefreshCw className="w-4 h-4" />
          Uppdatera
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <RotateCcw className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">
            {deletions.length === 0 ? "Arkivet är tomt" : "Inga träffar"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {deletions.length === 0
              ? "Inga objekt väntar på borttagning"
              : "Prova att ändra sökning eller filter"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {entityTypes.map((entityType) => (
            <ArchiveGroup
              key={entityType}
              entityType={entityType}
              items={grouped[entityType]}
              restoringId={restoringId}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveContainer;
