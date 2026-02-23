import React from "react";
import { Search, Plus } from "lucide-react";

interface Props {
  onAdd?: () => void;
  onSearch?: (value: string) => void;
}

const CustomerActions: React.FC<Props> = ({ onAdd, onSearch }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Sök efter kund..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 pl-10 w-[40rem] focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        onClick={onAdd}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
      >
        Lägg till kund
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CustomerActions;
