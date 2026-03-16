import api from "./axiosInstance";
import axios from "axios";

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
  const res = await api.get<Resource[]>("/Resources");
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
  await api.put(`/Resources/${id}`, data);
};

export const deleteResource = async (id: number): Promise<void> => {
  try {
    await api.post(`/Deletions/resource/${id}`, { gracePeriodMinutes: 1440 });
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete resource error:", message);
    throw err;
  }
};