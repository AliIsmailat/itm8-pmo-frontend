import React, { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import CustomerActionsContainer from "../components/customers/CustomerActionsContainer";
import CustomerListContainer from "../components/customers/CustomerListContainer";

const Customers: React.FC = () => {
  const [search, setSearch] = useState("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleClientCreated = () => {
    // Öka räknaren → CustomerListContainer reagerar och fetchar om
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Kunder"
        description="Hantera kunder och deras projekt..."
      />

      <CustomerActionsContainer onClientCreated={handleClientCreated} />

      <CustomerListContainer search={search} refetchTrigger={refetchTrigger} />
    </div>
  );
};

export default Customers;
