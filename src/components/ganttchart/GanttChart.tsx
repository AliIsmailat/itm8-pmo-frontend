import React, { useState } from "react";
import PhaseBlock from "./PhaseBlock";
import type { Phase } from "./PhaseBlock";
import { Plus } from "lucide-react";

const WEEK_WIDTH = 24;
const ROW_HEIGHT = 40;

interface GanttChartProps {
  phases: Phase[];
}

interface NewPhase {
  name: string;
  startDate: string;
  endDate: string;
  status?: Phase["status"];
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

const GanttChart: React.FC<GanttChartProps> = ({ phases: initialPhases }) => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedPhaseForResources, setSelectedPhaseForResources] =
    useState<Phase | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhase, setNewPhase] = useState<NewPhase>({
    name: "",
    startDate: "",
    endDate: "",
  });

  const currentWeek = getISOWeek();
  const months = getMonthSpans();
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  const handleEdit = (phase: Phase) => {
    setSelectedPhase({
      ...phase,
      status: undefined,
    });
  };

  const handleSave = () => {
    if (!selectedPhase) return;
    setPhases((prev) =>
      prev.map((p) => (p.name === selectedPhase.name ? selectedPhase : p)),
    );
    setSelectedPhase(null);
  };

  const handleAddPhase = () => {
    if (!newPhase.name || !newPhase.startDate || !newPhase.endDate) return;

    const startWeek = getISOWeek(new Date(newPhase.startDate));
    const endWeek = getISOWeek(new Date(newPhase.endDate));
    const usedWeeks = endWeek - startWeek + 1;

    const phaseToAdd: Phase = {
      name: newPhase.name,
      startWeek,
      duration: endWeek - startWeek + 1,
      usedWeeks,
      status: newPhase.status,
    };

    setPhases((prev) => [...prev, phaseToAdd]);
    setShowAddModal(false);
    setNewPhase({ name: "", startDate: "", endDate: "" });
  };

  return (
    <div className="rounded-xl bg-white shadow text-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
        <h2 className="font-semibold text-base">Tidsplan</h2>
        <div className="flex gap-2">
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 flex items-center gap-1 text-base"
            onClick={() => setShowResourceModal(true)}
          >
            <Plus className="w-3 h-3" />
            Allokera resurser
          </button>
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 flex items-center gap-1 text-base"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-3 h-3" />
            Lägg till fas
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* Month header row */}
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

        <div
          className="grid bg-gray-50 border-b"
          style={{ gridTemplateColumns: `160px repeat(52, ${WEEK_WIDTH}px)` }}
        >
          <div className="border-r" />
          {weeks.map((w) => (
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

        {phases.map((phase, idx) => (
          <div
            key={idx}
            className="grid relative border-t"
            style={{ gridTemplateColumns: `160px repeat(52, ${WEEK_WIDTH}px)` }}
          >
            <div
              className="border-r px-3 py-1 flex items-center gap-2"
              style={{ height: `${ROW_HEIGHT}px` }}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
              <div className="text-[14px] border-l pl-2 border-gray-300 font-medium truncate">
                {phase.name}
              </div>
            </div>

            {weeks.map((w) => (
              <div
                key={w}
                className={`border-l ${w === currentWeek ? "bg-purple-50" : ""}`}
                style={{ height: `${ROW_HEIGHT}px` }}
              />
            ))}

            <div
              className="absolute top-0 bottom-0"
              style={{ left: `160px`, right: 0 }}
            >
              <PhaseBlock
                {...phase}
                top={0}
                weekWidth={WEEK_WIDTH}
                onEdit={handleEdit}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedPhase && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedPhase(null)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-semibold mb-4">
              Redigera fas: {selectedPhase.name}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label>Förbrukade veckor</label>
              <input
                type="number"
                value={selectedPhase.usedWeeks}
                onChange={(e) =>
                  setSelectedPhase({
                    ...selectedPhase,
                    usedWeeks: Number(e.target.value),
                  })
                }
                className="border p-1 rounded"
              />
              <label>Status</label>
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
                className="border p-1 rounded"
              >
                <option value="">Automatisk</option>
                <option value="onTime">On Time</option>
                <option value="risk">Risk</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                onClick={() => setSelectedPhase(null)}
              >
                Avbryt
              </button>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded"
                onClick={handleSave}
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-semibold mb-4">Lägg till fas</div>
            <input
              type="text"
              placeholder="Fas namn"
              value={newPhase.name}
              onChange={(e) =>
                setNewPhase((prev) => ({ ...prev, name: e.target.value }))
              }
              className="border p-1 rounded w-full mb-2"
            />
            <input
              type="date"
              value={newPhase.startDate}
              onChange={(e) =>
                setNewPhase((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="border p-1 rounded w-full mb-2"
            />
            <input
              type="date"
              value={newPhase.endDate}
              onChange={(e) =>
                setNewPhase((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="border p-1 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Avbryt
              </button>
              <button
                className="px-4 py-1 bg-purple-600 text-white rounded"
                onClick={handleAddPhase}
              >
                Lägg till
              </button>
            </div>
          </div>
        </div>
      )}

      {showResourceModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowResourceModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-semibold mb-4">Allokera resurser</div>

            <div className="flex flex-col gap-2 mb-10">
              {phases.map((phase) => (
                <div
                  key={phase.name}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{phase.name}</span>
                  <button
                    className="px-3 py-[0.2rem] bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-1"
                    onClick={() => setSelectedPhaseForResources(phase)}
                  >
                    Välj resurser
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                onClick={() => setShowResourceModal(false)}
              >
                Avbryt
              </button>
              <button
                className="px-4 py-1 bg-purple-600 text-white rounded"
                onClick={() => {
                  console.log(
                    "Resurser allokerade:",
                    selectedPhaseForResources,
                  );
                  setShowResourceModal(false);
                }}
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getISOWeek(date: Date = new Date()): number {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
}

export default GanttChart;
