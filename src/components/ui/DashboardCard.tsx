import React from "react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-lg w-[36rem] relative">
      {icon && <div className="absolute top-8 left-14">{icon}</div>}

      <div className="flex flex-col items-center gap-8 mt-6">
        <span className="text-xl font-medium">{title}</span>
        <span className="text-4xl font-bold">{value}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
