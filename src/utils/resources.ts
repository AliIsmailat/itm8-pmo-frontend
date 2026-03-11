import axios from "axios";

const API_URL = "http://localhost:5000/api/Resources";
const DELETIONS_URL = "http://localhost:5000/api/Deletions";

export interface Resource {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
  email: string;
  clLevel: string;
  projectCount?: number;
  skills?: { id: number; name: string }[];
  projects?: { id: number; name: string }[];
}

export const getResources = async (): Promise<Resource[]> => {
  const res = await axios.get<Resource[]>(API_URL);
  return res.data;
};

export const updateResource = async (
  id: number,
  data: {
    name: string;
    location: string;
    phoneNumber: string;
    email: string;
    clLevel: string;
    skills: { skillId: number | null; skillName: string }[];
  },
): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, data);
};

export const deleteResource = async (id: number): Promise<void> => {
  try {
    await axios.post(
      `${DELETIONS_URL}/resource/${id}`,
      { gracePeriodMinutes: 1440 },
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete resource error:", message);
    throw err;
  }
};