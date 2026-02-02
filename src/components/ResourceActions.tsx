import React from "react";
import { Search, ChevronDown, Plus } from "lucide-react";

const ResourceActions: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Sök efter namn eller roll..."
          className="border border-gray-300 rounded-lg p-2 pl-10 w-[40rem] focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2">
        Filtrera
        <ChevronDown className="w-4 h-4" />
      </button>

      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
        Lägg till resurs
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ResourceActions;
