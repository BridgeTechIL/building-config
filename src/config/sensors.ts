export interface Sensor {
    tagId: string;
    name: string;
    type: string;
  }
  
  export interface SensorType {
    id: string;
    name: string;
  }
  
  export const sensors: Sensor[] = [
    { tagId: 'S1', name: 'Sensor 1', type: 'T1' },
    { tagId: 'S2', name: 'Sensor 2', type: 'T2' },
    // Add more sensors as needed
  ];
  
  export const sensorTypes: SensorType[] = [
    { id: 'T1', name: 'Smoke Detector' },
    { id: 'T2', name: 'Flood Sensor' },
    // Add more sensor types as needed
  ];