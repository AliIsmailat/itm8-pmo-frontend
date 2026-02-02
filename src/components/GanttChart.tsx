import React, { useState } from "react";
import PhaseBlock from "./PhaseBlock";
import type { Phase } from "./PhaseBlock";

const WEEK_WIDTH = 24;
const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 24;

interface GanttChartProps {
  phases: Phase[];
}

const GanttChart: React.FC<GanttChartProps> = ({ phases: initialPhases }) => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const chartHeight = phases.length * ROW_HEIGHT;
  const currentWeek = getISOWeek();

  const handleEdit = (phase: Phase) => setSelectedPhase(phase);

  const handleSave = () => {
    if (!selectedPhase) return;
    setPhases((prev) =>
      prev.map((p) => (p.name === selectedPhase.name ? selectedPhase : p)),
    );
    setSelectedPhase(null);
  };

  return (
    <div className="bg-gray-200 rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="font-semibold mb-4">Tidsplan</h2>

      <div className="flex">
        <div className="w-40 flex flex-col gap-2">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="h-8 flex items-center text-sm font-medium"
            >
              {phase.name}
            </div>
          ))}
        </div>

        <div
          className="relative flex-1"
          style={{ minWidth: `${52 * WEEK_WIDTH}px` }}
        >
          <div className="flex h-[24px]">
            {Array.from({ length: 52 }, (_, i) => (
              <div
                key={i}
                className="w-[24px] text-center text-xs flex items-center justify-center border-r border-gray-300"
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div
            className="relative"
            style={{
              height: `${chartHeight}px`,
              marginTop: `${HEADER_HEIGHT}px`,
            }}
          >
            <div className="absolute top-0 left-0 flex h-full">
              {Array.from({ length: 52 }, (_, i) => (
                <div
                  key={i}
                  className="border-r border-gray-300"
                  style={{ width: `${WEEK_WIDTH}px` }}
                />
              ))}
            </div>

            {phases.map((_, idx) => (
              <div
                key={idx}
                className="w-full border-b border-gray-300 absolute"
                style={{ top: `${idx * ROW_HEIGHT}px` }}
              />
            ))}

            <div
              className="absolute top-0 h-full bg-yellow-100 opacity-30 pointer-events-none"
              style={{
                left: `${(currentWeek - 1) * WEEK_WIDTH}px`,
                width: `${WEEK_WIDTH}px`,
              }}
            />

            {phases.map((phase, idx) => (
              <PhaseBlock
                key={idx}
                {...phase}
                top={idx * ROW_HEIGHT}
                weekWidth={WEEK_WIDTH}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedPhase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="font-semibold mb-4">
              Redigera fas: {selectedPhase.name}
            </h3>
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
                value={selectedPhase.status}
                onChange={(e) =>
                  setSelectedPhase({
                    ...selectedPhase,
                    status: e.target.value as Phase["status"],
                  })
                }
                className="border p-1 rounded"
              >
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
