import axios from "axios";

const API_URL = "http://localhost:5000/api/Resources";

export interface Skill {
  id: number;
  name: string;
}

export interface Resource {
  id: number;
  name: string;
  location: string;
  clLevel: string;
  skills: Skill[];
  projects: unknown[];
}

export const getResources = async (): Promise<Resource[]> => {
  const res = await axios.get<Resource[]>(API_URL);
  return res.data;
};

export const createResource = async (data: {
  name: string;
  location: string;
  clLevel: string;
  skills: Skill[];
}): Promise<Resource> => {
  const res = await axios.post<Resource>(API_URL, data);
  return res.data;
};