export type UUID = string;

export type DeletionRequestStatus =
  | "new"
  | "pending"
  | "submitted"
  | "complete"
  | "rejected";

export interface Target {
  id: UUID;
  name: string;
  website?: string | null;
}

export interface DeletionRequest {
  id: UUID;
  user_id: UUID;
  target_id: UUID;
  status: DeletionRequestStatus;
  reference_code: string | null;
  created_at: string; // ISO string
}
