import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import type { Project } from "../../utils/projects";

interface Props {
  projects: Project[];
  onSelect?: (p: Project) => void;
  onEdit?: (p: Project) => void;
  onDelete?: (p: Project) => void;
}

interface MenuPos {
  top: number;
  left: number;
}

const TableView: React.FC<Props> = ({
  projects,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<MenuPos>({ top: 0, left: 0 });
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuOpen = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const btn = buttonRefs.current[id];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right - 128 });
    }
    setOpenMenuId(id);
  };

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("sv-SE") : "—";

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm text-gray-600">
              <th className="p-4 font-bold">Kund</th>
              <th className="p-4">Projekt ({projects.length})</th>
              <th className="p-4">Start</th>
              <th className="p-4">Slut</th>
              <th className="p-4">Projektledare</th>
              <th className="p-4">Timmar (tot)</th>
              <th className="p-4">Timmar (allok)</th>
              <th className="p-4 text-center w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelect?.(p)}
                className="border-t text-sm hover:bg-purple-50 cursor-pointer transition"
              >
                <td className="p-4 font-medium">{p.client?.name ?? "—"}</td>
                <td className="p-4">{p.name}</td>
                <td className="p-4">{fmt(p.startDate)}</td>
                <td className="p-4">{fmt(p.endDate)}</td>
                <td className="p-4">{p.projectLeader?.name ?? "—"}</td>
                <td className="p-4">{p.totalHours}</td>
                <td className="p-4">{p.allocatedHours ?? 0}</td>
                <td className="p-4 text-center">
                  <button
                    ref={(el) => {
                      buttonRefs.current[p.id] = el;
                    }}
                    onClick={(e) => handleMenuOpen(e, p.id)}
                    className="p-1 rounded-full hover:bg-gray-200 transition"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rendered outside the table so it never triggers scroll */}
      {openMenuId !== null && (
        <div
          ref={menuRef}
          className="fixed w-32 bg-white rounded-lg shadow-lg border z-50"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button
            onClick={() => {
              const p = projects.find((p) => p.id === openMenuId);
              setOpenMenuId(null);
              if (p) onEdit?.(p);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Redigera
          </button>
          <button
            onClick={() => {
              const p = projects.find((p) => p.id === openMenuId);
              setOpenMenuId(null);
              if (p) onDelete?.(p);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
          >
            Ta bort
          </button>
        </div>
      )}
    </>
  );
};

export default TableView;
