import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, MapPin, FolderOpen, Layers } from "lucide-react";

interface ResourceCardProps {
  id: number;
  name: string;
  location: string;
  clLevel: string;
  skills: { id: number; name: string }[];
  ongoingProjects: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  name,
  location,
  clLevel,
  skills,
  ongoingProjects,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="relative w-[22rem]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="bg-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-4 px-5 pt-5 pb-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-sm">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-semibold text-base leading-tight truncate">
              {name}
            </p>
            <p className="text-purple-500 text-xs font-medium mt-0.5">
              {clLevel} · Resurs #{id}
            </p>
          </div>

          <div ref={menuRef} className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {open && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Redigera
                </button>
                <div className="h-px bg-gray-100 mx-3" />
                <button className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  Ta bort
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-100 mx-5" />

        {/* Info */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-sm text-gray-600 truncate">{location}</span>
          </div>

          {/* Kompetenser */}
          <div className="h-px bg-gray-100 my-1" />
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Kompetenser
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-sm text-gray-600">
              {skills.length > 0
                ? skills
                    .map((s) => s.name)
                    .filter(Boolean)
                    .join(", ")
                : "—"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mx-5 mb-5 mt-1 flex items-center justify-between bg-white rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-purple-700 font-medium">
              Pågående projekt
            </span>
          </div>
          <span className="text-sm font-bold text-purple-700 bg-gray-200 px-2.5 py-0.5 rounded-lg shadow-sm">
            {ongoingProjects}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
