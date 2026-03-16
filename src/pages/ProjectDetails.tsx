import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ProjectBackLink from "../components/projects/ProjectBackLink";
import ProjectDetailsContainer from "../components/projects/ProjectDetailsContainer";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Projektdetaljer"
        description="Detaljer och tilldelning av projekt"
      />
      <ProjectBackLink href="/projects" label="Tillbaka till projekt" />
      <ProjectDetailsContainer projectId={Number(id)} />
    </div>
  );
};

export default ProjectDetails;
