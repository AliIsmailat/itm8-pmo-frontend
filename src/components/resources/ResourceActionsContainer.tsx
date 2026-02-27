import React, { useState } from "react";
import ResourceActions from "./ResourceActions";
import Modal from "../ui/Modal";
import axios from "axios";
import { User, MapPin, Layers, X } from "lucide-react";

interface Props {
  onResourceCreated?: () => void;
}

interface FormData {
  name: string;
  location: string;
  clLevel: string;
}

const clLevels = ["CL1", "CL2", "CL3", "CL4", "CL5"];

const ResourceActionsContainer: React.FC<Props> = ({ onResourceCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    clLevel: "CL1",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(/,$/, "");
      if (trimmed && !skills.includes(trimmed)) {
        setSkills((prev) => [...prev, trimmed]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/Resources", {
        name: formData.name,
        location: formData.location,
        clLevel: formData.clLevel,
        skills: skills.map((name) => ({ id: null, name })),
      });

      onResourceCreated?.();
      setIsOpen(false);
      setFormData({ name: "", location: "", clLevel: "CL1" });
      setSkills([]);
      setSkillInput("");
    } catch (err) {
      console.error("Failed to create resource:", err);
      alert("Något gick fel vid skapandet av resursen. Kolla konsolen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResourceActions onAdd={() => setIsOpen(true)} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Lägg till resurs
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Fyll i resursens uppgifter nedan
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* Namn */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Namn"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Ort */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              placeholder="Ort"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* CL-nivå */}
          <select
            name="clLevel"
            value={formData.clLevel}
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            {clLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <div className="h-px bg-gray-100 my-2" />

          {/* Kompetenser */}
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Kompetenser
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Layers className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Skriv en kompetens och tryck Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-lg"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-purple-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="h-px bg-gray-100 my-1" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm"
          >
            {loading ? "Sparar..." : "Skapa resurs"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ResourceActionsContainer;
