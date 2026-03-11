import axios from "axios";

const API_URL = "http://localhost:5000/api/Activities";
const DELETIONS_URL = "http://localhost:5000/api/Deletions";

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
  const res = await axios.get<Activity[]>(`${API_URL}/by-project/${projectId}`);
  return res.data;
};

export const createActivity = async (data: ActivityCreateDto): Promise<Activity> => {
  const res = await axios.post<Activity>(API_URL, data);
  return res.data;
};

export const updateActivity = async (id: number, data: ActivityUpdateDto): Promise<Activity> => {
  const res = await axios.put<Activity>(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  try {
    await axios.post(
      `${DELETIONS_URL}/activity/${id}`,
      { gracePeriodMinutes: 1440 },
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data : err;
    console.error("Delete activity error response:", message);
    throw err;
  }
};