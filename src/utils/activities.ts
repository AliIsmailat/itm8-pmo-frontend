import api from "./axiosInstance";
import axios from "axios";

export type ActivityStatus = "NotStarted" | "InProgress" | "Completed" | "OnHold" | "Cancelled";

export interface ActivityResource {
  id: number;
  name: string;
  hoursSpent?: number;
}

export interface Activity {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  billable: boolean;
  status: ActivityStatus;
  resources: ActivityResource[];
}

export interface ActivityCreateDto {
  name: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  billable: boolean;
  status: ActivityStatus;
  projectId: number;
  resources: { resourceId: number; hoursSpent: number | null }[];
}

export interface ActivityUpdateDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  totalHours?: number;
  billable?: boolean;
  status?: ActivityStatus;
  resources?: { resourceId: number; hoursSpent: number | null }[];
}

export const getActivitiesByProject = async (projectId: number): Promise<Activity[]> => {
  const res = await api.get<Activity[]>(`/Activities/by-project/${projectId}`);
  return res.data;
};

export const createActivity = async (data: ActivityCreateDto): Promise<Activity> => {
  const res = await api.post<Activity>("/Activities", data);
  return res.data;
};

export const updateActivity = async (id: number, data: ActivityUpdateDto): Promise<Activity> => {
  const res = await api.put<Activity>(`/Activities/${id}`, data);
  return res.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  try {
    await api.post(`/Deletions/activity/${id}`, { gracePeriodMinutes: 1440 });
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete activity error response:", message);
    throw err;
  }
};