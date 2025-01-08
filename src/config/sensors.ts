// config/sensors.ts
export interface Sensor {
  tagId: string;
  name: string;
  type: string;
  location: {
    floor_physical: number;
    xy: [number, number];
    is_exact: boolean;
  };
}

export interface SensorType {
  name: string;
  description?: string;
}

export const sensorTypes: SensorType[] = [
  {
    name: 'Smoke Detector',
    description: 'Fire and smoke detection sensors'
  },
  {
    name: 'Motion Sensor',
    description: 'Movement detection sensors'
  },
  {
    name: 'Temperature Sensor',
    description: 'Environmental temperature monitoring'
  },
  {
    name: 'Water Leak Detector',
    description: 'Water leak detection sensors'
  }
];
