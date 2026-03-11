import React, { useState, useCallback } from "react";
import PageHeader from "../components/ui/PageHeader";
import CustomerActions from "../components/customers/CustomerActions";
import type { CustomerFilterState } from "../components/customers/CustomerActions";
import CustomerActionsContainer from "../components/customers/CustomerActionsContainer";
import CustomerListContainer from "../components/customers/CustomerListContainer";
import type { Customer } from "../components/customers/CustomerList";

const Customers: React.FC = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<CustomerFilterState>({});
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
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
        title="Kunder"
        description="Hantera kunder och deras projekt..."
      />

      <CustomerActions
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFilterChange={setFilters}
        onAdd={() => setCreateOpen(true)}
        totalCount={totalCount}
        filteredCount={filteredCount}
        pageCount={pageCount}
      />

      <CustomerActionsContainer
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onClientCreated={() => {
          setCreateOpen(false);
          refetch();
        }}
        onClientUpdated={refetch}
        editingCustomer={editingCustomer}
        onEditClose={() => setEditingCustomer(null)}
      />

      <CustomerListContainer
        query={query}
        filters={filters}
        refetchTrigger={refetchTrigger}
        onEdit={(c) => setEditingCustomer(c)}
        onCountsChange={handleCountsChange}
      />
    </div>
  );
};

export default Customers;
