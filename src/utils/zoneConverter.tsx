import { Zone, Floor } from '@/types/building';


export function convertIframeZonesToFloorZones(iframeZones: { name: string; is_wifi: boolean; is_dangerous: boolean; location: { floor_physical: number; xy: [number, number]; is_exact: boolean } }[]) {
    const floorZones: { [floorId: string]: Zone[] } = {};

    iframeZones.forEach((zone, index) => {
        const floorId = String(zone.location.floor_physical);
        if (!floorZones[floorId]) {
            floorZones[floorId] = [];
        }

        floorZones[floorId].push({
            id: `zone-${index}`,
            name: zone.name,
            isWifiPoint: zone.is_wifi,
            isDangerPoint: zone.is_dangerous,
            gateId: `GATE-${floorId}-${index}`,
            location: {
                floor_physical: zone.location.floor_physical,
                xy: zone.location.xy,
                is_exact: zone.location.is_exact
            }
        });
    });

    return floorZones;
}

export function convertFloorZonesToIframeZones(floors: Floor[]) {
    return floors.flatMap(floor =>
        floor.zones.map(zone => ({
            name: zone.name,
            is_wifi: zone.isWifiPoint,
            is_dangerous: zone.isDangerPoint,
            location: zone.location
        }))
    );
}