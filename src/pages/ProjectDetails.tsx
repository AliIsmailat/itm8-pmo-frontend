import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ProjectBackLink from "../components/projects/ProjectBackLink";
import ProjectDetailsContainer from "../components/projects/ProjectDetailsContainer";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-24 flex flex-col gap-6 lg:gap-8">
      {" "}
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
