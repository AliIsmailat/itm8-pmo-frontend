import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import type { Project } from "../../utils/projects";

interface Props {
  projects: Project[];
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("sv-SE", { month: "short", day: "numeric" });

const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const DashboardEndingSoon: React.FC<Props> = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <h2 className="text-sm font-semibold text-gray-800">
            Projekt som slutar snart
          </h2>
          {projects.length > 0 && (
            <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full">
              {projects.length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/projects")}
          className="text-xs text-gray-400 hover:text-purple-600 flex items-center gap-1 transition"
        >
          Visa alla <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="w-8 h-8 text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">
            Inga projekt slutar inom 30 dagar
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {projects.slice(0, 5).map((p) => {
            const days = daysUntil(p.endDate);
            const urgent = days <= 7;
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition text-left group"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-600 transition">
                    {p.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {p.client?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-gray-400">
                    {fmt(p.endDate)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-lg ${
                      urgent
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-orange-50 text-orange-600 border border-orange-100"
                    }`}
                  >
                    {days}d kvar
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardEndingSoon;
