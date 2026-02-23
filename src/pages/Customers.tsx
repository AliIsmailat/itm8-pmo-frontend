import React, { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import CustomerActions from "../components/customers/CustomerActions";
import CustomerList from "../components/customers/CustomerList";
import type { Customer } from "../components/customers/CustomerList";
import { projects } from "../dummyProjects";

const customerMap: Record<number, Customer> = {};

projects.forEach((p) => {
  const isOngoing = p.phase === "Planering" || p.phase === "Pågående";
  if (p.customerId != null) {
    if (!customerMap[p.customerId]) {
      customerMap[p.customerId] = {
        id: p.customerId,
        name: p.customer,
        ongoingProjects: isOngoing ? 1 : 0,
      };
    } else {
      customerMap[p.customerId].ongoingProjects += isOngoing ? 1 : 0;
    }
  }
});

const dummyCustomers: Customer[] = Object.values(customerMap);

const Customers: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredCustomers = dummyCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Kunder"
        description="Hantera kunder och deras projekt..."
      />

      <CustomerActions
        onAdd={() => alert("Lägg till kund")}
        onSearch={setSearch}
      />

      <CustomerList customers={filteredCustomers} />
    </div>
  );
};

export default Customers;
