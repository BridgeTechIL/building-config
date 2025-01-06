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
}

export const equipmentGroups: EquipmentGroup[] = [
  {
    id: 'heavy',
    name: 'Heavy Machinery',
    description: 'Large construction equipment'
  },
  {
    id: 'power',
    name: 'Power Tools',
    description: 'Handheld and portable power tools'
  },
  {
    id: 'safety',
    name: 'Safety Equipment',
    description: 'PPE and safety gear'
  }
];

export const equipment: Equipment[] = [
  {
    id: '1',
    tagId: 'EQ001',
    name: 'Excavator #1',
    type: 'heavy',
    groups: ['heavy']
  },
  {
    id: '2',
    tagId: 'EQ002',
    name: 'Power Drill Set',
    type: 'power',
    groups: ['power']
  },
  {
    id: '3',
    tagId: 'EQ003',
    name: 'Safety Harness Kit',
    type: 'safety',
    groups: ['safety']
  },
  {
    id: '4',
    tagId: 'EQ004',
    name: 'Cement Mixer',
    type: 'heavy',
    groups: ['heavy']
  },
  {
    id: '5',
    tagId: 'EQ005',
    name: 'Circular Saw',
    type: 'power',
    groups: ['power']
  }
];