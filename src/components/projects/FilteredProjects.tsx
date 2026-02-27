import React from "react";
import ProjectTable from "./ProjectTable";
import PageHeader from "../ui/PageHeader";
import type { Project } from "./ProjectTable";

interface Props {
  projects: Project[];
  customerName?: string;
  onSelectProject: (project: Project) => void;
}

const FilteredProjects: React.FC<Props> = ({
  projects,
  customerName,
  onSelectProject,
}) => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Projekt"
        description={
          customerName
            ? `Visa projekt för kund: ${customerName}`
            : "Hantera alla projekt och resursfördelningar..."
        }
      />

      <ProjectTable projects={projects} onSelect={onSelectProject} />
    </div>
  );
};

export default FilteredProjects;
