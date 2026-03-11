import React from "react";
import PageHeader from "../components/ui/PageHeader";
import ArchiveContainer from "../components/archive/ArchiveContainer";

const Archive: React.FC = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Arkiv"
        description="Objekt schemalagda för borttagning. Återställ dem innan tidsgränsen löper ut."
      />
      <ArchiveContainer />
    </div>
  );
};

export default Archive;
