// Stub for governance types
export interface Proposal {
  id: string;
  title: string;
  description?: string;
  status?: string;
  votes?: number;
  createdAt?: number;
  endsAt?: number;
  [key: string]: any;
}
