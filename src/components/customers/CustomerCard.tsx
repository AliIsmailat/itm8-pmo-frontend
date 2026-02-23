import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  name: string;
  ongoingProjects: number;
}

const CustomerCard: React.FC<Props> = ({ id, name, ongoingProjects }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    navigate(`/projects?customerId=${id}`);
  };

  return (
    <div
      className="bg-gray-100 shadow-lg rounded-lg p-6 relative w-[24rem] flex flex-col gap-4 cursor-pointer"
      onClick={handleClick}
    >
      <div ref={menuRef} className="absolute top-4 right-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
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
        {name[0]}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold">{name}</span>
      </div>

      <div className="text-gray-700">
        <span>Pågående projekt: {ongoingProjects}</span>
      </div>
    </div>
  );
};

export default CustomerCard;
