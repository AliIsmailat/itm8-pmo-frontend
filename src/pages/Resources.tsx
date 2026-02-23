import React, { useState } from "react";
import PageHeader from "../components/ui/PageHeader.tsx";
import ResourceCard from "../components/resources/ResourceCard.tsx";
import ResourceActions from "../components/resources/ResourceActions.tsx";
import Pagination from "../components/projects/Pagination.tsx";

const resources = [
  {
    name: "Liam",
    role: "Frontend Dev",
    email: "liam@example.com",
    phone: "070-3412789",
    ongoingProjects: 2,
    skills: ["React", "CSS", "Vite"],
  },
  {
    name: "Sofia",
    role: "UX Designer",
    email: "sofia@example.com",
    phone: "070-5521983",
    ongoingProjects: 3,
    skills: ["Figma", "User Testing", "Prototyping"],
  },
  {
    name: "Noah",
    role: "DevOps Engineer",
    email: "noah@example.com",
    phone: "070-7739201",
    ongoingProjects: 1,
    skills: ["Docker", "AWS", "CI/CD"],
  },
  {
    name: "Emma",
    role: "QA Engineer",
    email: "emma@example.com",
    phone: "070-1192837",
    ongoingProjects: 4,
    skills: ["Cypress", "Playwright", "Automation"],
  },
  {
    name: "William",
    role: "Backend Dev",
    email: "william@example.com",
    phone: "070-6627182",
    ongoingProjects: 2,
    skills: ["Node", "MongoDB", "Express"],
  },
  {
    name: "Olivia",
    role: "Product Owner",
    email: "olivia@example.com",
    phone: "070-9081726",
    ongoingProjects: 5,
    skills: ["Scrum", "Roadmapping", "Stakeholder Mgmt"],
  },
  {
    name: "Lucas",
    role: "Mobile Dev",
    email: "lucas@example.com",
    phone: "070-3384519",
    ongoingProjects: 1,
    skills: ["React Native", "Expo", "iOS"],
  },
  {
    name: "Maja",
    role: "Data Analyst",
    email: "maja@example.com",
    phone: "070-4456129",
    ongoingProjects: 3,
    skills: ["SQL", "Power BI", "Python"],
  },
  {
    name: "Elias",
    role: "Fullstack Dev",
    email: "elias@example.com",
    phone: "070-7812390",
    ongoingProjects: 2,
    skills: ["Next.js", "Prisma", "PostgreSQL"],
  },
  {
    name: "Elias",
    role: "Fullstack Dev",
    email: "elias@example.com",
    phone: "070-7812390",
    ongoingProjects: 2,
    skills: ["Next.js", "Prisma", "PostgreSQL"],
  },
  {
    name: "Elias",
    role: "Fullstack Dev",
    email: "elias@example.com",
    phone: "070-7812390",
    ongoingProjects: 2,
    skills: ["Next.js", "Prisma", "PostgreSQL"],
  },
  {
    name: "Elias",
    role: "Fullstack Dev",
    email: "elias@example.com",
    phone: "070-7812390",
    ongoingProjects: 2,
    skills: ["Next.js", "Prisma", "PostgreSQL"],
  },
];

const Resources: React.FC = () => {
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredResources = resources.filter((r) =>
    `${r.name} ${r.role}`.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedResources = filteredResources.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="p-8 flex flex-col gap-6">
      <PageHeader
        title="Resurser"
        description="Hantera teammedlemmar och deras tilldelning..."
      />

      <ResourceActions onSearch={handleSearch} />

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
