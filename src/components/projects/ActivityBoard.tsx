import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Clock,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { Activity, ActivityStatus } from "../../utils/activities";
import { deleteActivity } from "../../utils/activities";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

const COLUMNS: {
  status: ActivityStatus;
  label: string;
  color: string;
  dot: string;
  bg: string;
}[] = [
  {
    status: "NotStarted",
    label: "Ej påbörjad",
    color: "text-gray-600",
    dot: "bg-gray-400",
    bg: "bg-gray-50",
  },
  {
    status: "InProgress",
    label: "Pågående",
    color: "text-blue-700",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
  },
  {
    status: "OnHold",
    label: "Pausad",
    color: "text-yellow-700",
    dot: "bg-yellow-400",
    bg: "bg-yellow-50",
  },
  {
    status: "Completed",
    label: "Avslutad",
    color: "text-green-700",
    dot: "bg-green-500",
    bg: "bg-green-50",
  },
  {
    status: "Cancelled",
    label: "Avbruten",
    color: "text-red-600",
    dot: "bg-red-400",
    bg: "bg-red-50",
  },
];

interface Props {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

const fmt = (d: string) => new Date(d).toLocaleDateString("sv-SE");

const ActivityBoard: React.FC<Props> = ({
  activities: initialActivities,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showEmpty, setShowEmpty] = useState(false);

  React.useEffect(() => {
    setActivities(initialActivities);
  }, [initialActivities]);

  const handleDelete = async (id: number) => {
    setConfirmId(null);
    setActivities((prev) => prev.filter((a) => a.id !== id));
    onDelete(id);
    try {
      await deleteActivity(id);
    } catch (err) {
      console.error("Failed to delete activity:", err);
      onRefresh();
    }
  };

  const toggleCollapse = (status: string) =>
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));

  const emptyCount = COLUMNS.filter(
    (col) => activities.filter((a) => a.status === col.status).length === 0,
  ).length;

  return (
    <>
      {emptyCount > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={() => setShowEmpty((v) => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition"
          >
            {showEmpty ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            {showEmpty
              ? "Dölj tomma kolumner"
              : `Visa ${emptyCount} tomma kolumner`}
          </button>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const cards = activities.filter((a) => a.status === col.status);
          const isCollapsed = collapsed[col.status];
          const isHidden = cards.length === 0 && !showEmpty;

          return (
            <div
              key={col.status}
              className="flex-shrink-0 transition-all duration-500 ease-in-out"
              style={{
                width: isHidden ? "0px" : isCollapsed ? "160px" : "220px",
                opacity: isHidden ? 0 : 1,
                marginRight: isHidden ? "-16px" : "0px",
                pointerEvents: isHidden ? "none" : "auto",
              }}
            >
              <div
                className="flex flex-col gap-3 overflow-hidden"
                style={{ width: isCollapsed ? "160px" : "220px" }}
              >
                <button
                  onClick={() => toggleCollapse(col.status)}
                  className="flex items-center justify-between px-1 w-full hover:opacity-70 transition"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? (
                      <ChevronRight className={`w-3.5 h-3.5 ${col.color}`} />
                    ) : (
                      <ChevronDown className={`w-3.5 h-3.5 ${col.color}`} />
                    )}
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`}
                    />
                    <span className={`text-xs font-semibold ${col.color}`}>
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {cards.length}
                  </span>
                </button>

                <div
                  className="flex flex-col gap-2 transition-all duration-300 ease-in-out scrollbar-thin"
                  style={{
                    maxHeight: isCollapsed ? "0px" : "424px",
                    opacity: isCollapsed ? 0 : 1,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#e5e7eb transparent",
                  }}
                >
                  {cards.length === 0 && (
                    <div
                      className={`rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-xs text-gray-300 ${col.bg}`}
                    >
                      Inga aktiviteter
                    </div>
                  )}
                  {cards.map((a) => (
                    <div
                      key={a.id}
                      className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-800 leading-tight">
                          {a.name}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => onEdit(a)}
                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-purple-600 transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmId(a.id)}
                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {fmt(a.startDate)} → {fmt(a.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{a.totalHours}h</span>
                      </div>

                      {a.resources.length > 0 && (
                        <div className="flex items-center gap-1 pt-0.5">
                          <div className="flex -space-x-1.5">
                            {a.resources.slice(0, 4).map((r) => (
                              <div
                                key={r.id}
                                title={r.name}
                                className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white"
                              >
                                {r.name[0].toUpperCase()}
                              </div>
                            ))}
                            {a.resources.length > 4 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-[10px] flex items-center justify-center border-2 border-white">
                                +{a.resources.length - 4}
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 ml-1">
                            {a.resources
                              .slice(0, 2)
                              .map((r) => r.name.split(" ")[0])
                              .join(", ")}
                            {a.resources.length > 2 &&
                              ` +${a.resources.length - 2}`}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DeleteConfirmModal
        isOpen={confirmId !== null}
        entityName={activities.find((a) => a.id === confirmId)?.name}
        onConfirm={() => confirmId !== null && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
};

export default ActivityBoard;
