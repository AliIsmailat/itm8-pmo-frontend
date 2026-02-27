import React from "react";
import ResourceCard from "./ResourceCard";

export interface ResourceItem {
  id: number;
  name: string;
  location: string;
  clLevel: string;
  skills: { id: number; name: string }[];
  ongoingProjects: number;
}

interface Props {
  resources: ResourceItem[];
}

const ResourceList: React.FC<Props> = ({ resources }) => {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {resources.map((r) => (
        <ResourceCard key={r.id} {...r} />
      ))}
    </div>
  );
};

export default ResourceList;
