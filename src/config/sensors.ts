// config/sensors.ts
export interface Sensor {
  id: string;
  tagId: string;
  name: string;
  floor_name: string;
  type: string;
  location: {
    floor_physical: number;
    xy: [number, number];
    is_exact: boolean;
  };
}

export interface SensorType {
  id: string;
  name: string;
  description?: string;
}

export const sensorTypes: SensorType[] = [
  {
    id: '1',
    name: 'Smoke Detector',
    description: 'Fire and smoke detection sensors'
  },
  {
    id: '2',
    name: 'Motion Sensor',
    description: 'Movement detection sensors'
  },
  {
    id: '3',
    name: 'Temperature Sensor',
    description: 'Environmental temperature monitoring'
  },
  {
    id: '4',
    name: 'Water Leak Detector',
    description: 'Water leak detection sensors'
  }
];
