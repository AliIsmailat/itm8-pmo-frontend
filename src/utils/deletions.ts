import axios from "axios";

const API_URL = "http://localhost:5000/api/Deletions";

export type DeletionStatus = "Pending" | "Completed" | "Cancelled";

export type EntityType =
  | "Project"
  | "Activity"
  | "Phase"
  | "Resource"
  | "Client"
  | "ContactPerson";

export interface PendingDeletion {
  id: number;
  entityType: EntityType;
  entityId: number;
  entityName?: string;
  requestedAt: string;
  scheduledDeletionAt: string;
  status: DeletionStatus;
  timeRemaining: string;
}

export const getPendingDeletions = async (): Promise<PendingDeletion[]> => {
  const res = await axios.get<PendingDeletion[]>(`${API_URL}/pending`);
  return res.data;
};


export const cancelDeletion = async (id: number): Promise<void> => {
  await axios.post(`${API_URL}/${id}/cancel`);
};