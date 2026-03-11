import axios from "axios";

const API_URL = "http://localhost:5000/api/Projects";
const DELETIONS_URL = "http://localhost:5000/api/Deletions";

// ─── Response shapes ─────────────────────────────────────────────────────────

export interface ProjectResource {
  id: number;
  name: string;
  hoursSpent?: number | null;
  totalHoursSpent?: number | null;
  email?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  clLevel?: string | null;
  skills?: string[];
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
  const res = await axios.get<Project[]>(API_URL);
  return res.data;
};

export const getOvertimeProjects = async (): Promise<Project[]> => {
  const res = await axios.get<Project[]>(`${API_URL}/overtime`);
  return res.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const res = await axios.get<Project>(`${API_URL}/${id}`);
  return res.data;
};

export const createProject = async (data: ProjectCreateDto): Promise<Project> => {
  const res = await axios.post<Project>(API_URL, data);
  return res.data;
};

export const updateProject = async (id: number, data: ProjectUpdateDto): Promise<Project> => {
  const res = await axios.put<Project>(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await axios.post(
      `${DELETIONS_URL}/project/${id}`,
      { gracePeriodMinutes: 1440 },
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete project error:", message);
    throw err;
  }
};

const PHASES_URL = "http://localhost:5000/api/Phases";

// ─── Phase API calls ──────────────────────────────────────────────────────────

export const createPhase = async (projectId: number, data: PhaseCreateDto): Promise<Phase> => {
  const res = await axios.post<Phase>(`${PHASES_URL}/by-project/${projectId}`, data);
  return res.data;
};

export const updatePhase = async (phaseId: number, data: PhaseUpdateDto): Promise<Phase> => {
  const res = await axios.put<Phase>(`${PHASES_URL}/${phaseId}`, data);
  return res.data;
};

export const getPhaseById = async (phaseId: number): Promise<Phase> => {
  const res = await axios.get<Phase>(`${PHASES_URL}/${phaseId}`);
  return res.data;
};

export const deletePhase = async (phaseId: number): Promise<void> => {
  try {
    await axios.post(
      `${DELETIONS_URL}/phase/${phaseId}`,
      { gracePeriodMinutes: 1 },
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete phase error:", message);
    throw err;
  }
};