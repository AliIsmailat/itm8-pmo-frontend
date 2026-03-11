import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import axios from "axios";
import { User, MapPin, Phone, Mail, Plus, Trash2 } from "lucide-react";
import { updateClient } from "../../utils/clients";
import type { Customer } from "./CustomerList";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onClientCreated?: () => void;
  onClientUpdated?: () => void;
  editingCustomer?: Customer | null;
  onEditClose?: () => void;
}

interface ClientFormData {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}

interface ContactPersonForm {
  name: string;
  email: string;
  phoneNumber: string;
}

const emptyContact = (): ContactPersonForm => ({
  name: "",
  email: "",
  phoneNumber: "",
});

const inputClass =
  "w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";

const CustomerActionsContainer: React.FC<Props> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  onClientCreated,
  onClientUpdated,
  editingCustomer,
  onEditClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen || internalIsOpen;
  const [loading, setLoading] = useState(false);
  const isEditing = !!editingCustomer;

  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
  });
  const [contactPersons, setContactPersons] = useState<ContactPersonForm[]>([]);

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name,
        address: editingCustomer.address,
        phoneNumber: editingCustomer.phoneNumber,
        email: editingCustomer.email,
      });
      setInternalIsOpen(true);
    }
  }, [editingCustomer]);

  const reset = () => {
    setFormData({ name: "", address: "", phoneNumber: "", email: "" });
    setContactPersons([]);
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    externalOnClose?.();
    reset();
    onEditClose?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const updateCp = (
    index: number,
    field: keyof ContactPersonForm,
    value: string,
  ) =>
    setContactPersons((prev) =>
      prev.map((cp, i) => (i === index ? { ...cp, [field]: value } : cp)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && editingCustomer) {
        await updateClient(editingCustomer.id, formData);
        onClientUpdated?.();
      } else {
        const res = await axios.post<{ id: number }>(
          "http://localhost:5000/api/clients",
          formData,
        );
        const clientId = res.data.id;

        await Promise.all(
          contactPersons
            .filter((cp) => cp.name.trim())
            .map((cp) =>
              axios.post("http://localhost:5000/api/contactPersons", {
                name: cp.name,
                email: cp.email,
                phoneNumber: cp.phoneNumber,
                clientId,
              }),
            ),
        );

        onClientCreated?.();
      }
      handleClose();
    } catch (err) {
      console.error("Failed to save client:", err);
      alert("Något gick fel. Kolla konsolen.");
    } finally {
      setLoading(false);
    }
  };

  const clientFields = [
    { name: "name" as const, placeholder: "Namn", type: "text", icon: User },
    {
      name: "email" as const,
      placeholder: "E-postadress",
      type: "email",
      icon: Mail,
    },
    {
      name: "phoneNumber" as const,
      placeholder: "Telefonnummer",
      type: "text",
      icon: Phone,
    },
    {
      name: "address" as const,
      placeholder: "Adress",
      type: "text",
      icon: MapPin,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? "Redigera kund" : "Lägg till kund"}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {isEditing
            ? "Uppdatera kundens uppgifter"
            : "Fyll i kundens uppgifter nedan"}
        </p>
      </div>

      <form
        className="flex flex-col gap-3 max-h-[78vh] overflow-y-auto px-1 pb-2"
        onSubmit={handleSubmit}
      >
        {clientFields.map(({ name, placeholder, type, icon: Icon }) => (
          <div key={name} className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Icon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        ))}

        {!isEditing && (
          <>
            <div className="h-px bg-gray-100 my-1" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Kontaktpersoner
              </span>
              <button
                type="button"
                onClick={() =>
                  setContactPersons((prev) => [...prev, emptyContact()])
                }
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Lägg till
              </button>
            </div>

            {contactPersons.length === 0 && (
              <p className="text-xs text-gray-400">
                Inga kontaktpersoner — valfritt
              </p>
            )}

            {contactPersons.map((cp, i) => (
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
                    onClick={() =>
                      setContactPersons((prev) =>
                        prev.filter((_, j) => j !== i),
                      )
                    }
                    className="text-gray-300 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {[
                  {
                    icon: User,
                    placeholder: "Namn",
                    field: "name" as const,
                    type: "text",
                  },
                  {
                    icon: Mail,
                    placeholder: "E-post",
                    field: "email" as const,
                    type: "email",
                  },
                  {
                    icon: Phone,
                    placeholder: "Telefon",
                    field: "phoneNumber" as const,
                    type: "tel",
                  },
                ].map(({ icon: Icon, placeholder, field, type }) => (
                  <div key={field} className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={cp[field]}
                      onChange={(e) => updateCp(i, field, e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        <div className="h-px bg-gray-100 my-1" />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm"
        >
          {loading ? "Sparar..." : isEditing ? "Spara ändringar" : "Skapa kund"}
        </button>
      </form>
    </Modal>
  );
};

export default CustomerActionsContainer;
