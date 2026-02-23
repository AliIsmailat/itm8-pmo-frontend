import React from "react";
import { ListOrdered, Table } from "lucide-react";

interface Props {
  view: "table" | "grid";
  onChange: (v: "table" | "grid") => void;
}

const ViewSwitch: React.FC<Props> = ({ view, onChange }) => {
  return (
    <div className="inline-flex rounded-xl border bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => onChange("table")}
        className={`
          flex items-center gap-2 px-4 py-2 text-md font-medium transition
          ${
            view === "table"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }
        `}
      >
        <ListOrdered size={18} />
        Tabell
      </button>

      <button
        onClick={() => onChange("grid")}
        className={`
          flex items-center gap-2 px-4 py-2 text-md font-medium transition
          ${
            view === "grid"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }
        `}
      >
        <Table size={18} />
        Tidslinje
      </button>
    </div>
  );
};

export default ViewSwitch;
