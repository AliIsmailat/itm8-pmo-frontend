import React, { useEffect, useState, useCallback } from "react";
import ResourceList from "./ResourceList";
import type { ResourceItem } from "./ResourceList";
import { getResources, deleteResource } from "../../utils/resources";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";
import type { ResourceFilterState } from "./ResourceActions";
import LoadingSpinner from "../ui/LoadingSpinner";
import Pagination from "../ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { Users } from "lucide-react";

const PAGE_SIZE = 9;

interface Props {
  query?: string;
  filters?: ResourceFilterState;
  refetchTrigger?: number;
  onEdit: (resource: ResourceItem) => void;
  onCountsChange?: (total: number, filtered: number, page: number) => void;
}

const ResourceListContainer: React.FC<Props> = ({
  query = "",
  filters = {},
  refetchTrigger = 0,
  onEdit,
  onCountsChange,
}) => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingResource, setDeletingResource] = useState<ResourceItem | null>(
    null,
  );

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResources();
      const normalized: ResourceItem[] = data.map((r) => ({
        id: r.id,
        name: r.name,
        location: r.location,
        phoneNumber: r.phoneNumber ?? "",
        email: r.email ?? "",
        clLevel: r.clLevel,
        skills: r.skills ?? [],
        ongoingProjects: r.projectCount ?? 0,
      }));
      setResources(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources, refetchTrigger]);

  const handleDelete = async () => {
    if (!deletingResource) return;
    setResources((prev) => prev.filter((r) => r.id !== deletingResource.id));
    setDeletingResource(null);
    try {
      await deleteResource(deletingResource.id);
    } catch (err) {
      console.error("Failed to delete resource:", err);
      fetchResources();
    }
  };

  const filtered = resources.filter((r) => {
    const matchesQuery = `${r.name} ${r.location} ${r.clLevel}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCl = !filters.clLevel || r.clLevel === filters.clLevel;
    return matchesQuery && matchesCl;
  });

  const { currentPage, totalPages, paginated, pageCount, setCurrentPage } =
    usePagination(filtered, PAGE_SIZE);

  const onCountsChangeRef = React.useRef(onCountsChange);
  onCountsChangeRef.current = onCountsChange;
  React.useEffect(() => {
    onCountsChangeRef.current?.(resources.length, filtered.length, pageCount);
  }, [resources.length, filtered.length, pageCount]);

  if (loading) return <LoadingSpinner message="Laddar resurser..." />;

  return (
    <>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">
            {resources.length === 0 ? "Inga resurser ännu" : "Inga träffar"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {resources.length === 0
              ? "Lägg till din första resurs för att komma igång"
              : "Prova att ändra sökning eller filter"}
          </p>
        </div>
      ) : (
        <>
          <ResourceList
            resources={paginated}
            onEdit={onEdit}
            onDelete={(r) => setDeletingResource(r)}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      <DeleteConfirmModal
        isOpen={!!deletingResource}
        entityName={deletingResource?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeletingResource(null)}
      />
    </>
  );
};

export default ResourceListContainer;
