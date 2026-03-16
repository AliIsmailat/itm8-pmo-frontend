import React, { useState, useCallback } from "react";
import PageHeader from "../components/ui/PageHeader";
import ResourceActions from "../components/resources/ResourceActions";
import type { ResourceFilterState } from "../components/resources/ResourceActions";
import ResourceActionsContainer from "../components/resources/ResourceActionsContainer";
import ResourceListContainer from "../components/resources/ResourceListContainer";
import type { ResourceItem } from "../components/resources/ResourceList";

const Resources: React.FC = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ResourceFilterState>({});
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(
    null,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [filteredCount, setFilteredCount] = useState<number | undefined>(
    undefined,
  );
  const [pageCount, setPageCount] = useState<number | undefined>(undefined);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  const handleCountsChange = useCallback(
    (total: number, filtered: number, page: number) => {
      setTotalCount(total);
      setFilteredCount(filtered);
      setPageCount(page);
    },
    [],
  );

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Resurser"
        description="Hantera teammedlemmar och deras tilldelning..."
      />

      <ResourceActions
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFilterChange={setFilters}
        onAdd={() => setCreateOpen(true)}
        totalCount={totalCount}
        filteredCount={filteredCount}
        pageCount={pageCount}
      />

      <ResourceActionsContainer
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onResourceCreated={() => {
          setCreateOpen(false);
          refetch();
        }}
        onResourceUpdated={refetch}
        editingResource={editingResource}
        onEditClose={() => setEditingResource(null)}
      />

      <ResourceListContainer
        query={query}
        filters={filters}
        refetchTrigger={refetchTrigger}
        onEdit={(r) => setEditingResource(r)}
        onCountsChange={handleCountsChange}
      />
    </div>
  );
};

export default Resources;
