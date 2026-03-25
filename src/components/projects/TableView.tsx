import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import type { Project } from "../../utils/projects";

interface Props {
  projects: Project[];
  filteredCount: number;
  totalCount: number;
  onSelect?: (p: Project) => void;
  onEdit?: (p: Project) => void;
  onDelete?: (p: Project) => void;
}

const fmt = (d: string) => (d ? new Date(d).toLocaleDateString("sv-SE") : "—");

// Self-contained row menu that positions itself relative to the button
const RowMenu: React.FC<{
  project: Project;
  onEdit?: (p: Project) => void;
  onDelete?: (p: Project) => void;
}> = ({ project, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit?.(project);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
          >
            Redigera
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete?.(project);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
          >
            Ta bort
          </button>
        </div>
      )}
    </div>
  );
};

const TableView: React.FC<Props> = ({
  projects,
  filteredCount,
  totalCount,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <p className="text-xs text-gray-400 mb-2 text-right">
        Visar {filteredCount} av {totalCount} projekt
      </p>

      {/* ── Mobile/tablet card list (< lg) ── */}
      <div className="flex flex-col gap-3 lg:hidden">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect?.(p)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:border-purple-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {p.name}
                </span>
                <span className="text-xs text-gray-400">
                  {p.client?.name ?? "—"}
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <RowMenu project={p} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
              <span>
                {fmt(p.startDate)} → {fmt(p.endDate)}
              </span>
              <span>{p.projectLeader?.name ?? "—"}</span>
              <span>
                {p.totalHours}h tot · {p.allocatedHours ?? 0}h allok
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table (lg+) ── */}
      <div className="hidden lg:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm text-gray-600">
              <th className="p-4 font-bold">Kund</th>
              <th className="p-4">Projekt</th>
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
                <td
                  className="p-4 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RowMenu project={p} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableView;
