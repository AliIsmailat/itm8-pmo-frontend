import api from "./axiosInstance";
import axios from "axios";

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
  const res = await api.get<Client[]>("/Clients");
  return res.data;
};

export const getContactPersonByClientId = async (
  clientId: number,
): Promise<ContactPerson | null> => {
  try {
    const res = await api.get<ContactPerson[]>(
      `/ContactPersons/by-client/${clientId}`,
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
  await api.put(`/Clients/${id}`, data);
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    await api.post(`/Deletions/client/${id}`, { gracePeriodMinutes: 1440 });
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
  await api.put(`/ContactPersons/${id}`, data);
};

export const deleteContactPerson = async (id: number): Promise<void> => {
  try {
    await api.post(`/Deletions/contactperson/${id}`, { gracePeriodMinutes: 1440 });
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete contact person error:", message);
    throw err;
  }
};