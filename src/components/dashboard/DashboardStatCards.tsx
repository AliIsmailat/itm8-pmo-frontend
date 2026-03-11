import React from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, Users, Building2, TrendingUp } from "lucide-react";

interface Props {
  activeProjectCount: number;
  resourceCount: number;
  clientCount: number;
  overtimeCount: number;
}

const DashboardStatCards: React.FC<Props> = ({
  activeProjectCount,
  resourceCount,
  clientCount,
  overtimeCount,
}) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Pågående projekt",
      value: activeProjectCount,
      icon: FolderOpen,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      valueColor: "text-gray-900",
      href: "/projects",
    },
    {
      label: "Totala resurser",
      value: resourceCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      valueColor: "text-gray-900",
      href: "/resources",
    },
    {
      label: "Totala kunder",
      value: clientCount,
      icon: Building2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      valueColor: "text-gray-900",
      href: "/customers",
    },
    {
      label: "Projekt över budget",
      value: overtimeCount,
      icon: TrendingUp,
      color: overtimeCount > 0 ? "text-red-600" : "text-gray-400",
      bg: overtimeCount > 0 ? "bg-red-50" : "bg-gray-50",
      border: overtimeCount > 0 ? "border-red-200" : "border-gray-100",
      valueColor: overtimeCount > 0 ? "text-red-600" : "text-gray-900",
      href: "/projects?overtime=true",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(
        ({ label, value, icon: Icon, color, bg, border, valueColor, href }) => (
          <button
            key={label}
            onClick={() => navigate(href)}
            className={`group bg-white border ${border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-3 ${
              label === "Projekt över budget" && overtimeCount > 0
                ? "ring-1 ring-red-200"
                : ""
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div
                className={`text-3xl font-bold tracking-tight ${valueColor}`}
              >
                {value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 font-medium">
                {label}
              </div>
            </div>
          </button>
        ),
      )}
    </div>
  );
};

export default DashboardStatCards;
