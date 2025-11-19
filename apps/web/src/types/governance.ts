// Stub for governance types
export interface Proposal {
  id: string;
  title: string;
  description?: string;
  status?: string;
  votes?: number;
  createdAt?: number | Date;
  endsAt?: number | Date;
  [key: string]: any;
}
