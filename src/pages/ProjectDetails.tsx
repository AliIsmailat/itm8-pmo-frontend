import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProjectInfo from "../components/ProjectInfo";
import GanttChart from "../components/GanttChart";
import ProjectBackLink from "../components/ProjectBackLink";
import type { Phase } from "../components/PhaseBlock";
import { projects } from "../dummyprojects";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === Number(id));

  if (!project) return <p>Projektet hittades inte</p>;

  const phases: Phase[] = [
    {
      name: "Förstudie",
      startWeek: 48,
      duration: 2,
      owner: "Alice",
      status: "onTime",
      color: "#8b5cf6",
    },
    {
      name: "Planering",
      startWeek: 50,
      duration: 3,
      owner: "Bob",
      status: "risk",
      color: "#22c55e",
    },
    {
      name: "Implementation",
      startWeek: 2,
      duration: 5,
      owner: "Charlie",
      status: "delayed",
      color: "#3b82f6",
    },
  ];

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title={"Projektdetailj"}
        description={"Detaljer och tilldelning av projekt"}
      />
      <div>
        <ProjectBackLink href="/projects" label="Tillbaka till projekt" />
      </div>

      <ProjectInfo project={project} />

      <GanttChart phases={phases} />
    </div>
  );
};

export default ProjectDetails;
