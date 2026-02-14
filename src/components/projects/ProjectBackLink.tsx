import React from "react";
import { Link } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

interface ProjectBackLinkProps {
  href: string;
  label: string;
}

const ProjectBackLink: React.FC<ProjectBackLinkProps> = ({ href, label }) => {
  return (
    <Link
      to={href}
      className={`
        inline-flex items-center gap-2 px-4 py-2
        bg-gray-200 hover:bg-gray-300
        text-black hover:text-gray-800
        font-medium rounded-lg shadow-sm
        transition-all duration-200 transform
        w-auto self-start
      `}
    >
      <ArrowBigLeft
        className="
        w-6 h-6 p-1 
        transition-transform duration-200
        group-hover:-translate-x-1
      "
      />
      {label}
    </Link>
  );
};

export default ProjectBackLink;
