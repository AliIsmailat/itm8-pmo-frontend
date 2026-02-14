import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ProjectTable from "../components/projects/ProjectTable";
import { projects } from "../dummyProjects";

const Projects: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Projekt"
        description="Hantera alla projekt och resursfördelningar..."
      />

      <ProjectTable
        projects={projects}
        onSelect={(project) => {
          navigate(`/projects/${project.id}`);
        }}
      />
    </div>
  );
};

export default Projects;
