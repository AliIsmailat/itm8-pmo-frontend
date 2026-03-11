import React from "react";
import { List, GanttChartSquare } from "lucide-react";

interface Props {
  view: "table" | "grid";
  onChange: (v: "table" | "grid") => void;
}

const ViewSwitch: React.FC<Props> = ({ view, onChange }) => {
  return (
    <div className="flex bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-1 gap-1">
      <button
        onClick={() => onChange("table")}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition ${
          view === "table"
            ? "bg-purple-600 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        <List className="w-4 h-4" />
        Tabell
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition ${
          view === "grid"
            ? "bg-purple-600 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        <GanttChartSquare className="w-4 h-4" />
        Tidslinje
      </button>
    </div>
  );
};

export default ViewSwitch;
