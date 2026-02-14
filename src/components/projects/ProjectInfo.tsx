import React from "react";
import type { Project } from "./ProjectTable";
interface ProjectInfoProps {
  project: Project;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-2 gap-6 bg-gray-200 p-6 rounded-xl shadow">
      <div>
        <span className="font-medium">Kund:</span> {project.customer}
      </div>

      <div>
        <span className="font-medium">Budget (h):</span> {project.budgetHours}
      </div>
      <div>
        <span className="font-medium">Start:</span> {project.startDate}
      </div>
      <div>
        <span className="font-medium">Förbrukade timmar:</span>{" "}
        {project.usedHours}
      </div>
      <div>
        <span className="font-medium">Slut:</span> {project.endDate}
      </div>
      <div>
        <span className="font-medium">Resurser:</span>{" "}
        {project.resources.join(", ")}
      </div>
    </div>
  );
};

export default ProjectInfo;
