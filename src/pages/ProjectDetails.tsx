import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ProjectInfo from "../components/projects/ProjectInfo";
import GanttChart from "../components/ganttchart/GanttChart";
import ProjectBackLink from "../components/projects/ProjectBackLink";
// import ResourceTable from "../components/resources/ResourceTable";
// import type { Resource } from "../components/resources/ResourceTable"; // type-only import
import type { Phase } from "../components/ganttchart/PhaseBlock";
import { projects } from "../dummyProjects";

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
      resources: ["Alice", "David", "Eva"],
      status: "onTime",
      color: "#8b5cf6",
    },
    {
      name: "Planering",
      startWeek: 50,
      duration: 3,
      owner: "Bob",
      resources: ["Bob", "Frank"],
      status: "risk",
      color: "#22c55e",
    },
    {
      name: "Implementation",
      startWeek: 2,
      duration: 5,
      owner: "Charlie",
      resources: ["Charlie", "George", "Hanna"],
      status: "delayed",
      color: "#3b82f6",
    },
  ];

  // const resources: Resource[] = [
  //   {
  //     id: 1,
  //     name: "Alice",
  //     role: "Projektledare",
  //     ongoingProjects: 2,
  //     capacity: 80,
  //   },
  //   {
  //     id: 2,
  //     name: "Bob",
  //     role: "Utvecklare",
  //     ongoingProjects: 1,
  //     capacity: 40,
  //   },
  // ];

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Projektdetaljer"
        description="Detaljer och tilldelning av projekt"
      />

      <ProjectBackLink href="/projects" label="Tillbaka till projekt" />
      <ProjectInfo project={project} />
      {/* <ResourceTable resources={resources} /> */}

      <GanttChart phases={phases} />
    </div>
  );
};

export default ProjectDetails;
