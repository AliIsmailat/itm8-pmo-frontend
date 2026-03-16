import api from "./axiosInstance";
import axios from "axios";

// ─── Response shapes ─────────────────────────────────────────────────────────

export interface ProjectResource {
  id: number;
  name: string;
  hoursSpent?: number | null;
  totalHoursSpent?: number | null;
  email?: string | null;
  location?: string | null;
}

export interface ProjectContactPerson {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface Phase {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  projectId: number;
}

export type ActivityStatus =
  | "NotStarted"
  | "InProgress"
  | "Completed"
  | "OnHold"
  | "Cancelled";

export interface Activity {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  status: ActivityStatus;
  resources: ProjectResource[];
}

export interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  allocatedHours: number;
  client: { id: number; name: string };
  projectLeader: { id: number; name: string; hoursSpent?: number | null; totalHoursSpent?: number | null };
  contactPersons: ProjectContactPerson[];
  resources: ProjectResource[];
  phases: Phase[];
  activities: Activity[];
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface ProjectContactPersonDto {
  contactPersonId?: number | null;
  newContactPerson?: {
    name: string;
    email: string;
    phoneNumber: string;
    clientId: number;
  } | null;
}

export interface ProjectCreateDto {
  name: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  clientId: number;
  projectLeaderId: number;
  contactPersons: ProjectContactPersonDto[];
  resources: { resourceId: number }[];
}

export interface ProjectUpdateDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  totalHours?: number;
  projectLeaderId?: number;
  contactPersons?: ProjectContactPersonDto[];
  resources?: { resourceId: number }[];
}

export interface PhaseCreateDto {
  name: string;
  startDate: string;
  endDate: string;
}

export interface PhaseUpdateDto {
  name?: string;
  startDate?: string;
  endDate?: string;
}

// ─── Project API calls ────────────────────────────────────────────────────────

export const getProjects = async (): Promise<Project[]> => {
  const res = await api.get<Project[]>("/Projects");
  return res.data;
};

export const getOvertimeProjects = async (): Promise<Project[]> => {
  const res = await api.get<Project[]>("/Projects/overtime");
  return res.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const res = await api.get<Project>(`/Projects/${id}`);
  return res.data;
};

export const createProject = async (data: ProjectCreateDto): Promise<Project> => {
  const res = await api.post<Project>("/Projects", data);
  return res.data;
};

export const updateProject = async (id: number, data: ProjectUpdateDto): Promise<Project> => {
  const res = await api.put<Project>(`/Projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await api.post(`/Deletions/project/${id}`, { gracePeriodMinutes: 1440 });
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete project error:", message);
    throw err;
  }
};

// ─── Phase API calls ──────────────────────────────────────────────────────────

export const createPhase = async (projectId: number, data: PhaseCreateDto): Promise<Phase> => {
  const res = await api.post<Phase>(`/Phases/by-project/${projectId}`, data);
  return res.data;
};

export const updatePhase = async (phaseId: number, data: PhaseUpdateDto): Promise<Phase> => {
  const res = await api.put<Phase>(`/Phases/${phaseId}`, data);
  return res.data;
};

export const getPhaseById = async (phaseId: number): Promise<Phase> => {
  const res = await api.get<Phase>(`/Phases/${phaseId}`);
  return res.data;
};

export const deletePhase = async (phaseId: number): Promise<void> => {
  try {
    await api.post(`/Deletions/phase/${phaseId}`, { gracePeriodMinutes: 1 });
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete phase error:", message);
    throw err;
  }
};