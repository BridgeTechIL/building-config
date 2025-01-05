// config/sensors.ts
export interface Sensor {
  tagId: string;
  name: string;
  type: string;
  location?: {
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

export const sensors: Sensor[] = [
  {
    tagId: 'S001',
    name: 'Smoke Sensor 1F-A',
    type: 'smoke',
  },
  {
    tagId: 'S002',
    name: 'Motion Detector 2F-B',
    type: 'motion',
  },
  {
    tagId: 'S003',
    name: 'Temp Monitor 1F-C',
    type: 'temp',
  },
  {
    tagId: 'S004',
    name: 'Water Sensor B1-A',
    type: 'water',
  },
  {
    tagId: 'S005',
    name: 'Smoke Sensor 3F-A',
    type: 'smoke',
  }
];