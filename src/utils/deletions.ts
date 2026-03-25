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

export const adjustGracePeriod = async (id: number, gracePeriodMinutes: number): Promise<void> => {
  await api.put(`/Deletions/${id}`, { gracePeriodMinutes });
};

// High-impact entities support grace period editing (min 1 day = 1440 min)
export const HIGH_IMPACT_ENTITIES: EntityType[] = ["Client", "Project", "Resource", "User" as EntityType];

export const CASCADE_INFO: Partial<Record<EntityType, string[]>> = {
  Client: [
    "Alla kundens projekt raderas",
    "Alla faser och aktiviteter inom dessa projekt raderas",
    "Kopplade kontaktpersoner avkopplas från projekten",
  ],
  Project: [
    "Alla projektets faser raderas",
    "Alla projektets aktiviteter raderas",
  ],
  Resource: [
    "Aktiviteter där resursen är den enda tilldelade resursen raderas",
  ],
};