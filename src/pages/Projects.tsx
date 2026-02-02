import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProjectTable from "../components/ProjectTable";
import { projects } from "../dummyprojects";

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
