import React, { useState } from "react";
import CustomerActions from "./CustomerActions";
import Modal from "../ui/Modal";
import axios from "axios";
import { User, MapPin, Phone, Mail } from "lucide-react";

interface Props {
  onClientCreated?: () => void;
}

interface FormData {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  ongoingProjects: number;
}

interface ContactPersonForm {
  name: string;
  email: string;
  phoneNumber: string;
}

const inputFields = [
  { name: "name", placeholder: "Namn", type: "text", icon: User },
  { name: "address", placeholder: "Adress", type: "text", icon: MapPin },
  {
    name: "phoneNumber",
    placeholder: "Telefonnummer",
    type: "text",
    icon: Phone,
  },
  { name: "email", placeholder: "E-postadress", type: "email", icon: Mail },
] as const;

const contactFields = [
  {
    name: "name",
    placeholder: "Kontaktperson - namn",
    type: "text",
    icon: User,
  },
  {
    name: "email",
    placeholder: "Kontaktperson - e-post",
    type: "email",
    icon: Mail,
  },
  {
    name: "phoneNumber",
    placeholder: "Kontaktperson - telefonnummer",
    type: "text",
    icon: Phone,
  },
] as const;

const CustomerActionsContainer: React.FC<Props> = ({ onClientCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    ongoingProjects: 0,
  });

  const [contactPerson, setContactPerson] = useState<ContactPersonForm>({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactPerson({ ...contactPerson, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Skapa klient
      const clientRes = await axios.post("http://localhost:5000/api/clients", {
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      });

      const clientId = clientRes.data.id;

      // 2️⃣ Skapa kontaktperson
      await axios.post("http://localhost:5000/api/contactPersons", {
        name: contactPerson.name,
        email: contactPerson.email,
        phoneNumber: contactPerson.phoneNumber,
        clientId,
      });

      // 3️⃣ Meddela parent att ny kund skapats – parent ansvarar för refetch
      onClientCreated?.();
      setIsOpen(false);

      setFormData({
        name: "",
        address: "",
        phoneNumber: "",
        email: "",
        ongoingProjects: 0,
      });
      setContactPerson({ name: "", email: "", phoneNumber: "" });
    } catch (err) {
      console.error("Failed to create client or contact person:", err);
      alert(
        "Något gick fel vid skapandet av klient eller kontaktperson. Kolla konsolen.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomerActions onAdd={() => setIsOpen(true)} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Lägg till kund
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Fyll i kundens uppgifter nedan
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* Kundfält */}
          {inputFields.map(({ name, placeholder, type, icon: Icon }) => (
            <div key={name} className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleTextChange}
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          ))}

          <div className="h-px bg-gray-100 my-2" />

          {/* Kontaktperson */}
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Kontaktperson
          </div>
          {contactFields.map(({ name, placeholder, type, icon: Icon }) => (
            <div key={name} className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={contactPerson[name as keyof ContactPersonForm]}
                onChange={handleContactChange}
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          ))}

          <div className="h-px bg-gray-100 my-1" />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm"
          >
            {loading ? "Sparar..." : "Skapa kund"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default CustomerActionsContainer;
