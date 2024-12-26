// config/workers.ts
export interface Worker {
  tagId: string;
  name: string;
  role: string;
  phone?: string;
  floor_physical?: number;
  groups: string[];  // Array of group IDs
}

export interface WorkerGroup {
  id: string;
  name: string;
  description?: string;
}

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
  },
  {
    id: 'group4',
    name: 'Crane Operators',
    description: 'Specialized crane operation team'
  },
  {
    id: 'group5',
    name: 'Safety Team',
    description: 'Occupational health and safety personnel'
  }
];

export const workers: Worker[] = [
  {
    tagId: 'TAG001',
    name: 'John Smith',
    role: 'Construction Laborer',
    phone: '054-123-4567',
    groups: ['group1']
  },
  {
    tagId: 'TAG002',
    name: 'Emily Rodriguez',
    role: 'Site Supervisor',
    phone: '052-987-6543',
    groups: ['group2']
  },
  {
    tagId: 'TAG003',
    name: 'Michael Chen',
    role: 'Electrician',
    phone: '050-456-7890',
    groups: ['group3']
  },
  {
    tagId: 'TAG004',
    name: 'Sarah Johnson',
    role: 'Crane Operator',
    phone: '053-234-5678',
    groups: ['group4']
  },
  {
    tagId: 'TAG005',
    name: 'David Kim',
    role: 'Safety Inspector',
    phone: '051-345-6789',
    groups: ['group5']
  },
  {
    tagId: 'TAG006',
    name: 'Anna Petrova',
    role: 'Construction Worker',
    phone: '054-567-8901',
    groups: ['group1', 'group5']
  },
  {
    tagId: 'TAG007',
    name: 'Robert Garcia',
    role: 'Electrical Supervisor',
    phone: '052-678-9012',
    groups: ['group2', 'group3']
  },
  {
    tagId: 'TAG008',
    name: 'Lisa Wong',
    role: 'Crane Safety Specialist',
    phone: '050-789-0123',
    groups: ['group4', 'group5']
  },
  {
    tagId: 'TAG009',
    name: 'Ahmed Hassan',
    role: 'General Contractor',
    phone: '053-890-1234',
    groups: ['group1', 'group2']
  },
  {
    tagId: 'TAG010',
    name: 'Maria Silva',
    role: 'Construction Manager',
    phone: '051-901-2345',
    groups: ['group2']
  }
];