// config/buildingModel.ts
import { Zone } from '@/types/building';
import { ModelLocation, ModelZone, ModelCamera, Model3DZone } from '@/types/buildingModel';

export const defaultZoneLocations: Record<string, ModelLocation> = {
    'wifi-zone-0-0': {
        floor_physical: 0,
        xy: [25, 25],
        is_exact: true
    },
    'wifi-zone-0-1': {
        floor_physical: 0,
        xy: [75, 75],
        is_exact: true
    },
    'wifi-zone-0-2': {
        floor_physical: 0,
        xy: [25, 75],
        is_exact: true
    },
    'wifi-zone-0-3': {
        floor_physical: 0,
        xy: [75, 25],
        is_exact: true
    },
    'wifi-zone-1-0': {
        floor_physical: 1,
        xy: [25, 25],
        is_exact: true
    },
    'wifi-zone-1-1': {
        floor_physical: 1,
        xy: [75, 75],
        is_exact: true
    },
    'wifi-zone-1-2': {
        floor_physical: 1,
        xy: [25, 75],
        is_exact: true
    },
    'wifi-zone-1-3': {
        floor_physical: 1,
        xy: [75, 25],
        is_exact: true
    },
    'wifi-zone-2-0': {
        floor_physical: 2,
        xy: [25, 25],
        is_exact: true
    },
    'wifi-zone-2-1': {
        floor_physical: 2,
        xy: [75, 75],
        is_exact: true
    },
    'wifi-zone-2-2': {
        floor_physical: 2,
        xy: [25, 75],
        is_exact: true
    },
    'wifi-zone-2-3': {
        floor_physical: 2,
        xy: [75, 25],
        is_exact: true
    },
    'wifi-zone-3-0': {
        floor_physical: 3,
        xy: [25, 25],
        is_exact: true
    },
    'wifi-zone-3-1': {
        floor_physical: 3,
        xy: [75, 75],
        is_exact: true
    },
    'wifi-zone-3-2': {
        floor_physical: 3,
        xy: [25, 75],
        is_exact: true
    },
    'wifi-zone-3-3': {
        floor_physical: 3,
        xy: [75, 25],
        is_exact: true
    },
    'danger-zone-1': {
        floor_physical: 7,
        xy: [50, 70],
        is_exact: true
    },
    'normal-zone-1': {
        floor_physical: 4,
        xy: [70, 25],
        is_exact: true
    }
};

export const buildingCameras: ModelCamera[] = [
    {
        name: 'Left',
        streamUrl: 'https://player.castr.com/live_094d9a001ee811eda8c7d91f796d7ea9',
        location: {
            floor_physical: 1,
            xy: [70, 25],
            is_exact: true
        }
    },
    {
        name: 'Right',
        streamUrl: 'https://player.castr.com/live_0f4235e0186e11edaba527aa44cc5f75',
        location: {
            floor_physical: 1,
            xy: [35, 50],
            is_exact: true
        }
    },
    {
        name: 'Lobby',
        streamUrl: 'https://player.castr.com/live_4aff5df0551411edb095b3325e745ec8',
        location: {
            floor_physical: 1,
            xy: [5, 5],
            is_exact: true
        }
    }
];

// Helper functions - now exported
export function convertToModelZone(zone: Zone, location: ModelLocation): ModelZone {
    return {
        name: zone.name,
        isWifiPoint: zone.isWifiPoint,
        isDangerPoint: zone.isDangerPoint,
        gateId: zone.gateId,
        location
    };
}

export function convertZonesForModel(zones: Zone[]): ModelZone[] {
    return zones.map(zone => {
        const location = defaultZoneLocations[zone.id] || {
            floor_physical: 1,
            xy: [50, 50],
            is_exact: false
        };
        return convertToModelZone(zone, location);
    });
}

export function prepareZonesForModel(zones: Zone[]): Model3DZone[] {
    return convertZonesForModel(zones).map(zone => ({
        name: zone.name,
        is_wifi: zone.isWifiPoint,
        is_dangerous: zone.isDangerPoint,
        location: zone.location
    }));
}

export function getCamerasByFloor(floorNumber: number): ModelCamera[] {
    return buildingCameras.filter(camera =>
        camera.location.floor_physical === floorNumber
    );
}

export function getZonesByFloor(zones: Zone[], floorNumber: number): ModelZone[] {
    return convertZonesForModel(zones).filter(zone =>
        zone.location.floor_physical === floorNumber
    );
}