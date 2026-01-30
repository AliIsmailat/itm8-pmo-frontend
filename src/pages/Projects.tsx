import React from "react";
import PageHeader from "../components/PageHeader";

const Projects: React.FC = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Projekt"
        description="Hantera alla projekt och resursfördelningar..."
      />
    </div>
  );
};

export default Projects;
