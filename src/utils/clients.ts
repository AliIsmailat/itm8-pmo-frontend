import axios from "axios";

const API_URL = "http://localhost:5000/api/Clients";
const DELETIONS_URL = "http://localhost:5000/api/Deletions";

export interface Client {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  projectCount?: number;
  projects?: { id: number; name: string }[];
}

export interface ContactPerson {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export const getClients = async (): Promise<Client[]> => {
  const res = await axios.get<Client[]>(API_URL);
  return res.data;
};

export const getContactPersonByClientId = async (
  clientId: number,
): Promise<ContactPerson | null> => {
  try {
    const res = await axios.get<ContactPerson[]>(
      `http://localhost:5000/api/ContactPersons/by-client/${clientId}`,
    );
    return res.data?.[0] ?? null;
  } catch {
    return null;
  }
};

export const updateClient = async (
  id: number,
  data: Omit<Client, "id" | "projectCount" | "projects">,
): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, data);
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    await axios.post(
      `${DELETIONS_URL}/client/${id}`,
      { gracePeriodMinutes: 1440 },
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete client error:", message);
    throw err;
  }
};

export const updateContactPerson = async (
  id: number,
  data: { name: string; email: string; phoneNumber: string },
): Promise<void> => {
  await axios.put(`http://localhost:5000/api/ContactPersons/${id}`, data);
};

export const deleteContactPerson = async (id: number): Promise<void> => {
  try {
    await axios.post(
      `http://localhost:5000/api/Deletions/contactperson/${id}`,
      { gracePeriodMinutes: 1440 },
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete contact person error:", message);
    throw err;
  }
};