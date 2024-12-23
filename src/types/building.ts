export interface ProjectBasicInfo {
  name: string;
  installationDate: string;
  comments: string;
  status: 'draft' | 'saved';
}

export interface Zone {
  id: string;
  name: string;
  isWifiPoint: boolean;
  isDangerPoint: boolean;
  gateId: string;
}

export interface Floor {
  id: string;
  level: number;
  selected: boolean;
  isBase?: boolean;
  items: Record<string, number>;
  zones: Zone[];  
}

export interface Step {
  id: number;
  label: string;
  icon: 'info' | 'floors' | 'review' | 'manage';
}

export interface BuildingProject extends ProjectBasicInfo {
  floors: Floor[];
}