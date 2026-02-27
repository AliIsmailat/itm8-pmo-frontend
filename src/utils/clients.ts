import axios from "axios";

const API_URL = "http://localhost:5000/api/clients";
const CONTACT_URL = "http://localhost:5000/api/contactPersons";

export interface Client {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  ongoingProjects?: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
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
      `${CONTACT_URL}/by-client/${clientId}`,
    );
    return res.data[0] ?? null;
  } catch {
    return null;
  }
};

export const createClient = async (data: {
  client: {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}): Promise<Client> => {
  const res = await axios.post<Client>(API_URL, data);
  return res.data;
};