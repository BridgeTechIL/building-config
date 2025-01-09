// config/equipment.ts
export interface Equipment {
  id: string;
  tagId: string;
  name: string;
  type: string;
  floor_physical?: number;
  xy?: [number, number];
  groups: string[];
}

export interface EquipmentGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}