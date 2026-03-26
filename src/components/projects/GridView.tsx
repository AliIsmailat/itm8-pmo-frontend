import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import type { Project } from "../../utils/projects";
import { updateProject } from "../../utils/projects";

interface Props {
  projects: Project[];
  onSaved?: () => void;
}

const WEEKS = Array.from({ length: 52 }, (_, i) => i + 1);

function getISOWeek(dateStr: string): number {
  const date = new Date(dateStr);
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
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
  return getISOWeek(new Date().toISOString());
}

function weekToDate(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7));
  const result = new Date(startOfWeek1);
  result.setUTCDate(startOfWeek1.getUTCDate() + (week - 1) * 7);
  return result;
}

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

interface PendingChange {
  projectId: number;
  startDate: string;
  endDate: string;
}

type DragMode = "move" | "resize-left" | "resize-right";

interface DragState {
  projectId: number;
  mode: DragMode;
  startX: number;
  originalStart: number;
  originalEnd: number;
  originalYear: number;
  colWidth: number;
}

const GridView: React.FC<Props> = ({ projects, onSaved }) => {
  const navigate = useNavigate();
  const [pendingChanges, setPendingChanges] = useState<
    Record<number, PendingChange>
  >({});
  const [saving, setSaving] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [draggedWeeks, setDraggedWeeks] = useState<
    Record<number, { start: number; end: number }>
  >({});
  const [yearClampWarning, setYearClampWarning] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const months = getMonthSpans();
  const currentWeek = getCurrentWeek();
  const hasPending = Object.keys(pendingChanges).length > 0;

  function getEffectiveWeeks(p: Project): { start: number; end: number } {
    if (draggedWeeks[p.id]) return draggedWeeks[p.id];
    if (pendingChanges[p.id]) {
      return {
        start: getISOWeek(pendingChanges[p.id].startDate),
        end: getISOWeek(pendingChanges[p.id].endDate),
      };
    }
    return {
      start: getISOWeek(p.startDate),
      end: getISOWeek(p.endDate),
    };
  }

  function getColWidth(): number {
    if (!gridRef.current) return 20;
    const totalWidth = gridRef.current.clientWidth - 160;
    return totalWidth / 52;
  }

  function onMouseDown(e: React.MouseEvent, project: Project, mode: DragMode) {
    e.preventDefault();
    e.stopPropagation();
    setYearClampWarning(false);

    const year = new Date(project.startDate).getFullYear();
    const effectiveStart = pendingChanges[project.id]
      ? getISOWeek(pendingChanges[project.id].startDate)
      : getISOWeek(project.startDate);
    const effectiveEnd = pendingChanges[project.id]
      ? getISOWeek(pendingChanges[project.id].endDate)
      : getISOWeek(project.endDate);

    setDragState({
      projectId: project.id,
      mode,
      startX: e.clientX,
      originalStart: effectiveStart,
      originalEnd: effectiveEnd,
      originalYear: year,
      colWidth: getColWidth(),
    });
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragState) return;

    const deltaX = e.clientX - dragState.startX;
    const weekDelta = Math.round(deltaX / dragState.colWidth);
    if (weekDelta === 0) return;

    const { mode, originalStart, originalEnd } = dragState;
    let newStart = originalStart;
    let newEnd = originalEnd;
    let clamped = false;

    if (mode === "move") {
      newStart = originalStart + weekDelta;
      newEnd = originalEnd + weekDelta;
      if (newStart < 1) {
        const diff = 1 - newStart;
        newStart = 1;
        newEnd += diff;
        clamped = true;
      }
      if (newEnd > 52) {
        const diff = newEnd - 52;
        newEnd = 52;
        newStart -= diff;
        clamped = true;
      }
    } else if (mode === "resize-left") {
      newStart = Math.max(
        1,
        Math.min(originalStart + weekDelta, originalEnd - 1),
      );
      if (newStart !== originalStart + weekDelta) clamped = true;
    } else if (mode === "resize-right") {
      newEnd = Math.max(
        originalStart + 1,
        Math.min(originalEnd + weekDelta, 52),
      );
      if (newEnd !== originalEnd + weekDelta) clamped = true;
    }

    setYearClampWarning(clamped);
    setDraggedWeeks((prev) => ({
      ...prev,
      [dragState.projectId]: { start: newStart, end: newEnd },
    }));
  }

  function onMouseUp() {
    if (!dragState) return;
    const dragged = draggedWeeks[dragState.projectId];

    if (dragged) {
      const newStartDate = weekToDate(dragState.originalYear, dragged.start)
        .toISOString()
        .split("T")[0];
      const newEndDate = weekToDate(dragState.originalYear, dragged.end)
        .toISOString()
        .split("T")[0];

      setPendingChanges((prev) => ({
        ...prev,
        [dragState.projectId]: {
          projectId: dragState.projectId,
          startDate: newStartDate,
          endDate: newEndDate,
        },
      }));
    }

    setDraggedWeeks({});
    setDragState(null);
  }

  async function saveAll() {
    setSaving(true);
    try {
      await Promise.all(
        Object.values(pendingChanges).map((c) =>
          updateProject(c.projectId, {
            startDate: c.startDate,
            endDate: c.endDate,
          }),
        ),
      );
      setPendingChanges({});
      setYearClampWarning(false);
      onSaved?.();
    } catch (err) {
      console.error("Failed to save project dates:", err);
    } finally {
      setSaving(false);
    }
  }

  function discardAll() {
    setPendingChanges({});
    setDraggedWeeks({});
    setYearClampWarning(false);
  }

  const clients = Array.from(
    new Set(projects.map((p) => p.client?.name ?? "Okänd kund")),
  );

  return (
    <>
      {/* Grid — never affected by toolbar */}
      <div
        ref={gridRef}
        className="border rounded-xl bg-white shadow text-xs overflow-hidden select-none"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Month header */}
        <div
          className="grid bg-gray-50 border-b"
          style={{ gridTemplateColumns: `160px repeat(52, 1fr)` }}
        >
          <div className="p-2 font-semibold border-r">Kund</div>
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
          style={{ gridTemplateColumns: `160px repeat(52, 1fr)` }}
        >
          <div className="border-r" />
          {WEEKS.map((w) => (
            <div
              key={w}
              className={`text-center border-l py-1 text-[13px] ${
                w === currentWeek ? "bg-purple-200 font-bold" : ""
              }`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Rows */}
        {clients.map((client) => {
          const clientProjects = projects.filter(
            (p) => (p.client?.name ?? "Okänd kund") === client,
          );

          return (
            <div key={client}>
              <div
                className="grid bg-gray-50 border-t"
                style={{ gridTemplateColumns: `160px repeat(52, 1fr)` }}
              >
                <div className="p-2 border-r font-bold">{client}</div>
                {WEEKS.map((w) => (
                  <div
                    key={w}
                    className={`border-l h-6 ${w === currentWeek ? "bg-purple-50" : ""}`}
                  />
                ))}
              </div>

              {clientProjects.map((p) => {
                const { start, end } = getEffectiveWeeks(p);
                const isDragging = dragState?.projectId === p.id;
                const isPending = !!pendingChanges[p.id];

                return (
                  <div
                    key={p.id}
                    className="grid relative border-t"
                    style={{ gridTemplateColumns: `160px repeat(52, 1fr)` }}
                  >
                    <div className="border-r px-3 py-1 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full shrink-0" />
                      <button
                        onClick={() =>
                          !isDragging && navigate(`/projects/${p.id}`)
                        }
                        className="text-[13px] border-l pl-2 border-gray-300 truncate text-left hover:text-purple-600 transition-colors"
                      >
                        {p.name}
                      </button>
                    </div>

                    {WEEKS.map((w) => (
                      <div
                        key={w}
                        className={`border-l h-8 ${w === currentWeek ? "bg-purple-50" : ""}`}
                      />
                    ))}

                    <div
                      className="absolute left-[160px] right-0 top-0 bottom-0 grid items-center"
                      style={{ gridTemplateColumns: `repeat(52, 1fr)` }}
                    >
                      <div
                        style={{ gridColumn: `${start} / ${end + 1}` }}
                        className={`mx-[1px] rounded shadow h-4 relative flex items-center group
                          ${isDragging ? "cursor-grabbing opacity-80" : "cursor-grab"}
                          ${isPending ? "bg-purple-400" : "bg-purple-600"}
                        `}
                        onMouseDown={(e) => onMouseDown(e, p, "move")}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize rounded-l opacity-0 group-hover:opacity-100 bg-white/30 transition"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            onMouseDown(e, p, "resize-left");
                          }}
                        />
                        <div
                          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize rounded-r opacity-0 group-hover:opacity-100 bg-white/30 transition"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            onMouseDown(e, p, "resize-right");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Floating bottom bar — slides up when there are pending changes */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 px-6 py-4 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 ease-in-out ${
          hasPending || yearClampWarning ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {yearClampWarning && (
          <span className="text-amber-600 font-medium text-xs">
            ⚠ Projektet kan inte dras utanför sitt år
          </span>
        )}
        {hasPending && (
          <>
            <span className="text-gray-800 text-xs">
              {Object.keys(pendingChanges).length} osparade{" "}
              {Object.keys(pendingChanges).length === 1
                ? "ändring"
                : "ändringar"}
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
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? "Sparar..." : "Spara ändringar"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default GridView;
