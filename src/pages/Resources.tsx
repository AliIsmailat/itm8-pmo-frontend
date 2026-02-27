import React, { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ResourceActionsContainer from "../components/resources/ResourceActionsContainer";
import ResourceListContainer from "../components/resources/ResourceListContainer";

const Resources: React.FC = () => {
  const [search, setSearch] = useState("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleResourceCreated = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Resurser"
        description="Hantera teammedlemmar och deras tilldelning..."
      />

      <ResourceActionsContainer onResourceCreated={handleResourceCreated} />

      <ResourceListContainer search={search} refetchTrigger={refetchTrigger} />
    </div>
  );
};

export default Resources;
