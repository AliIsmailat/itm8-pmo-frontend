import React from "react";
import ResourceCard from "./ResourceCard";

interface Resource {
  name: string;
  role: string;
  email: string;
  phone: string;
  ongoingProjects: number;
  skills: string[];
}

interface ResourceListProps {
  resources: Resource[];
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  return (
    <>
      <div className="flex justify-center flex-wrap gap-10">
        {resources.map((res) => (
          <ResourceCard key={res.email} {...res} />
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          1
        </button>
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          2
        </button>
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          3
        </button>
      </div>
    </>
  );
};

export default ResourceList;
