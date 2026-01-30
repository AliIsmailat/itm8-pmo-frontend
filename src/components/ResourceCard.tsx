import React from "react";
import { Mail, Phone } from "lucide-react";

interface ResourceCardProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  ongoingProjects: number;
  skills: string[];
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  name,
  role,
  email,
  phone,
  ongoingProjects,
  skills,
}) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-100 shadow-lg rounded-lg p-6 relative w-[24rem] flex flex-col gap-4">
      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-lg">
        {initial}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold">{name}</span>
        <span className="text-sm text-gray-500">{role}</span>
      </div>

      <div className="flex flex-col gap-1 text-gray-700">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{phone}</span>
        </div>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>Pågående projekt: {ongoingProjects}</span>
      </div>

      <div className="text-gray-700">
        <span className="font-medium">Kompetenser:</span>{" "}
        <span>{skills.join(", ") || "—"}</span>
      </div>
    </div>
  );
};

export default ResourceCard;
