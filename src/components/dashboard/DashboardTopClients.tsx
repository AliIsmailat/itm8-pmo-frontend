import React from "react";
import { useNavigate } from "react-router-dom";
import { Handshake, ChevronRight, Building2 } from "lucide-react";

export interface ClientActivity {
  id: number;
  name: string;
  projectCount: number;
}

interface Props {
  clients: ClientActivity[];
}

const DashboardTopClients: React.FC<Props> = ({ clients }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Handshake className="w-4 h-4 text-green-500" />
          <h2 className="text-sm font-semibold text-gray-800">
            Kunder med flest projekt
          </h2>
        </div>
        <button
          onClick={() => navigate("/customers")}
          className="text-xs text-gray-400 hover:text-purple-600 flex items-center gap-1 transition"
        >
          Visa alla <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="w-8 h-8 text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">Inga kunder med projekt ännu</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {clients.map((c, i) => {
            const initials = c.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            const barWidth = Math.round(
              (c.projectCount / (clients[0]?.projectCount || 1)) * 100,
            );
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/projects?customerId=${c.id}`)}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition text-left group"
              >
                <span className="text-xs text-gray-300 font-mono w-4">
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-600 transition">
                      {c.name}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {c.projectCount} projekt
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardTopClients;
