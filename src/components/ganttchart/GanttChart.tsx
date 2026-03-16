import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import PhaseBlock from "./PhaseBlock";
import type { Phase } from "./PhaseBlock";
import { Plus, Trash2, Users, X, Check, AlertCircle } from "lucide-react";
import { createPhase, updatePhase, deletePhase } from "../../utils/projects";
import { getResources } from "../../utils/resources";
import type { Resource } from "../../utils/resources";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

const WEEK_WIDTH = 24;
const ROW_HEIGHT = 40;

interface GanttPhase extends Phase {
  id: number;
  startDate: string;
  endDate: string;
  allocatedResourceIds?: number[];
}

interface GanttChartProps {
  phases: GanttPhase[];
  projectId: number;
  onPhasesChanged?: () => void;
}

interface PhaseFormData {
  name: string;
  startDate: string;
  endDate: string;
}

interface DragState {
  phaseIdx: number;
  type: "move" | "resize-left" | "resize-right";
  startX: number;
  originalStartWeek: number;
  originalDuration: number;
  originalStartDate: string;
  originalEndDate: string;
  phaseYear: number;
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

function getISOWeek(date: Date = new Date()): number {
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

function weekToDate(week: number, year = new Date().getUTCFullYear()): string {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7));
  const d = new Date(startOfWeek1);
  d.setUTCDate(d.getUTCDate() + (week - 1) * 7);
  return d.toISOString();
}

function weekToEndDate(
  week: number,
  year = new Date().getUTCFullYear(),
): string {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7));
  const d = new Date(startOfWeek1);
  d.setUTCDate(d.getUTCDate() + (week - 1) * 7 + 6);
  return d.toISOString();
}

function phasesOverlap(
  aStart: number,
  aDuration: number,
  bStart: number,
  bDuration: number,
): boolean {
  // Intervals are [start, start+duration) — exclusive end
  return aStart < bStart + bDuration && bStart < aStart + aDuration;
}

const inputClass =
  "border border-gray-200 rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50";

const GanttChart: React.FC<GanttChartProps> = ({
  phases: initialPhases,
  projectId,
  onPhasesChanged,
}) => {
  const [phases, setPhases] = useState<GanttPhase[]>(initialPhases);
  const [selectedPhase, setSelectedPhase] = useState<GanttPhase | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [formData, setFormData] = useState<PhaseFormData>({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [yearClampError, setYearClampError] = useState<string | null>(null);

  // Drag state
  const dragRef = useRef<DragState | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const hasDraggedRef = useRef(false);

  // Resource allocation state
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [selectedPhaseForResources, setSelectedPhaseForResources] =
    useState<GanttPhase | null>(null);
  const [phaseResourceMap, setPhaseResourceMap] = useState<
    Record<string, number[]>
  >({});

  const currentWeek = getISOWeek();
  const months = getMonthSpans();
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  useEffect(() => {
    getResources().then(setAllResources).catch(console.error);
  }, []);

  useEffect(() => {
    setPhases(initialPhases);
  }, [initialPhases]);

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const handleDragStart = useCallback(
    (
      phaseIdx: number,
      type: "move" | "resize-left" | "resize-right",
      clientX: number,
    ) => {
      const phase = phases[phaseIdx];
      dragRef.current = {
        phaseIdx,
        type,
        startX: clientX,
        originalStartWeek: phase.startWeek,
        originalDuration: phase.duration,
        originalStartDate: phase.startDate,
        originalEndDate: phase.endDate,
        phaseYear: (() => {
          const mid = new Date(
            (new Date(phase.startDate).getTime() +
              new Date(phase.endDate).getTime()) /
              2,
          );
          return mid.getUTCFullYear();
        })(),
      };
      hasDraggedRef.current = false;
      setDraggingIdx(phaseIdx);
    },
    [phases],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const {
      phaseIdx,
      type,
      startX,
      originalStartWeek,
      originalDuration,
      phaseYear,
    } = dragRef.current;
    const deltaWeeks = Math.trunc((e.clientX - startX) / WEEK_WIDTH);
    if (deltaWeeks === 0) return;
    hasDraggedRef.current = true;

    // Clamp to weeks that keep the phase within its original year, max 52
    const yearStart = getISOWeek(new Date(Date.UTC(phaseYear, 0, 4)));
    const minWeek = yearStart;
    const maxWeek = 52; // Gantt only renders 52 columns

    setPhases((prev) => {
      const updated = [...prev];
      const phase = { ...updated[phaseIdx] };

      if (type === "move") {
        const rawStart = originalStartWeek + deltaWeeks;
        const clampedStart = Math.min(
          Math.max(minWeek, rawStart),
          maxWeek - originalDuration + 1,
        );
        phase.startWeek = clampedStart;
        if (clampedStart !== rawStart) {
          setYearClampError(
            `Faser kan inte flyttas utanför sitt år (${phaseYear})`,
          );
        } else {
          setYearClampError(null);
        }
      } else if (type === "resize-right") {
        phase.duration = Math.min(
          Math.max(1, originalDuration + deltaWeeks),
          maxWeek - phase.startWeek + 1,
        );
      } else if (type === "resize-left") {
        const newStart = Math.max(minWeek, originalStartWeek + deltaWeeks);
        const newDuration = Math.max(
          1,
          originalDuration - (newStart - originalStartWeek),
        );
        phase.startWeek = newStart;
        phase.duration = newDuration;
      }

      updated[phaseIdx] = phase;
      return updated;
    });
  }, []);

  const handleMouseUp = useCallback(async () => {
    if (!dragRef.current) return;
    const {
      phaseIdx,
      type,
      originalStartWeek,
      originalDuration,
      originalStartDate,
      originalEndDate,
    } = dragRef.current;
    dragRef.current = null;
    setDraggingIdx(null);

    const phase = phases[phaseIdx];
    const didMove =
      phase.startWeek !== originalStartWeek ||
      phase.duration !== originalDuration;

    // Check overlap against all other phases
    const hasOverlap = phases.some((other, idx) => {
      if (idx === phaseIdx) return false;
      return phasesOverlap(
        phase.startWeek,
        phase.duration,
        other.startWeek,
        other.duration,
      );
    });

    if (hasOverlap) {
      setPhases((prev) => {
        const updated = [...prev];
        updated[phaseIdx] = {
          ...updated[phaseIdx],
          startWeek: originalStartWeek,
          duration: originalDuration,
        };
        return updated;
      });
      return;
    }

    // Only save if actually moved
    if (!didMove) return;

    const startWeekDelta = phase.startWeek - originalStartWeek;
    const durationDelta = phase.duration - originalDuration;
    const startDayDelta = startWeekDelta * 7;
    const durationDayDelta = durationDelta * 7;

    // Calculate new dates based on drag type
    const newStart = new Date(originalStartDate);
    const newEnd = new Date(originalEndDate);

    if (type === "move") {
      // Both dates shift by same amount
      newStart.setUTCDate(newStart.getUTCDate() + startDayDelta);
      newEnd.setUTCDate(newEnd.getUTCDate() + startDayDelta);
    } else if (type === "resize-right") {
      // Only end date changes
      newEnd.setUTCDate(newEnd.getUTCDate() + durationDayDelta);
    } else if (type === "resize-left") {
      // Start shifts, end stays fixed
      newStart.setUTCDate(newStart.getUTCDate() + startDayDelta);
    }

    const newStartDate = newStart.toISOString();
    const newEndDate = newEnd.toISOString();

    // Check actual date overlap against all other phases using real DB dates
    const hasDateOverlap = phases.some((p, i) => {
      if (i === phaseIdx) return false;
      return new Date(p.startDate) < newEnd && new Date(p.endDate) > newStart;
    });

    console.log("Drag attempt:", {
      name: phase.name,
      type,
      startWeekDelta,
      durationDelta,
      newStartDate,
      newEndDate,
      hasDateOverlap,
      conflictsWith: phases
        .filter(
          (p, i) =>
            i !== phaseIdx &&
            new Date(p.startDate) < newEnd &&
            new Date(p.endDate) > newStart,
        )
        .map((p) => ({
          name: p.name,
          startDate: p.startDate,
          endDate: p.endDate,
        })),
    });

    if (hasDateOverlap) {
      setPhases((prev) => {
        const updated = [...prev];
        updated[phaseIdx] = {
          ...updated[phaseIdx],
          startWeek: originalStartWeek,
          duration: originalDuration,
        };
        return updated;
      });
      return;
    }

    // Save to backend — don't call onPhasesChanged to avoid reorder from refetch
    try {
      console.log("Saving:", {
        id: phase.id,
        name: phase.name,
        type,
        newStartDate,
        newEndDate,
      });
      await updatePhase(phase.id, {
        name: phase.name,
        startDate: newStartDate,
        endDate: newEndDate,
      });
      // Update stored dates on the phase so future drags use correct originals
      if (didMove) {
        setPhases((prev) => {
          const updated = [...prev];
          updated[phaseIdx] = {
            ...updated[phaseIdx],
            startDate: newStartDate,
            endDate: newEndDate,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to save phase drag:", err);
      if (axios.isAxiosError(err))
        console.error("Drag save response:", err.response?.data);
      setPhases((prev) => {
        const updated = [...prev];
        updated[phaseIdx] = {
          ...updated[phaseIdx],
          startWeek: originalStartWeek,
          duration: originalDuration,
        };
        return updated;
      });
    }
  }, [phases]);

  // ── Edit / save ────────────────────────────────────────────────────────────

  const anyModalOpen =
    !!selectedPhase ||
    showAddModal ||
    showResourceModal ||
    deleteConfirmId !== null;

  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  const handleEdit = (phase: GanttPhase) => setSelectedPhase({ ...phase });

  const handleSave = async () => {
    if (!selectedPhase) return;
    setSaving(true);
    try {
      const original = phases.find((p) => p.id === selectedPhase.id);
      const weeksChanged =
        !original ||
        original.startWeek !== selectedPhase.startWeek ||
        original.duration !== selectedPhase.duration;

      await updatePhase(selectedPhase.id, {
        name: selectedPhase.name,
        startDate: weeksChanged
          ? weekToDate(selectedPhase.startWeek)
          : selectedPhase.startDate,
        endDate: weeksChanged
          ? weekToEndDate(
              Math.min(
                52,
                selectedPhase.startWeek + selectedPhase.duration - 1,
              ),
            )
          : selectedPhase.endDate,
      });
      if (weeksChanged) onPhasesChanged?.();
      setPhases((prev) =>
        prev.map((p) =>
          p.id === selectedPhase.id
            ? {
                ...p,
                name: selectedPhase.name,
                usedWeeks: selectedPhase.usedWeeks,
                status: selectedPhase.status,
              }
            : p,
        ),
      );
      setSelectedPhase(null);
    } catch (err) {
      console.error("Failed to update phase:", err);
      if (axios.isAxiosError(err))
        console.error("Response:", err.response?.data);
      alert("Kunde inte uppdatera fasen.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhase = async () => {
    if (!formData.name.trim()) {
      setFormError("Ange ett namn för fasen.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setFormError("Ange start- och slutdatum.");
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setFormError("Slutdatum kan inte vara före startdatum.");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      await createPhase(projectId, {
        name: formData.name,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      onPhasesChanged?.();
      setShowAddModal(false);
      setFormData({ name: "", startDate: "", endDate: "" });
      setFormError(null);
    } catch (err) {
      console.error("Failed to create phase:", err);
      const message =
        axios.isAxiosError(err) && typeof err.response?.data === "string"
          ? "Fasens datum överlappar med en befintlig fas i projektet."
          : "Kunde inte skapa fasen.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhase = async (phaseId: number) => {
    setDeleteConfirmId(null);
    setPhases((prev) => prev.filter((p) => p.id !== phaseId));
    try {
      await deletePhase(phaseId);
    } catch (err) {
      console.error("Failed to delete phase:", err);
      onPhasesChanged?.();
    }
  };

  const toggleResourceForPhase = (phaseKey: string, resourceId: number) => {
    setPhaseResourceMap((prev) => {
      const current = prev[phaseKey] ?? [];
      return {
        ...prev,
        [phaseKey]: current.includes(resourceId)
          ? current.filter((id) => id !== resourceId)
          : [...current, resourceId],
      };
    });
  };

  const phaseKey = (p: GanttPhase) => p.id.toString();

  return (
    <div
      className="rounded-xl bg-white shadow text-sm overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
        <h2 className="font-semibold text-base">Tidsplan</h2>
        <div className="flex items-center gap-3">
          {yearClampError && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              {yearClampError}
            </span>
          )}
          <div className="flex gap-2">
            <button
              className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm shadow-sm"
              onClick={() => setShowResourceModal(true)}
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              Allokera resurser
            </button>
            <button
              className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm shadow-sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-3.5 h-3.5 text-purple-600" />
              Lägg till fas
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* Month header */}
        <div
          className="grid bg-gray-50 border-b"
          style={{ gridTemplateColumns: `160px repeat(52, ${WEEK_WIDTH}px)` }}
        >
          <div className="p-2 font-semibold border-r">Fas</div>
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

        {/* Phase rows */}
        {phases.map((phase, idx) => {
          const key = phaseKey(phase);
          const allocatedCount = (phaseResourceMap[key] ?? []).length;
          return (
            <div
              key={phase.id}
              className="grid relative border-t"
              style={{
                gridTemplateColumns: `160px repeat(52, ${WEEK_WIDTH}px)`,
              }}
            >
              <div
                className="border-r px-3 py-1 flex items-center gap-2"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <div className="text-[14px] border-l pl-2 border-gray-300 font-medium truncate flex-1">
                  {phase.name}
                </div>
                {allocatedCount > 0 && (
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {allocatedCount}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(phase.id);
                  }}
                  className="text-gray-400 hover:text-red-500 flex-shrink-0 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
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
                <PhaseBlock
                  {...phase}
                  top={0}
                  weekWidth={WEEK_WIDTH}
                  onEdit={(p) => {
                    const full = phases.find((ph) => ph.name === p.name);
                    if (full) handleEdit(full);
                  }}
                  onDragStart={(type, clientX) =>
                    handleDragStart(idx, type, clientX)
                  }
                  isDragging={draggingIdx === idx}
                  hasDragged={hasDraggedRef}
                  resources={(phaseResourceMap[key] ?? [])
                    .map(
                      (id) => allResources.find((r) => r.id === id)?.name ?? "",
                    )
                    .filter(Boolean)}
                />
              </div>
            </div>
          );
        })}

        {phases.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            Inga faser tillagda ännu
          </div>
        )}
      </div>

      {/* ── Edit modal ── */}
      {selectedPhase && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedPhase(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-purple-600" />
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Redigera fas</h3>
              <div className="flex flex-col gap-3 mb-5">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Namn
                  </label>
                  <input
                    type="text"
                    value={selectedPhase.name}
                    onChange={(e) =>
                      setSelectedPhase({
                        ...selectedPhase,
                        name: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Förbrukade veckor
                  </label>
                  <input
                    type="number"
                    value={selectedPhase.usedWeeks ?? ""}
                    onChange={(e) =>
                      setSelectedPhase({
                        ...selectedPhase,
                        usedWeeks: Number(e.target.value),
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Status
                  </label>
                  <select
                    value={selectedPhase.status ?? ""}
                    onChange={(e) =>
                      setSelectedPhase({
                        ...selectedPhase,
                        status:
                          e.target.value === ""
                            ? undefined
                            : (e.target.value as Phase["status"]),
                      })
                    }
                    className={inputClass}
                  >
                    <option value="">Automatisk</option>
                    <option value="onTime">I tid</option>
                    <option value="risk">Risk</option>
                    <option value="delayed">Försenad</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition"
                  onClick={() => setSelectedPhase(null)}
                >
                  Avbryt
                </button>
                <button
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm disabled:opacity-60 transition"
                  onClick={handleSave}
                >
                  {saving ? "Sparar..." : "Spara"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowAddModal(false);
            setFormError(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-purple-600" />
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Lägg till fas
              </h3>
              <div className="flex flex-col gap-3 mb-5">
                <input
                  type="text"
                  placeholder="Fas namn"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, name: e.target.value }));
                    setFormError(null);
                  }}
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Startdatum
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        setFormData((p) => ({
                          ...p,
                          startDate: e.target.value,
                        }));
                        setFormError(null);
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Slutdatum
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, endDate: e.target.value }));
                        setFormError(null);
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
                {formError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError(null);
                  }}
                >
                  Avbryt
                </button>
                <button
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm disabled:opacity-60 transition"
                  onClick={handleAddPhase}
                >
                  {saving ? "Sparar..." : "Lägg till"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      <DeleteConfirmModal
        isOpen={deleteConfirmId !== null}
        entityName={phases.find((p) => p.id === deleteConfirmId)?.name}
        onConfirm={() =>
          deleteConfirmId !== null && handleDeletePhase(deleteConfirmId)
        }
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* ── Resource allocation modal ── */}
      {showResourceModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowResourceModal(false);
            setSelectedPhaseForResources(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[32rem] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-purple-600" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">
                  Allokera resurser
                </h3>
                <button
                  onClick={() => {
                    setShowResourceModal(false);
                    setSelectedPhaseForResources(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!selectedPhaseForResources ? (
                <>
                  <p className="text-xs text-gray-500 mb-3">
                    Välj en fas för att tilldela resurser
                  </p>
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {phases.length === 0 && (
                      <p className="text-sm text-gray-400 py-4 text-center">
                        Inga faser att allokera till
                      </p>
                    )}
                    {phases.map((phase) => {
                      const key = phaseKey(phase);
                      const count = (phaseResourceMap[key] ?? []).length;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedPhaseForResources(phase)}
                          className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl transition text-left"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span className="text-sm font-medium text-gray-700">
                              {phase.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {count > 0 && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                {count} resurs{count > 1 ? "er" : ""}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              Välj →
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedPhaseForResources(null)}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 mb-3 transition"
                  >
                    ← Tillbaka
                  </button>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Resurser för{" "}
                    <span className="text-purple-600">
                      {selectedPhaseForResources.name}
                    </span>
                  </p>
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {allResources.length === 0 && (
                      <p className="text-sm text-gray-400 py-4 text-center">
                        Inga resurser hittades
                      </p>
                    )}
                    {allResources.map((r) => {
                      const key = phaseKey(selectedPhaseForResources);
                      const selected = (phaseResourceMap[key] ?? []).includes(
                        r.id,
                      );
                      return (
                        <button
                          key={r.id}
                          onClick={() => toggleResourceForPhase(key, r.id)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition ${
                            selected
                              ? "bg-purple-50 border-purple-300"
                              : "bg-gray-50 border-gray-200 hover:border-purple-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                              {r.name[0].toUpperCase()}
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium text-gray-700">
                                {r.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {r.clLevel} · {r.location}
                              </div>
                            </div>
                          </div>
                          {selected && (
                            <Check className="w-4 h-4 text-purple-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm transition"
                      onClick={() => setSelectedPhaseForResources(null)}
                    >
                      Klar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttChart;
