export interface BuildingProject {
    name: string;
    installationDate: string;
    comments: string;
    floors: Floor[];
    status: 'draft' | 'saved';
  }
  
  export interface Floor {
    level: string;
    selected: boolean;
    items: FloorItems;
  }
  
  export interface Step {
    id: number;
    label: string;
    icon: 'info' | 'floors' | 'review';
   }

  export interface FloorItems {
    [key: string]: number;
    gate: number;
    motionSensor: number;
    fireDetection: number;
    floorDetection: number;
    smartAICamera: number;
    existingCamera: number;
    wifi: number;
    hoistDoor: number;
  }
  
  export type StepType = 'basic' | 'floors' | 'review';
  
  export interface ProjectState {
    currentStep: number;
    project: BuildingProject;
  }