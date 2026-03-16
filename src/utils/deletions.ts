import api from "./axiosInstance";

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
  const res = await api.get<PendingDeletion[]>("/Deletions/pending");
  return res.data;
};

export const cancelDeletion = async (id: number): Promise<void> => {
  await api.post(`/Deletions/${id}/cancel`);
};