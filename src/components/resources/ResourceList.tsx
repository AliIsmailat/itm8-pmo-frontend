import React from "react";
import ResourceCard from "./ResourceCard";

export interface ResourceItem {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  email: string;
  clLevel: string;
  skills: { id: number; name: string }[];
  ongoingProjects: number;
}

interface Props {
  resources: ResourceItem[];
  onEdit: (resource: ResourceItem) => void;
  onDelete: (resource: ResourceItem) => void;
}

const ResourceList: React.FC<Props> = ({ resources, onEdit, onDelete }) => {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {resources.map((r) => (
        <ResourceCard
          key={r.id}
          {...r}
          onEdit={() => onEdit(r)}
          onDelete={() => onDelete(r)}
        />
      ))}
    </div>
  );
};

export default ResourceList;
