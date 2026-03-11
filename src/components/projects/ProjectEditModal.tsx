import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import {
  User,
  Calendar,
  Clock,
  Mail,
  Phone,
  Plus,
  Trash2,
  Building2,
  Search,
  ChevronDown,
} from "lucide-react";
import { updateProject } from "../../utils/projects";
import type { Project } from "../../utils/projects";
import type { ContactPerson } from "../../utils/clients";
import { getResources } from "../../utils/resources";
import type { Resource } from "../../utils/resources";
import axios from "axios";

const CONTACT_URL = "http://localhost:5000/api/contactPersons";
const RESOURCE_PAGE_SIZE = 8;

async function getContactPersonsByClientId(
  clientId: number,
): Promise<ContactPerson[]> {
  try {
    const res = await axios.get<ContactPerson[]>(
      `${CONTACT_URL}/by-client/${clientId}`,
    );
    return res.data;
  } catch {
    return [];
  }
}

interface Props {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}

interface ContactEntry {
  mode: "existing" | "new";
  existingId?: number;
  newData: { name: string; email: string; phoneNumber: string };
}

const emptyEntry = (): ContactEntry => ({
  mode: "existing",
  existingId: undefined,
  newData: { name: "", email: "", phoneNumber: "" },
});

const inputClass =
  "w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";
const plainInputClass =
  "w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";

const ProjectEditModal: React.FC<Props> = ({
  isOpen,
  project,
  onClose,
  onSaved,
}) => {
  const [loading, setLoading] = useState(false);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [clientContactPersons, setClientContactPersons] = useState<
    ContactPerson[]
  >([]);
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceShowAll, setResourceShowAll] = useState(false);
  const [resourceError, setResourceError] = useState(false);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [projectLeaderId, setProjectLeaderId] = useState<number | "">("");
  const [selectedResourceIds, setSelectedResourceIds] = useState<number[]>([]);
  const [contactEntries, setContactEntries] = useState<ContactEntry[]>([]);

  useEffect(() => {
    if (!isOpen || !project) return;
    getResources().then(setAllResources).catch(console.error);
    getContactPersonsByClientId(project.client.id)
      .then(setClientContactPersons)
      .catch(console.error);
    setName(project.name);
    setStartDate(project.startDate.slice(0, 10));
    setEndDate(project.endDate.slice(0, 10));
    setTotalHours(String(project.totalHours));
    setProjectLeaderId(project.projectLeader?.id ?? "");
    setSelectedResourceIds((project.resources ?? []).map((r) => r.id));
    setContactEntries(
      (project.contactPersons ?? []).length > 0
        ? (project.contactPersons ?? []).map((cp) => ({
            mode: "existing" as const,
            existingId: cp.id,
            newData: { name: "", email: "", phoneNumber: "" },
          }))
        : [],
    );
    setResourceSearch("");
    setResourceShowAll(false);
    setResourceError(false);
  }, [isOpen, project]);

  const toggleResource = (id: number) => {
    setResourceError(false);
    setSelectedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const updateEntry = (index: number, patch: Partial<ContactEntry>) =>
    setContactEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );

  const updateNewData = (
    index: number,
    patch: Partial<ContactEntry["newData"]>,
  ) =>
    setContactEntries((prev) =>
      prev.map((e, i) =>
        i === index ? { ...e, newData: { ...e.newData, ...patch } } : e,
      ),
    );

  const removeEntry = (index: number) =>
    setContactEntries((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    if (selectedResourceIds.length === 0) {
      setResourceError(true);
      return;
    }
    setLoading(true);
    try {
      await updateProject(project.id, {
        name,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalHours: Number(totalHours),
        projectLeaderId: projectLeaderId as number,
        resources: selectedResourceIds.map((id) => ({ resourceId: id })),
        contactPersons: [
          ...contactEntries
            .filter((e) => e.mode === "existing" && e.existingId)
            .map((e) => ({ contactPersonId: e.existingId })),
          ...contactEntries
            .filter((e) => e.mode === "new")
            .map((e) => ({
              contactPersonId: null,
              newContactPerson: {
                name: e.newData.name,
                email: e.newData.email,
                phoneNumber: e.newData.phoneNumber,
                clientId: project.client.id,
              },
            })),
        ],
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save project:", err);
      alert("Något gick fel. Kolla konsolen.");
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  const filteredResources = allResources.filter((r) =>
    `${r.name} ${r.email ?? ""}`
      .toLowerCase()
      .includes(resourceSearch.toLowerCase()),
  );
  const visibleResources = resourceShowAll
    ? filteredResources
    : filteredResources.slice(0, RESOURCE_PAGE_SIZE);
  const hiddenCount = filteredResources.length - visibleResources.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="w-[40rem]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Redigera projekt
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Uppdatera projektets uppgifter
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto px-1 pb-2"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Projektnamn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="number"
            placeholder="Totala timmar"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            min={0}
            required
            className={inputClass}
          />
        </div>

        <div className="h-px bg-gray-100" />
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Kund & Projektledare
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={project.client?.name ?? ""}
            disabled
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <select
            value={projectLeaderId}
            onChange={(e) => setProjectLeaderId(Number(e.target.value) || "")}
            required
            className={`${inputClass} appearance-none`}
          >
            <option value="">Välj projektledare</option>
            {allResources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-px bg-gray-100" />
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Resurser
        </div>

        {resourceError && (
          <p className="text-xs text-red-500 -mt-2">
            Minst en resurs måste väljas.
          </p>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Sök namn eller e-post..."
            value={resourceSearch}
            onChange={(e) => {
              setResourceSearch(e.target.value);
              setResourceShowAll(false);
            }}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleResources.map((r) => {
            const selected = selectedResourceIds.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleResource(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  selected
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${selected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {r.name[0].toUpperCase()}
                </div>
                {r.name}
              </button>
            );
          })}
          {filteredResources.length === 0 && (
            <p className="text-xs text-gray-400">
              Inga resurser matchar sökningen
            </p>
          )}
        </div>

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setResourceShowAll(true)}
            className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-medium transition self-start"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Visa {hiddenCount} fler resurser
          </button>
        )}
        {resourceShowAll && filteredResources.length > RESOURCE_PAGE_SIZE && (
          <button
            type="button"
            onClick={() => setResourceShowAll(false)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition self-start"
          >
            Visa färre
          </button>
        )}
        {selectedResourceIds.length > 0 && (
          <p className="text-xs text-purple-600 font-medium -mt-1">
            {selectedResourceIds.length} resurs
            {selectedResourceIds.length !== 1 ? "er" : ""} vald
            {selectedResourceIds.length !== 1 ? "a" : ""}
          </p>
        )}

        <div className="h-px bg-gray-100" />
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Kontaktpersoner
          </div>
          <button
            type="button"
            onClick={() => setContactEntries((prev) => [...prev, emptyEntry()])}
            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Lägg till
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {contactEntries.length === 0 && (
            <p className="text-xs text-gray-400">Inga kontaktpersoner</p>
          )}
          {contactEntries.map((entry, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Kontaktperson {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeEntry(i)}
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
                {(["existing", "new"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      updateEntry(i, { mode, existingId: undefined })
                    }
                    className={`flex-1 py-1.5 font-medium transition ${entry.mode === mode ? "bg-purple-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    {mode === "existing" ? "Befintlig" : "Ny"}
                  </button>
                ))}
              </div>
              {entry.mode === "existing" ? (
                <select
                  value={entry.existingId ?? ""}
                  onChange={(e) =>
                    updateEntry(i, {
                      existingId: Number(e.target.value) || undefined,
                    })
                  }
                  className={plainInputClass}
                >
                  <option value="">
                    {clientContactPersons.length === 0
                      ? "Inga kontaktpersoner för denna kund"
                      : "Välj kontaktperson"}
                  </option>
                  {clientContactPersons.map((cp) => (
                    <option key={cp.id} value={cp.id}>
                      {cp.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex flex-col gap-2">
                  {[
                    {
                      icon: <User className="w-3.5 h-3.5 text-gray-400" />,
                      placeholder: "Namn",
                      field: "name" as const,
                    },
                    {
                      icon: <Mail className="w-3.5 h-3.5 text-gray-400" />,
                      placeholder: "E-post",
                      field: "email" as const,
                    },
                    {
                      icon: <Phone className="w-3.5 h-3.5 text-gray-400" />,
                      placeholder: "Telefon",
                      field: "phoneNumber" as const,
                    },
                  ].map(({ icon, placeholder, field }) => (
                    <div key={field} className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        {icon}
                      </div>
                      <input
                        placeholder={placeholder}
                        value={entry.newData[field]}
                        onChange={(e) =>
                          updateNewData(i, { [field]: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-100" />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm"
        >
          {loading ? "Sparar..." : "Spara ändringar"}
        </button>
      </form>
    </Modal>
  );
};

export default ProjectEditModal;
