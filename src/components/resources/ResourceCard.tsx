import React, { useState, useRef, useEffect } from "react";
import { Mail, Phone, MoreVertical } from "lucide-react";

interface ResourceCardProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  ongoingProjects: number;
  skills: string[];
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  name,
  role,
  email,
  phone,
  ongoingProjects,
  skills,
}) => {
  const initial = name.charAt(0).toUpperCase();
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

  return (
    <div className="bg-gray-100 shadow-lg rounded-lg p-6 relative w-[24rem] flex flex-col gap-4">
      <div ref={menuRef} className="absolute top-4 right-0">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-1 rounded-full hover:bg-gray-200 transition"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-20">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Redigera
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
              Ta bort
            </button>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-10 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-lg">
        {initial}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold">{name}</span>
        <span className="text-sm text-gray-500">{role}</span>
      </div>

      <div className="flex flex-col gap-1 text-gray-700">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{phone}</span>
        </div>
      </div>

      <div className="text-gray-700">
        <span>Pågående projekt: {ongoingProjects}</span>
      </div>

      <div className="text-gray-700">
        <span className="font-medium">Kompetenser:</span>{" "}
        <span>{skills.join(", ") || "—"}</span>
      </div>
    </div>
  );
};

export default ResourceCard;
