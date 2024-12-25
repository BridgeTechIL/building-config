// config/sensors.ts
export interface Sensor {
  tagId: string;
  name: string;
  type: string;
  status: 'active' | 'warning' | 'error';
}

export interface SensorType {
  id: string;
  name: string;
  description?: string;
}

export const sensorTypes: SensorType[] = [
  {
    id: 'smoke',
    name: 'Smoke Detector',
    description: 'Fire and smoke detection sensors'
  },
  {
    id: 'motion',
    name: 'Motion Sensor',
    description: 'Movement detection sensors'
  },
  {
    id: 'temp',
    name: 'Temperature Sensor',
    description: 'Environmental temperature monitoring'
  },
  {
    id: 'water',
    name: 'Water Leak Detector',
    description: 'Water leak detection sensors'
  }
];

export const sensors: Sensor[] = [
  {
    tagId: 'S001',
    name: 'Smoke Sensor 1F-A',
    type: 'smoke',
    status: 'active'
  },
  {
    tagId: 'S002',
    name: 'Motion Detector 2F-B',
    type: 'motion',
    status: 'active'
  },
  {
    tagId: 'S003',
    name: 'Temp Monitor 1F-C',
    type: 'temp',
    status: 'warning'
  },
  {
    tagId: 'S004',
    name: 'Water Sensor B1-A',
    type: 'water',
    status: 'active'
  },
  {
    tagId: 'S005',
    name: 'Smoke Sensor 3F-A',
    type: 'smoke',
    status: 'error'
  }
];