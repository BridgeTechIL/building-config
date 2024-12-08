export interface ProjectBasicInfo {
    name: string;
    installationDate: string;
    comments: string;
    status: 'draft' | 'saved';
  }
  
  export interface Floor {
    id: string;
    level: number;
    selected: boolean;
    isBase?: boolean;
    items: FloorItems;
  }
  
  export interface FloorItems {
    [key: string]: number;
    gate: number;
    motionSensor: number;
    fireDetection: number;
    waterDetection: number;
    floorDetection: number;
    smartAICamera: number;
    existingCamera: number;
    wifi: number;
    hoistDoor: number;
  }
  
  export interface Step {
    id: number;
    label: string;
    icon: 'info' | 'floors' | 'review';
  }
  
  export interface BuildingProject extends ProjectBasicInfo {
    floors: Floor[];
  }