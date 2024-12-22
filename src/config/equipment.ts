export interface Equipment {
    tagId: string;
    name: string;
    groups: string[];  // Array of group IDs
  }
  
  export interface EquipmentGroup {
    id: string;
    name: string;
    description?: string;
  }
  
  // Sample data
  export const equipment: Equipment[] = Array.from({ length: 10 }, (_, i) => ({
    tagId: `TAG${String(i + 1).padStart(3, '0')}`,
    name: '',  // Empty by default
    groups: []  // Empty by default
  }));
  
  export const equipmentGroups: EquipmentGroup[] = [
    {
      id: 'group1',
      name: 'Drills',
      description: ''
    },
    {
      id: 'group2',
      name: 'Fire Extinguishers',
      description: ''
    },
    {
      id: 'group3',
      name: 'Forklifts',
      description: ''
    }
  ];