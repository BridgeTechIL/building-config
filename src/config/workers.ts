export interface Worker {
    tagId: string;
    name: string;
    groups: string[];  // Array of group IDs
  }
  
  export interface WorkerGroup {
    id: string;
    name: string;
    description?: string;
  }
  
  // Sample data
  export const workers: Worker[] = Array.from({ length: 10 }, (_, i) => ({
    tagId: `TAG${String(i + 1).padStart(3, '0')}`,
    name: '',  // Empty by default
    groups: []  // Empty by default
  }));
  
  export const workerGroups: WorkerGroup[] = [
    {
      id: 'group1',
      name: 'General Workers',
      description: 'Regular construction workers'
    },
    {
      id: 'group2',
      name: 'Supervisors',
      description: 'Site supervisors and managers'
    },
    {
      id: 'group3',
      name: 'Electricians',
      description: 'Certified electricians'
    }
  ];