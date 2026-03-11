import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import {
  FolderOpen,
  Calendar,
  Clock,
  User,
  Building2,
  Phone,
  Mail,
  Plus,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import { getClients } from "../../utils/clients";
import type { Client, ContactPerson } from "../../utils/clients";
import { getResources } from "../../utils/resources";
import type { Resource } from "../../utils/resources";
import { createProject } from "../../utils/projects";
import axios from "axios";

const CONTACT_URL = "http://localhost:5000/api/contactPersons";

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
  onClose: () => void;
  onProjectCreated?: () => void;
}

interface NewContactPerson {
  name: string;
  email: string;
  phoneNumber: string;
}

interface ContactPersonEntry {
  mode: "existing" | "new";
  existingId?: number;
  newData: NewContactPerson;
}

const emptyContact = (): ContactPersonEntry => ({
  mode: "existing",
  existingId: undefined,
  newData: { name: "", email: "", phoneNumber: "" },
});

const RESOURCE_PAGE_SIZE = 8;

const ProjectActionsContainer: React.FC<Props> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceShowAll, setResourceShowAll] = useState(false);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [clientId, setClientId] = useState<number | "">("");
  const [projectLeaderId, setProjectLeaderId] = useState<number | "">("");
  const [selectedResourceIds, setSelectedResourceIds] = useState<number[]>([]);
  const [contactEntries, setContactEntries] = useState<ContactPersonEntry[]>([
    emptyContact(),
  ]);
  const [resourceError, setResourceError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    getClients().then(setClients).catch(console.error);
    getResources().then(setResources).catch(console.error);
  }, [isOpen]);

  useEffect(() => {
    if (!clientId) {
      setContactPersons([]);
      return;
    }
    getContactPersonsByClientId(clientId as number)
      .then(setContactPersons)
      .catch(console.error);
  }, [clientId]);

  const toggleResource = (id: number) => {
    setResourceError(false);
    setSelectedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const updateContact = (index: number, patch: Partial<ContactPersonEntry>) =>
    setContactEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );

  const updateNewContactData = (
    index: number,
    patch: Partial<NewContactPerson>,
  ) =>
    setContactEntries((prev) =>
      prev.map((e, i) =>
        i === index ? { ...e, newData: { ...e.newData, ...patch } } : e,
      ),
    );

  const reset = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setTotalHours("");
    setClientId("");
    setProjectLeaderId("");
    setSelectedResourceIds([]);
    setContactEntries([emptyContact()]);
    setResourceSearch("");
    setResourceShowAll(false);
    setResourceError(false);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !projectLeaderId) return;
    if (selectedResourceIds.length === 0) {
      setResourceError(true);
      return;
    }
    setLoading(true);
    try {
      await createProject({
        name,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalHours: Number(totalHours),
        clientId: clientId as number,
        projectLeaderId: projectLeaderId as number,
        contactPersons: contactEntries.map((e) =>
          e.mode === "existing" && e.existingId
            ? { contactPersonId: e.existingId, newContactPerson: null }
            : {
                contactPersonId: null,
                newContactPerson: {
                  name: e.newData.name,
                  email: e.newData.email,
                  phoneNumber: e.newData.phoneNumber,
                  clientId: clientId as number,
                },
              },
        ),
        resources: selectedResourceIds.map((id) => ({ resourceId: id })),
      });
      onProjectCreated?.();
      handleClose();
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Något gick fel vid skapandet av projektet. Kolla konsolen.");
    } finally {
      setLoading(false);
    }
  };

  const iconInput =
    "w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";
  const plainInput =
    "w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";

  const SectionLabel = ({ text }: { text: string }) => (
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
      {text}
    </div>
  );

  const filteredResources = resources.filter((r) =>
    `${r.name} ${r.email ?? ""}`
      .toLowerCase()
      .includes(resourceSearch.toLowerCase()),
  );
  const visibleResources = resourceShowAll
    ? filteredResources
    : filteredResources.slice(0, RESOURCE_PAGE_SIZE);
  const hiddenCount = filteredResources.length - visibleResources.length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="w-[38rem]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Skapa projekt</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Fyll i projektets uppgifter nedan
        </p>
      </div>

      <form
        className="flex flex-col gap-4 max-h-[78vh] overflow-y-auto px-1 pt-1 pb-2"
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FolderOpen className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Projektnamn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={iconInput}
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
              className={iconInput}
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
              className={iconInput}
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
            className={iconInput}
          />
        </div>

        <div className="h-px bg-gray-100 my-1" />
        <SectionLabel text="Kund & Projektledare" />

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
          <select
            value={clientId}
            onChange={(e) => setClientId(Number(e.target.value) || "")}
            required
            className={`${iconInput} appearance-none`}
          >
            <option value="">Välj kund</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <select
            value={projectLeaderId}
            onChange={(e) => setProjectLeaderId(Number(e.target.value) || "")}
            required
            className={`${iconInput} appearance-none`}
          >
            <option value="">Välj projektledare</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-px bg-gray-100 my-1" />
        <SectionLabel text="Resurser" />

        {resourceError && (
          <p className="text-xs text-red-500 -mt-2">
            Minst en resurs måste väljas.
          </p>
        )}

        {/* Resource search */}
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
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    selected
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
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

        <div className="h-px bg-gray-100 my-1" />
        <SectionLabel text="Kontaktpersoner" />

        {contactEntries.map((entry, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Kontaktperson {index + 1}
              </span>
              {contactEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setContactEntries((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
              {(["existing", "new"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateContact(index, { mode })}
                  className={`flex-1 py-1.5 font-medium transition ${
                    entry.mode === mode
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {mode === "existing" ? "Befintlig" : "Ny"}
                </button>
              ))}
            </div>

            {entry.mode === "existing" ? (
              <select
                value={entry.existingId ?? ""}
                onChange={(e) =>
                  updateContact(index, {
                    existingId: Number(e.target.value) || undefined,
                  })
                }
                className={plainInput}
              >
                <option value="">
                  {!clientId
                    ? "Välj en kund först"
                    : contactPersons.length === 0
                      ? "Inga kontaktpersoner för vald kund"
                      : "Välj kontaktperson"}
                </option>
                {contactPersons.map((cp) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex flex-col gap-2">
                {[
                  {
                    icon: <User className="w-4 h-4 text-gray-400" />,
                    placeholder: "Namn",
                    field: "name" as const,
                    type: "text",
                  },
                  {
                    icon: <Mail className="w-4 h-4 text-gray-400" />,
                    placeholder: "E-post",
                    field: "email" as const,
                    type: "email",
                  },
                  {
                    icon: <Phone className="w-4 h-4 text-gray-400" />,
                    placeholder: "Telefon",
                    field: "phoneNumber" as const,
                    type: "tel",
                  },
                ].map(({ icon, placeholder, field, type }) => (
                  <div key={field} className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      {icon}
                    </div>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={entry.newData[field]}
                      onChange={(e) =>
                        updateNewContactData(index, { [field]: e.target.value })
                      }
                      className={iconInput}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => setContactEntries((prev) => [...prev, emptyContact()])}
          className="flex items-center gap-2 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          Lägg till kontaktperson
        </button>

        <div className="h-px bg-gray-100 my-1" />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm"
        >
          {loading ? "Sparar..." : "Skapa projekt"}
        </button>
      </form>
    </Modal>
  );
};

export default ProjectActionsContainer;
