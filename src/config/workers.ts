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
    id: '1',
    tagId: 'TAG001',
    name: 'John Smith',
    role: 'Construction Laborer',
    phone: '054-123-4567',
    groups: ['group1']
  },
  {
    id: '2',
    tagId: 'TAG002',
    name: 'Emily Rodriguez',
    role: 'Site Supervisor',
    phone: '052-987-6543',
    groups: ['group2']
  },
  {
    id: '3',
    tagId: 'TAG003',
    name: 'Michael Chen',
    role: 'Electrician',
    phone: '050-456-7890',
    groups: ['group3']
  },
  {
    id: '4',
    tagId: 'TAG004',
    name: 'Sarah Johnson',
    role: 'Crane Operator',
    phone: '053-234-5678',
    groups: ['group4']
  },
  {
    id: '5',
    tagId: 'TAG005',
    name: 'David Kim',
    role: 'Safety Inspector',
    phone: '051-345-6789',
    groups: ['group5']
  },
  {
    id: '6',
    tagId: 'TAG006',
    name: 'Anna Petrova',
    role: 'Construction Worker',
    phone: '054-567-8901',
    groups: ['group1', 'group5']
  },
  {
    id: '7',
    tagId: 'TAG007',
    name: 'Robert Garcia',
    role: 'Electrical Supervisor',
    phone: '052-678-9012',
    groups: ['group2', 'group3']
  },
  {
    id: '8',
    tagId: 'TAG008',
    name: 'Lisa Wong',
    role: 'Crane Safety Specialist',
    phone: '050-789-0123',
    groups: ['group4', 'group5']
  },
  {
    id: '9',
    tagId: 'TAG009',
    name: 'Ahmed Hassan',
    role: 'General Contractor',
    phone: '053-890-1234',
    groups: ['group1', 'group2']
  },
  {
    id: '10',
    tagId: 'TAG010',
    name: 'Maria Silva',
    role: 'Construction Manager',
    phone: '051-901-2345',
    groups: ['group2']
  }
];