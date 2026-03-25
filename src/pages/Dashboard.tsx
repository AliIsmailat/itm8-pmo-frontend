import React from "react";
import PageHeader from "../components/ui/PageHeader";
import DashboardContainer from "../components/dashboard/DashboardContainer";

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
      <PageHeader
        title="Översikt"
        description="Översikt över alla projekt och resursfördelningar..."
      />
      <DashboardContainer />
    </div>
  );
};

export default Dashboard;
