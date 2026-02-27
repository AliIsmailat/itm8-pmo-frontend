import React, { useEffect, useState, useCallback } from "react";
import CustomerList from "./CustomerList";
import type { Customer } from "./CustomerList";
import { getClients, getContactPersonByClientId } from "../../utils/clients";
import type { Client } from "../../utils/clients";

interface Props {
  search?: string;
  refetchTrigger?: number;
}

const CustomerListContainer: React.FC<Props> = ({
  search = "",
  refetchTrigger = 0,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data: Client[] = await getClients();

      // Fetcha kontaktperson för varje kund parallellt
      const normalized: Customer[] = await Promise.all(
        data.map(async (c) => {
          const contact = await getContactPersonByClientId(c.id);
          return {
            id: c.id,
            name: c.name,
            address: c.address,
            phoneNumber: c.phoneNumber,
            email: c.email,
            ongoingProjects: c.ongoingProjects ?? 0,
            contactName: contact?.name ?? "",
            contactEmail: contact?.email ?? "",
            contactPhone: contact?.phoneNumber ?? "",
          };
        }),
      );

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

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div>Loading...</div>;

  return <CustomerList customers={filteredCustomers} />;
};

export default CustomerListContainer;
