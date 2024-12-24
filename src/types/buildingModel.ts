import { Zone } from '@/types/building';

export interface ModelLocation {
    floor_physical: number;
    xy: [number, number];
    is_exact: boolean;
}

export interface ModelZone extends Omit<Zone, 'id'> {
    location: ModelLocation;
}

export interface ModelCamera {
    name: string;
    streamUrl: string;
    location: ModelLocation;
}

export interface Model3DZone {
    name: string;
    is_wifi: boolean;
    is_dangerous: boolean;
    location: ModelLocation;
}