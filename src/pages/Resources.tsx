import React, { useState } from "react";
import PageHeader from "../components/ui/PageHeader.tsx";
import ResourceCard from "../components/resources/ResourceCard.tsx";
import ResourceActions from "../components/resources/ResourceActions.tsx";
import Pagination from "../components/projects/Pagination.tsx";

const resources = [
  {
    name: "Alice",
    role: "Web Dev",
    email: "alice@example.com",
    phone: "070-1234567",
    ongoingProjects: 3,
    skills: ["React", "TypeScript", "Tailwind"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
  {
    name: "Bob",
    role: "Designer",
    email: "bob@example.com",
    phone: "070-7654321",
    ongoingProjects: 2,
    skills: ["Figma", "Adobe XD"],
  },
];

const Resources: React.FC = () => {
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = resources.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="p-8 flex flex-col gap-6">
      <PageHeader
        title="Resurser"
        description="Hantera teammedlemmar och deras tilldelning..."
      />

      <ResourceActions />

      <div className="flex justify-center flex-wrap gap-10">
        {paginatedResources.map((res, index) => (
          <ResourceCard key={`${res.email}-${index}`} {...res} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Resources;
