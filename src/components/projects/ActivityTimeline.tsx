import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Trash2, Pencil, Check, X } from "lucide-react";
import type { Activity, ActivityStatus } from "../../utils/activities";
import { deleteActivity, updateActivity } from "../../utils/activities";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

const WEEK_WIDTH = 24;
const ROW_HEIGHT = 40;
const HANDLE_WIDTH = 8;

const STATUS_CONFIG: Record<
  ActivityStatus,
  { label: string; color: string; bar: string; dot: string; pending: string }
> = {
  NotStarted: {
    label: "Ej påbörjad",
    color: "text-gray-600",
    bar: "#9ca3af",
    dot: "bg-gray-400",
    pending: "#d1d5db",
  },
  InProgress: {
    label: "Pågående",
    color: "text-blue-700",
    bar: "#3b82f6",
    dot: "bg-blue-500",
    pending: "#93c5fd",
  },
  OnHold: {
    label: "Pausad",
    color: "text-yellow-700",
    bar: "#f59e0b",
    dot: "bg-yellow-400",
    pending: "#fcd34d",
  },
  Completed: {
    label: "Avslutad",
    color: "text-green-700",
    bar: "#22c55e",
    dot: "bg-green-500",
    pending: "#86efac",
  },
  Cancelled: {
    label: "Avbruten",
    color: "text-red-600",
    bar: "#ef4444",
    dot: "bg-red-400",
    pending: "#fca5a5",
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

interface PendingChange {
  activityId: number;
  startDate: string;
  endDate: string;
  startWeek: number;
  duration: number;
}

type DragMode = "move" | "resize-left" | "resize-right";

interface DragState {
  activityId: number;
  mode: DragMode;
  startX: number;
  originalStartWeek: number;
  originalDuration: number;
  originalStartDate: string;
  originalEndDate: string;
}

interface ActivityVisual {
  startWeek: number;
  duration: number;
}

interface ActivityBarProps {
  activity: Activity;
  weekWidth: number;
  isPending: boolean;
  isDragging: boolean;
  visual: ActivityVisual;
  onEdit: (a: Activity) => void;
  onDragStart: (mode: DragMode, clientX: number) => void;
  hasDragged: React.MutableRefObject<boolean>;
}

// CODE REVIEW: ActivityBar bör flyttas till egen komponent

const ActivityBar: React.FC<ActivityBarProps> = ({
  activity,
  weekWidth,
  isPending,
  isDragging,
  visual,
  onEdit,
  onDragStart,
  hasDragged,
}) => {
  const [hover, setHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const startWeek = visual.startWeek;
  const duration = visual.duration;
  const endWeek = startWeek + duration - 1;
  const left = (startWeek - 1) * weekWidth;
  const width = duration * weekWidth;
  const cfg = STATUS_CONFIG[activity.status];
  const barColor = isPending ? cfg.pending : cfg.bar;

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

  const tooltip =
    hover && !isDragging ? (
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
              <span>
                {activity.billable ? "Fakturerbar" : "Ej fakturerbar"}
              </span>
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
        className="absolute h-6"
        style={{
          left: `${left}px`,
          top: "8px",
          width: `${width}px`,
          opacity: isDragging ? 0.6 : 1,
          transition: isDragging ? "none" : "opacity 0.1s",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <div
          className="absolute top-0 bottom-0 z-10 rounded-l transition-colors"
          style={{
            left: 0,
            width: `${HANDLE_WIDTH}px`,
            cursor: "col-resize",
            backgroundColor: hover ? "rgba(255,255,255,0.35)" : "transparent",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDragStart("resize-left", e.clientX);
          }}
        />
        <div
          className="absolute top-0 bottom-0 z-10 rounded-r transition-colors"
          style={{
            right: 0,
            width: `${HANDLE_WIDTH}px`,
            cursor: "col-resize",
            backgroundColor: hover ? "rgba(255,255,255,0.35)" : "transparent",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDragStart("resize-right", e.clientX);
          }}
        />
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: `${HANDLE_WIDTH}px`,
            right: `${HANDLE_WIDTH}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDragStart("move", e.clientX);
          }}
          onClick={() => {
            if (!hasDragged.current) onEdit(activity);
          }}
        />
        <div className="relative h-full w-full pointer-events-none">
          <div
            className="absolute h-full rounded left-0 top-0 transition-colors"
            style={{ width: `${width}px`, backgroundColor: barColor }}
          />
        </div>
      </div>
      {typeof document !== "undefined" && createPortal(tooltip, document.body)}
    </>
  );
};

interface Props {
  activities: Activity[];
  projectEndDate: string;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

const ActivityTimeline: React.FC<Props> = ({
  activities: initialActivities,
  projectEndDate,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<ActivityStatus>>(
    new Set(ALL_STATUSES),
  );
  const [pendingChanges, setPendingChanges] = useState<
    Record<number, PendingChange>
  >({});
  const [savingPending, setSavingPending] = useState(false);
  const [yearClampWarning, setYearClampWarning] = useState(false);
  const [projectEndWarning, setProjectEndWarning] = useState(false);
  const [visualOverrides, setVisualOverrides] = useState<
    Record<number, ActivityVisual>
  >({});
  const visualOverridesRef = useRef<Record<number, ActivityVisual>>({});
  const dragRef = useRef<DragState | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const hasDraggedRef = useRef(false);

  const projectEndWeek = getISOWeek(new Date(projectEndDate));

  useEffect(() => {
    setActivities(initialActivities);
  }, [initialActivities]);

  const getVisual = (activity: Activity): ActivityVisual => {
    if (visualOverrides[activity.id]) return visualOverrides[activity.id];
    if (pendingChanges[activity.id]) {
      return {
        startWeek: pendingChanges[activity.id].startWeek,
        duration: pendingChanges[activity.id].duration,
      };
    }
    const startWeek = getISOWeek(new Date(activity.startDate));
    const endWeek = getISOWeek(new Date(activity.endDate));
    return { startWeek, duration: Math.max(1, endWeek - startWeek) };
  };

  const handleDragStart = useCallback(
    (activity: Activity, mode: DragMode, clientX: number) => {
      const pending = pendingChanges[activity.id];
      const startWeek =
        pending?.startWeek ?? getISOWeek(new Date(activity.startDate));
      const endWeek = pending
        ? pending.startWeek + pending.duration
        : getISOWeek(new Date(activity.endDate));
      const duration = Math.max(1, endWeek - startWeek);

      dragRef.current = {
        activityId: activity.id,
        mode,
        startX: clientX,
        originalStartWeek: startWeek,
        originalDuration: duration,
        originalStartDate: pending?.startDate ?? activity.startDate,
        originalEndDate: pending?.endDate ?? activity.endDate,
      };
      hasDraggedRef.current = false;
      setDraggingId(activity.id);
      setYearClampWarning(false);
      setProjectEndWarning(false);
    },
    [pendingChanges],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const { activityId, mode, startX, originalStartWeek, originalDuration } =
        drag;
      const deltaWeeks = Math.trunc((e.clientX - startX) / WEEK_WIDTH);
      if (deltaWeeks === 0) return;
      hasDraggedRef.current = true;

      const minWeek = 1;
      const maxWeek = 52;
      let newStart = originalStartWeek;
      let newDuration = originalDuration;
      let clamped = false;

      if (mode === "move") {
        newStart = originalStartWeek + deltaWeeks;
        if (newStart < minWeek) {
          newStart = minWeek;
          clamped = true;
        }
        if (newStart + newDuration - 1 > maxWeek) {
          newStart = maxWeek - newDuration + 1;
          clamped = true;
        }
      } else if (mode === "resize-right") {
        newDuration = Math.max(
          1,
          Math.min(
            originalDuration + deltaWeeks,
            maxWeek - originalStartWeek + 1,
          ),
        );
        if (newDuration !== originalDuration + deltaWeeks) clamped = true;
      } else if (mode === "resize-left") {
        const rawStart = originalStartWeek + deltaWeeks;
        newStart = Math.max(
          minWeek,
          Math.min(rawStart, originalStartWeek + originalDuration - 1),
        );
        newDuration = Math.max(
          1,
          originalDuration - (newStart - originalStartWeek),
        );
        if (newStart !== rawStart) clamped = true;
      }

      setYearClampWarning(clamped);

      // Warn if activity end week exceeds project end week
      const newEndWeek = newStart + newDuration - 1;
      setProjectEndWarning(newEndWeek > projectEndWeek);

      const next = {
        ...visualOverridesRef.current,
        [activityId]: { startWeek: newStart, duration: newDuration },
      };
      visualOverridesRef.current = next;
      setVisualOverrides(next);
    },
    [projectEndWeek],
  );

  const handleMouseUp = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;

    const {
      activityId,
      mode,
      originalStartWeek,
      originalDuration,
      originalStartDate,
      originalEndDate,
    } = drag;
    setDraggingId(null);

    const visual = visualOverridesRef.current[activityId];
    const next = { ...visualOverridesRef.current };
    delete next[activityId];
    visualOverridesRef.current = next;
    setVisualOverrides(next);

    if (!visual) return;

    const didMove =
      visual.startWeek !== originalStartWeek ||
      visual.duration !== originalDuration;
    if (!didMove) return;

    const startDelta = (visual.startWeek - originalStartWeek) * 7;
    const durationDelta = (visual.duration - originalDuration) * 7;

    const newStart = new Date(originalStartDate);
    const newEnd = new Date(originalEndDate);

    if (mode === "move") {
      newStart.setUTCDate(newStart.getUTCDate() + startDelta);
      newEnd.setUTCDate(newEnd.getUTCDate() + startDelta);
    } else if (mode === "resize-right") {
      newEnd.setUTCDate(newEnd.getUTCDate() + durationDelta);
    } else if (mode === "resize-left") {
      newStart.setUTCDate(newStart.getUTCDate() + startDelta);
    }

    setPendingChanges((prev) => ({
      ...prev,
      [activityId]: {
        activityId,
        startDate: newStart.toISOString(),
        endDate: newEnd.toISOString(),
        startWeek: visual.startWeek,
        duration: visual.duration,
      },
    }));
  }, []);

  const saveAll = async () => {
    setSavingPending(true);
    try {
      await Promise.all(
        Object.values(pendingChanges).map((c) =>
          updateActivity(c.activityId, {
            startDate: c.startDate,
            endDate: c.endDate,
          }),
        ),
      );
      setActivities((prev) =>
        prev.map((a) => {
          const change = pendingChanges[a.id];
          if (!change) return a;
          return { ...a, startDate: change.startDate, endDate: change.endDate };
        }),
      );
      setPendingChanges({});
      setYearClampWarning(false);
      setProjectEndWarning(false);
    } catch (err) {
      console.error("Failed to save activity changes:", err);
    } finally {
      setSavingPending(false);
    }
  };

  const discardAll = () => {
    setPendingChanges({});
    visualOverridesRef.current = {};
    setVisualOverrides({});
    setYearClampWarning(false);
    setProjectEndWarning(false);
  };

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
      if (prev.size === ALL_STATUSES.length) return new Set([status]);
      if (prev.size === 1 && prev.has(status)) return new Set(ALL_STATUSES);
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const toggleAll = () => setActiveFilters(new Set(ALL_STATUSES));

  const currentWeek = getCurrentWeek();
  const months = getMonthSpans();
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
  const allActive = activeFilters.size === ALL_STATUSES.length;
  const visibleStatuses = ALL_STATUSES.filter((s) => activeFilters.has(s));
  const hasPending = Object.keys(pendingChanges).length > 0;
  const showBar = hasPending || yearClampWarning || projectEndWarning;

  return (
    <>
      <div
        className="rounded-xl bg-white shadow text-sm overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b gap-4">
          <h2 className="font-semibold text-base flex-shrink-0">Aktiviteter</h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(yearClampWarning || projectEndWarning) && (
              <div className="flex flex-col gap-1">
                {yearClampWarning && (
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                    ⚠ Aktiviteten kan inte dras utanför vecka 1–52
                  </span>
                )}
                {projectEndWarning && (
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                    ⚠ Aktiviteten sträcker sig bortom projektets slutdatum
                  </span>
                )}
              </div>
            )}
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

          {visibleStatuses.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const group = activities.filter((a) => a.status === status);
            if (group.length === 0) return null;

            return (
              <React.Fragment key={status}>
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

                {group.map((activity) => {
                  const visual = getVisual(activity);
                  const isPending = !!pendingChanges[activity.id];
                  const isDragging = draggingId === activity.id;

                  return (
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
                          isPending={isPending}
                          isDragging={isDragging}
                          visual={visual}
                          onEdit={onEdit}
                          onDragStart={(mode, clientX) =>
                            handleDragStart(activity, mode, clientX)
                          }
                          hasDragged={hasDraggedRef}
                        />
                      </div>
                    </div>
                  );
                })}
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

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 px-6 py-4 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 ease-in-out ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          {yearClampWarning && (
            <span className="text-amber-600 font-medium text-xs">
              ⚠ Aktiviteten kan inte dras utanför vecka 1–52
            </span>
          )}
          {projectEndWarning && (
            <span className="text-amber-600 font-medium text-xs">
              ⚠ Aktiviteten sträcker sig bortom projektets slutdatum
            </span>
          )}
        </div>
        {hasPending && (
          <>
            <span className="text-gray-400 text-xs">
              {Object.keys(pendingChanges).length}{" "}
              {Object.keys(pendingChanges).length === 1
                ? "osparad ändring"
                : "osparade ändringar"}
            </span>
            <button
              onClick={discardAll}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <X className="w-3.5 h-3.5" />
              Ångra
            </button>
            <button
              onClick={saveAll}
              disabled={savingPending}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {savingPending ? "Sparar..." : "Spara ändringar"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ActivityTimeline;
