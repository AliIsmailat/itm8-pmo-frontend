import React, { useEffect, useState, useCallback } from "react";
import CustomerList from "./CustomerList";
import type { Customer } from "./CustomerList";
import { getClients, deleteClient } from "../../utils/clients";
import type { Client } from "../../utils/clients";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";
import type { CustomerFilterState } from "./CustomerActions";
import LoadingSpinner from "../ui/LoadingSpinner";
import Pagination from "../ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { Handshake } from "lucide-react";

const PAGE_SIZE = 9;

interface Props {
  query?: string;
  filters?: CustomerFilterState;
  refetchTrigger?: number;
  onEdit: (customer: Customer) => void;
  onCountsChange?: (total: number, filtered: number, page: number) => void;
}

const CustomerListContainer: React.FC<Props> = ({
  query = "",
  filters = {},
  refetchTrigger = 0,
  onEdit,
  onCountsChange,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null,
  );

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const clients = await getClients();
      const normalized: Customer[] = clients.map((c: Client) => ({
        id: c.id,
        name: c.name,
        address: c.address,
        phoneNumber: c.phoneNumber,
        email: c.email,
        ongoingProjects: c.projectCount ?? 0,
      }));
      setCustomers(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients, refetchTrigger]);

  const handleDelete = async () => {
    if (!deletingCustomer) return;
    setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
    setDeletingCustomer(null);
    try {
      await deleteClient(deletingCustomer.id);
    } catch (err) {
      console.error("Failed to delete client:", err);
      fetchClients();
    }
  };

  const filtered = customers.filter((c) => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
    const matchesProjects =
      !filters.hasProjects ||
      (filters.hasProjects === "yes"
        ? c.ongoingProjects > 0
        : c.ongoingProjects === 0);
    return matchesQuery && matchesProjects;
  });

  const { currentPage, totalPages, paginated, pageCount, setCurrentPage } =
    usePagination(filtered, PAGE_SIZE);

  const onCountsChangeRef = React.useRef(onCountsChange);
  onCountsChangeRef.current = onCountsChange;
  React.useEffect(() => {
    onCountsChangeRef.current?.(customers.length, filtered.length, pageCount);
  }, [customers.length, filtered.length, pageCount]);

  if (loading) return <LoadingSpinner message="Laddar kunder..." />;

  return (
    <>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Handshake className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">
            {customers.length === 0 ? "Inga kunder ännu" : "Inga träffar"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {customers.length === 0
              ? "Lägg till din första kund för att komma igång"
              : "Prova att ändra sökning eller filter"}
          </p>
        </div>
      ) : (
        <>
          <CustomerList
            customers={paginated}
            onEdit={onEdit}
            onDelete={(c) => setDeletingCustomer(c)}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      <DeleteConfirmModal
        isOpen={!!deletingCustomer}
        entityName={deletingCustomer?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCustomer(null)}
      />
    </>
  );
};

export default CustomerListContainer;
