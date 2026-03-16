import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, Pencil } from "lucide-react";
import type { Activity, ActivityStatus } from "../../utils/activities";
import { deleteActivity } from "../../utils/activities";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

const WEEK_WIDTH = 24;
const ROW_HEIGHT = 40;

const STATUS_CONFIG: Record<
  ActivityStatus,
  { label: string; color: string; bar: string; dot: string }
> = {
  NotStarted: {
    label: "Ej påbörjad",
    color: "text-gray-600",
    bar: "#9ca3af",
    dot: "bg-gray-400",
  },
  InProgress: {
    label: "Pågående",
    color: "text-blue-700",
    bar: "#3b82f6",
    dot: "bg-blue-500",
  },
  OnHold: {
    label: "Pausad",
    color: "text-yellow-700",
    bar: "#f59e0b",
    dot: "bg-yellow-400",
  },
  Completed: {
    label: "Avslutad",
    color: "text-green-700",
    bar: "#22c55e",
    dot: "bg-green-500",
  },
  Cancelled: {
    label: "Avbruten",
    color: "text-red-600",
    bar: "#ef4444",
    dot: "bg-red-400",
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as ActivityStatus[];

function getMonthSpans() {
  return [
    { name: "Jan", span: 4 },
    { name: "Feb", span: 4 },
    { name: "Mar", span: 5 },
    { name: "Apr", span: 4 },
    { name: "Maj", span: 4 },
    { name: "Jun", span: 5 },
    { name: "Jul", span: 4 },
    { name: "Aug", span: 4 },
    { name: "Sep", span: 5 },
    { name: "Okt", span: 4 },
    { name: "Nov", span: 4 },
    { name: "Dec", span: 5 },
  ];
}

function getISOWeek(date: Date): number {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const week1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getUTCDay() + 6) % 7)) /
        7,
    )
  );
}

function getCurrentWeek(): number {
  return getISOWeek(new Date());
}

const fmt = (d: string) => new Date(d).toLocaleDateString("sv-SE");

const TOOLTIP_WIDTH = 240;
const TOOLTIP_HEIGHT = 180;

interface ActivityBarProps {
  activity: Activity;
  weekWidth: number;
  onEdit: (a: Activity) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({
  activity,
  weekWidth,
  onEdit,
}) => {
  const [hover, setHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const startWeek = getISOWeek(new Date(activity.startDate));
  const endWeek = getISOWeek(new Date(activity.endDate));
  const duration = Math.max(1, endWeek - startWeek);
  const left = (startWeek - 1) * weekWidth;
  const width = duration * weekWidth;
  const cfg = STATUS_CONFIG[activity.status];

  const margin = 12;
  const showAbove = mousePos.y - TOOLTIP_HEIGHT - margin > 0;
  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    width: `${TOOLTIP_WIDTH}px`,
    left: Math.min(
      Math.max(mousePos.x - TOOLTIP_WIDTH / 2, 8),
      window.innerWidth - TOOLTIP_WIDTH - 8,
    ),
    ...(showAbove
      ? { bottom: window.innerHeight - mousePos.y + margin }
      : { top: mousePos.y + margin }),
    filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.18))",
    pointerEvents: "none",
  };

  const tooltip = hover ? (
    <div style={tooltipStyle}>
      <div
        className="bg-white rounded-lg text-gray-800 text-xs"
        style={{ border: "1px solid #e5e7eb", overflow: "hidden" }}
      >
        <div
          className="px-3 py-2 flex items-center justify-between"
          style={{ backgroundColor: cfg.bar }}
        >
          <span className="font-semibold text-white text-[13px] truncate">
            {activity.name}
          </span>
          <span
            className="text-white text-[10px] ml-2 px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
          >
            v.{startWeek}–{endWeek}
          </span>
        </div>
        <div className="px-3 py-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={{ backgroundColor: `${cfg.bar}22`, color: cfg.bar }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cfg.bar }}
              />
              {cfg.label}
            </span>
          </div>
          <div className="text-[11px] text-gray-500">
            {fmt(activity.startDate)} → {fmt(activity.endDate)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span>{activity.totalHours}h</span>
            <span>·</span>
            <span>{activity.billable ? "Fakturerbar" : "Ej fakturerbar"}</span>
          </div>
          {activity.resources.length > 0 && (
            <div className="flex items-start gap-1 text-[11px] text-gray-600">
              <span className="text-gray-400 flex-shrink-0">Resurser:</span>
              <span className="font-medium">
                {activity.resources
                  .slice(0, 3)
                  .map((r) => r.name.split(" ")[0])
                  .join(", ")}
                {activity.resources.length > 3 &&
                  ` +${activity.resources.length - 3}`}
              </span>
            </div>
          )}
          <div className="text-[10px] text-gray-400 pt-0.5 border-t border-gray-100 mt-0.5">
            Klicka för att redigera
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        className="absolute h-6 rounded cursor-pointer"
        style={{
          left: `${left}px`,
          top: "8px",
          width: `${width}px`,
          backgroundColor: cfg.bar,
          opacity: 0.85,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        onClick={() => onEdit(activity)}
      />
      {typeof document !== "undefined" && createPortal(tooltip, document.body)}
    </>
  );
};

interface Props {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

const ActivityTimeline: React.FC<Props> = ({
  activities: initialActivities,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<ActivityStatus>>(
    new Set(ALL_STATUSES),
  );

  useEffect(() => {
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

  useEffect(() => {
    if (confirmId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [confirmId]);

  const toggleFilter = (status: ActivityStatus) => {
    setActiveFilters((prev) => {
      // If all are active, isolate just this one
      if (prev.size === ALL_STATUSES.length) {
        return new Set([status]);
      }
      // If only this one is active, reset to all
      if (prev.size === 1 && prev.has(status)) {
        return new Set(ALL_STATUSES);
      }
      // Otherwise add or remove it
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setActiveFilters(new Set(ALL_STATUSES));
  };

  const currentWeek = getCurrentWeek();
  const months = getMonthSpans();
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
  const allActive = activeFilters.size === ALL_STATUSES.length;

  const visibleStatuses = ALL_STATUSES.filter((s) => activeFilters.has(s));

  return (
    <>
      <div className="rounded-xl bg-white shadow text-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b gap-4">
          <h2 className="font-semibold text-base flex-shrink-0">Aktiviteter</h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={toggleAll}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                allActive
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              Alla
            </button>
            {ALL_STATUSES.map((status) => {
              const cfg = STATUS_CONFIG[status];
              const active = activeFilters.has(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleFilter(status)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                    active
                      ? "bg-white border-gray-300 shadow-sm"
                      : "bg-white text-gray-300 border-gray-100"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}
                    style={{ opacity: active ? 1 : 0.3 }}
                  />
                  <span className={active ? cfg.color : "text-gray-300"}>
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* Month header */}
          <div
            className="grid bg-gray-50 border-b"
            style={{ gridTemplateColumns: `160px repeat(52, ${WEEK_WIDTH}px)` }}
          >
            <div className="p-2 font-semibold border-r">Aktivitet</div>
            {months.map((m) => (
              <div
                key={m.name}
                className="text-center border-l font-medium py-2"
                style={{ gridColumn: `span ${m.span}` }}
              >
                {m.name}
              </div>
            ))}
          </div>

          {/* Week header */}
          <div
            className="grid bg-gray-50 border-b"
            style={{ gridTemplateColumns: `160px repeat(52, ${WEEK_WIDTH}px)` }}
          >
            <div className="border-r" />
            {weeks.map((w) => (
              <div
                key={w}
                className={`text-center border-l py-1 text-[13px] ${w === currentWeek ? "bg-purple-200 font-bold" : ""}`}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Grouped activity rows */}
          {visibleStatuses.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const group = activities.filter((a) => a.status === status);
            if (group.length === 0) return null;

            return (
              <React.Fragment key={status}>
                {/* Status group header */}
                <div
                  className="grid border-t"
                  style={{
                    gridTemplateColumns: `160px repeat(52, ${WEEK_WIDTH}px)`,
                  }}
                >
                  <div className="px-3 py-1.5 flex items-center gap-2 bg-gray-50 border-r">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}
                    />
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full ml-auto">
                      {group.length}
                    </span>
                  </div>
                  {weeks.map((w) => (
                    <div
                      key={w}
                      className={`border-l bg-gray-50 ${w === currentWeek ? "bg-purple-50" : ""}`}
                      style={{ height: "28px" }}
                    />
                  ))}
                </div>

                {/* Activity rows in this group */}
                {group.map((activity) => (
                  <div
                    key={activity.id}
                    className="grid relative border-t"
                    style={{
                      gridTemplateColumns: `160px repeat(52, ${WEEK_WIDTH}px)`,
                    }}
                  >
                    <div
                      className="border-r px-3 py-1 flex items-center gap-2"
                      style={{ height: `${ROW_HEIGHT}px` }}
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cfg.bar }}
                      />
                      <div className="text-[13px] border-l pl-2 border-gray-300 font-medium truncate flex-1">
                        {activity.name}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => onEdit(activity)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-purple-600 transition"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setConfirmId(activity.id)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {weeks.map((w) => (
                      <div
                        key={w}
                        className={`border-l ${w === currentWeek ? "bg-purple-50" : w % 2 === 0 ? "bg-gray-50/40" : ""}`}
                        style={{ height: `${ROW_HEIGHT}px` }}
                      />
                    ))}
                    <div
                      className="absolute top-0 bottom-0"
                      style={{ left: "160px", right: 0 }}
                    >
                      <ActivityBar
                        activity={activity}
                        weekWidth={WEEK_WIDTH}
                        onEdit={onEdit}
                      />
                    </div>
                  </div>
                ))}
              </React.Fragment>
            );
          })}

          {activities.filter((a) => activeFilters.has(a.status)).length ===
            0 && (
            <div className="py-10 text-center text-sm text-gray-400">
              Inga aktiviteter matchar filtret
            </div>
          )}
        </div>
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

export default ActivityTimeline;
