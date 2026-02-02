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
      className="inline-flex items-center gap-2 text-black hover:text-gray-900 font-medium p-2"
    >
      <ArrowBigLeft className="w-7 h-7 rounded-full bg-gray-300 p-1 mr-2" />
      {label}
    </Link>
  );
};

export default ProjectBackLink;
