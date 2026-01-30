import React from "react";
import DashboardCard from "../components/DashboardCard";
import PageHeader from "../components/PageHeader";
import { Users, Folders, History, TriangleAlert } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Översikt"
        description="Översikt över alla projekt och resursfördelningar..."
      />

      <div className="flex flex-wrap justify-center gap-4">
        <DashboardCard
          title="Slutar inom 30 dagar"
          value={2}
          icon={<History size={40} className="text-purple-800" />}
        />
        <DashboardCard
          title="Totala resurser"
          value={10}
          icon={<Users size={40} className="text-purple-800" />}
        />
        <DashboardCard
          title="Pågående projekt"
          value={3}
          icon={<Folders size={40} className="text-purple-800" />}
        />
        <DashboardCard
          title="Överallokerade resurser"
          value={1}
          icon={<TriangleAlert size={40} className="text-purple-800" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
