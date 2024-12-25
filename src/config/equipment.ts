// config/equipment.ts
export interface Equipment {
  tagId: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
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
    tagId: 'EQ001',
    name: 'Excavator #1',
    type: 'heavy',
    status: 'active',
    groups: ['heavy']
  },
  {
    tagId: 'EQ002',
    name: 'Power Drill Set',
    type: 'power',
    status: 'active',
    groups: ['power']
  },
  {
    tagId: 'EQ003',
    name: 'Safety Harness Kit',
    type: 'safety',
    status: 'active',
    groups: ['safety']
  },
  {
    tagId: 'EQ004',
    name: 'Cement Mixer',
    type: 'heavy',
    status: 'maintenance',
    groups: ['heavy']
  },
  {
    tagId: 'EQ005',
    name: 'Circular Saw',
    type: 'power',
    status: 'active',
    groups: ['power']
  }
];