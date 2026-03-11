import React from "react";
import { Pencil } from "lucide-react";
import type { Project } from "../../utils/projects";

interface Props {
  project: Project;
  onEdit: () => void;
}

const fmt = (d: string) => (d ? new Date(d).toLocaleDateString("sv-SE") : "—");

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm text-gray-800">{value || "—"}</span>
  </div>
);

const ProjectInfo: React.FC<Props> = ({ project, onEdit }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-700">
          Projektinformation
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 border border-gray-200 hover:border-purple-300 px-3 py-1.5 rounded-lg transition"
        >
          <Pencil className="w-3.5 h-3.5" />
          Redigera
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-5">
        <div className="col-span-2">
          <Field label="Projektnamn" value={project.name} />
        </div>
        <Field label="Kund" value={project.client?.name} />
        <Field label="Projektledare" value={project.projectLeader?.name} />
        <Field label="Startdatum" value={fmt(project.startDate)} />
        <Field label="Slutdatum" value={fmt(project.endDate)} />
        <Field label="Totala timmar" value={`${project.totalHours}h`} />
        <Field
          label="Allokerade timmar"
          value={`${project.allocatedHours ?? 0}h`}
        />
        <Field
          label="Kontaktpersoner"
          value={
            project.contactPersons?.length > 0
              ? project.contactPersons.map((cp) => cp.name).join(", ")
              : "—"
          }
        />
      </div>
    </div>
  );
};

export default ProjectInfo;
