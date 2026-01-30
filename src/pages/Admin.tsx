import React from "react";
import PageHeader from "../components/PageHeader";

const Admin: React.FC = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Administration"
        description="Hantera användare, resurser och projekt..."
      />
    </div>
  );
};

export default Admin;
