// config/workers.ts
export interface Worker {
  id: string;
  tagId: string;
  name: string;
  role: string;
  phone?: string;
  floor_physical?: number;
  xy?: [number, number];
  groups: string[];  // Array of group IDs
}

export interface WorkerGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  color: string;
}
