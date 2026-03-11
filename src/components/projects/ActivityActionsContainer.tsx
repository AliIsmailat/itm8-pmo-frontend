import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { Zap, Calendar, Clock, Check, DollarSign, Search } from "lucide-react";
import { createActivity, updateActivity } from "../../utils/activities";
import type { Activity, ActivityStatus } from "../../utils/activities";
import type { Project } from "../../utils/projects";

const STATUS_OPTIONS: { value: ActivityStatus; label: string }[] = [
  { value: "NotStarted", label: "Ej påbörjad" },
  { value: "InProgress", label: "Pågående" },
  { value: "Completed", label: "Avslutad" },
  { value: "OnHold", label: "Pausad" },
  { value: "Cancelled", label: "Avbruten" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  projectId: number;
  project?: Project | null;
  existing?: Activity | null;
}

const ActivityActionsContainer: React.FC<Props> = ({
  isOpen,
  onClose,
  onSaved,
  projectId,
  project,
  existing,
}) => {
  const [loading, setLoading] = useState(false);
  const [resourceSearch, setResourceSearch] = useState("");

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [billable, setBillable] = useState(true);
  const [status, setStatus] = useState<ActivityStatus>("NotStarted");
  const [selectedResources, setSelectedResources] = useState<
    { id: number; hoursSpent: number | null }[]
  >([]);

  const isEditing = !!existing;
  const projectResources = project?.resources ?? [];

  useEffect(() => {
    if (!isOpen) return;
    setResourceSearch("");
    if (existing) {
      setName(existing.name);
      setStartDate(existing.startDate.slice(0, 10));
      setEndDate(existing.endDate.slice(0, 10));
      setTotalHours(String(existing.totalHours));
      setBillable(existing.billable ?? true);
      setStatus(existing.status);
      setSelectedResources(
        existing.resources.map((r) => ({
          id: r.id,
          hoursSpent: r.hoursSpent ?? null,
        })),
      );
    } else {
      reset();
    }
  }, [isOpen, existing]);

  const reset = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setTotalHours("");
    setBillable(true);
    setStatus("NotStarted");
    setSelectedResources([]);
    setResourceSearch("");
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const toggleResource = (id: number) =>
    setSelectedResources((prev) =>
      prev.some((r) => r.id === id)
        ? prev.filter((r) => r.id !== id)
        : [...prev, { id, hoursSpent: null }],
    );

  const updateHoursSpent = (id: number, hours: number | null) =>
    setSelectedResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hoursSpent: hours } : r)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resourcePayload = selectedResources.map((r) => ({
        resourceId: r.id,
        hoursSpent: r.hoursSpent,
      }));
      if (isEditing && existing) {
        await updateActivity(existing.id, {
          name,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          totalHours: Number(totalHours),
          billable,
          status,
          resources: resourcePayload,
        });
      } else {
        await createActivity({
          name,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          totalHours: Number(totalHours),
          billable,
          status,
          projectId,
          resources: resourcePayload,
        });
      }
      onSaved();
      handleClose();
    } catch (err) {
      console.error("Failed to save activity:", err);
      alert("Något gick fel. Kolla konsolen.");
    } finally {
      setLoading(false);
    }
  };

  const iconInput =
    "w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";

  const filteredResources = projectResources.filter((r) =>
    r.name.toLowerCase().includes(resourceSearch.toLowerCase()),
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="w-[36rem]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? "Redigera aktivitet" : "Skapa aktivitet"}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {isEditing
            ? "Uppdatera aktivitetens uppgifter"
            : "Fyll i aktivitetens uppgifter nedan"}
        </p>
      </div>

      <form
        className="flex flex-col gap-4 max-h-[78vh] overflow-y-auto px-1 pt-1 pb-2"
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Zap className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Aktivitetsnamn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={iconInput}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={iconInput}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className={iconInput}
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="number"
            placeholder="Totala timmar"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            min={0}
            required
            className={iconInput}
          />
        </div>

        <button
          type="button"
          onClick={() => setBillable((p) => !p)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            billable
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Fakturerbar
          {billable && <Check className="w-3.5 h-3.5 ml-auto" />}
        </button>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Status
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  status === s.value
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Resurser
            {projectResources.length === 0 && (
              <span className="text-red-400 normal-case font-normal ml-1">
                — inga resurser på projektet
              </span>
            )}
          </div>

          {projectResources.length > 0 && (
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Sök namn..."
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {filteredResources.map((r) => {
              const selected = selectedResources.find((s) => s.id === r.id);
              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                    selected
                      ? "bg-purple-50 border-purple-300"
                      : "bg-gray-50 border-gray-200 hover:border-purple-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleResource(r.id)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        selected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {r.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700 truncate">
                        {r.name}
                      </div>
                    </div>
                    {selected && (
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    )}
                  </button>
                  {selected && (
                    <input
                      type="number"
                      min={0}
                      placeholder="Timmar"
                      value={selected.hoursSpent ?? ""}
                      onChange={(e) =>
                        updateHoursSpent(
                          r.id,
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 px-2 py-1 text-xs bg-white border border-purple-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shrink-0"
                    />
                  )}
                </div>
              );
            })}
            {filteredResources.length === 0 && projectResources.length > 0 && (
              <p className="text-xs text-gray-400">
                Inga resurser matchar sökningen
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm"
        >
          {loading
            ? "Sparar..."
            : isEditing
              ? "Spara ändringar"
              : "Skapa aktivitet"}
        </button>
      </form>
    </Modal>
  );
};

export default ActivityActionsContainer;
