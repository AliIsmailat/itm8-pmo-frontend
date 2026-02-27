import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FilteredProjects from "../components/projects/FilteredProjects";
import { projects as allProjects } from "../dummyProjects";
import type { Project } from "../components/projects/ProjectTable";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const customerId = query.get("customerId");

  const filteredProjects: Project[] = customerId
    ? allProjects.filter((p) => p.customerId === Number(customerId))
    : allProjects;

  const customerName = customerId ? filteredProjects[0]?.customer : undefined;

  return (
    <FilteredProjects
      projects={filteredProjects}
      customerName={customerName}
      onSelectProject={(project) => navigate(`/projects/${project.id}`)}
    />
  );
};

export default Projects;
