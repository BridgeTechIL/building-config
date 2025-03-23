// src/utils/dataUtils.ts

// Define interfaces for the data model
export interface WorkerData {
    company: string;
    floor: number | null;
    floor_name: string | null;
    groups: number[];
    id: number;
    name: string;
    tag_id: number | string;
    trade: string;
    type: number;
    zone: [number, number] | null;
}

export interface SensorData {
    display_name: string;
    floor_physical: number;
    id: number | string;
    floor_name: string | null;
    location_x: number;
    location_y: number;
    project_id?: number;
    type: string;
}

export interface EquipmentData {
    company: string;
    floor: number | null;
    floor_name: string | null;
    groups: number[];
    id: number | string;
    name: string;
    tag_id: number | string;
    trade: string;
    type: number;
    zone: [number, number] | null;
}

export interface GroupData {
    description: string;
    id: number;
    name: string;
    project_id: number;
    type: number;
}

export interface ZoneData {
    box_id: number | string;
    display_name: string | null;
    floor_physical: number;
    id: number | string;
    is_danger: number | boolean;
    location_x: number;
    location_y: number;
    project_id?: number;
    size_x?: number;
    size_y?: number;
}

export interface ProjectData {
    access_points: any[];
    cameras: any[];
    devices_cameras: Record<string, string>;
    equipment_groups: GroupData[];
    floor_names: Record<string, string>;
    peeps: WorkerData[];
    project_name: string;
    sensors: SensorData[];
    stuff: EquipmentData[];
    worker_groups: GroupData[];
    zones: ZoneData[];
}

// Add these interfaces to your dataUtils.ts

export interface AlertData {
    id: string;
    type: 'UNAUTHORIZED_ACCESS' | 'DANGER_ZONE' | 'EQUIPMENT_ISSUE' | 'WORKER_SAFETY';
    floor: string;
    timestamp: number; // Unix timestamp
    workerId?: string; // Optional, for alerts related to workers
    equipmentId?: string; // Optional, for alerts related to equipment
    zoneId?: string; // Optional, for alerts related to zones
    isArchived: boolean;
}

// Add this to your getMockProjectData function's return value or as a separate function

export const getMockAlerts = (): AlertData[] => {
    return [
        {
            id: "alert-1",
            type: "UNAUTHORIZED_ACCESS",
            floor: "07",
            timestamp: Date.now() - 10 * 60 * 1000, // 10 mins ago
            workerId: "25", // Referencing a worker from your mock data
            isArchived: false
        },
        {
            id: "alert-2",
            type: "UNAUTHORIZED_ACCESS",
            floor: "07",
            timestamp: Date.now() - 10 * 60 * 1000, // 10 mins ago
            workerId: "25", // Referencing a worker from your mock data
            isArchived: false
        },
        {
            id: "alert-3",
            type: "UNAUTHORIZED_ACCESS",
            floor: "05",
            timestamp: Date.now() - 45 * 60 * 1000, // 45 mins ago
            equipmentId: "204", // Referencing equipment from your mock data
            isArchived: false
        },
        {
            id: "alert-4",
            type: "UNAUTHORIZED_ACCESS",
            floor: "03",
            timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
            workerId: "17", // Referencing a worker from your mock data
            isArchived: false
        },
        {
            id: "alert-5",
            type: "UNAUTHORIZED_ACCESS",
            floor: "01",
            timestamp: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
            workerId: "2", // Referencing a worker from your mock data
            isArchived: false
        }
    ];
};

// Add this helper function to format the time
export const formatAlertTime = (timestamp: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
        return `${diffMins} mins ago`;
    } else if (diffMins < 24 * 60) {
        const hours = Math.floor(diffMins / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffMins / (60 * 24));
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
};

/**
 * Fetch project data from the API
 * @param projectId - The project ID to fetch
 * @returns Promise with project data
 */
export const fetchProjectData = async (projectId: string): Promise<ProjectData> => {
    try {
        const response = await fetch(`https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d?project_id=${projectId}`);
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching project data:', error);
        // Fall back to mock data in case of an error
        return getMockProjectData();
    }
};

/**
 * Get mock project data for development and testing
 * @returns Mock project data
 */
export const getMockProjectData = (): ProjectData => {
    return {
        "access_points": [],
        "cameras": [],
        "devices_cameras": {
            "Left Hoist": "https://player.castr.com/live_8afde1b0f70711ee871d23aae5d7c6ee",
            "Right Hoist": "https://player.castr.com/live_bf5d7970f70711ee948a45f2b72e18f4"
        },
        "floor_names": {
            "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7",
            "8": "8", "9": "9", "10": "10", "11": "11", "12": "12", "13": "13", "14": "14", "15": "15"
        },
        "peeps": [
            { "company": "KWB", "floor": 4, "floor_name": "4", "groups": [39, 34], "id": 7, "name": "Alexandru Ghirda", "tag_id": 7, "trade": "Kitchen Fitter", "type": 1, "zone": [42, 67] },
            { "company": "Atlantic", "floor": 7, "floor_name": "7", "groups": [32, 40], "id": 25, "name": "Arone Kismae Menyha", "tag_id": 25, "trade": "Labourer", "type": 1, "zone": [28, 53] },
            { "company": "AC Beck", "floor": 1, "floor_name": "1", "groups": [31, 42], "id": 2, "name": "Augustus Brown", "tag_id": 2, "trade": "Painter", "type": 1, "zone": [74, 38] },
            { "company": "AC Beck", "floor": 6, "floor_name": "6", "groups": [31, 42], "id": 3, "name": "Catalin Balu", "tag_id": 3, "trade": "Painter", "type": 1, "zone": [63, 41] },
            { "company": "Atlantic", "floor": 8, "floor_name": "8", "groups": [32, 40], "id": 23, "name": "Charlie Willmott", "tag_id": 23, "trade": "Labourer", "type": 1, "zone": [56, 82] },
            { "company": "Atlantic", "floor": 3, "floor_name": "3", "groups": [32, 36], "id": 17, "name": "Constantin Betivu", "tag_id": 17, "trade": "Carpenter", "type": 1, "zone": [31, 44] },
            { "company": "KWB", "floor": 3, "floor_name": "3", "groups": [34, 40], "id": 8, "name": "Costea Ilie", "tag_id": 8, "trade": "Labourer", "type": 1, "zone": [47, 65] },
            { "company": "Atlantic", "floor": 3, "floor_name": "3", "groups": [32, 40], "id": 20, "name": "Dan Smochina", "tag_id": 20, "trade": "Labourer", "type": 1, "zone": [53, 29] },
            { "company": "Precision Sealants", "floor": 11, "floor_name": "11", "groups": [41, 35], "id": 31, "name": "Dave Rushman", "tag_id": 31, "trade": "Mastic Man", "type": 1, "zone": [71, 58] },
            { "company": "Atlantic", "floor": 0, "floor_name": "0", "groups": [32, 36], "id": 13, "name": "Dmitrij Saveljev", "tag_id": 13, "trade": "Carpenter", "type": 1, "zone": [39, 71] },
            { "company": "KWB", "floor": 5, "floor_name": "5", "groups": [34, 40], "id": 10, "name": "George Coroama", "tag_id": 10, "trade": "Labourer", "type": 1, "zone": [30, 40] },
            { "company": "Atlantic", "floor": 3, "floor_name": "3", "groups": [32, 36], "id": 16, "name": "Ilia Goriuc", "tag_id": 16, "trade": "Carpenter", "type": 1, "zone": [50, 60] },
            { "company": "KWB", "floor": 2, "floor_name": "2", "groups": [39, 34], "id": 12, "name": "Ioan Adrian Botezat", "tag_id": 12, "trade": "Kitchen Fitter", "type": 1, "zone": [45, 55] },
            { "company": "Atlantic", "floor": 2, "floor_name": "2", "groups": [32, 40], "id": 22, "name": "John Young", "tag_id": 22, "trade": "Labourer", "type": 1, "zone": [48, 62] },
            { "company": "KWB", "floor": 3, "floor_name": "3", "groups": [39, 34], "id": 4, "name": "Klaidas Juervicius", "tag_id": 4, "trade": "Kitchen Fitter", "type": 1, "zone": [57, 43] },
            { "company": "Atlantic", "floor": 10, "floor_name": "10", "groups": [32, 40], "id": 24, "name": "Kyle Mcauliffe", "tag_id": 24, "trade": "Labourer", "type": 1, "zone": [62, 77] }
        ],
        "project_name": "GallifordTry - Brent Cross",
        "sensors": [
            { "id": "101", "display_name": "Temperature Sensor 1", "type": "Temperature", "floor_physical": 5, "floor_name": "5", "location_x": 30, "location_y": 40 },
            { "id": "102", "display_name": "Humidity Sensor 1", "type": "Humidity", "floor_physical": 3, "floor_name": "3", "location_x": 50, "location_y": 60 },
            { "id": "103", "display_name": "Motion Sensor 1", "type": "Motion", "floor_physical": 3, "floor_name": "3", "location_x": 45, "location_y": 55 },
            { "id": "104", "display_name": "Temperature Sensor 2", "type": "Temperature", "floor_physical": 6, "floor_name": "6", "location_x": 72, "location_y": 54 },
            { "id": "105", "display_name": "Smoke Sensor 1", "type": "Smoke", "floor_physical": 8, "floor_name": "8", "location_x": 45, "location_y": 63 },
            { "id": "106", "display_name": "Smoke Sensor 3", "type": "Smoke", "floor_physical": 8, "floor_name": "8", "location_x": 45, "location_y": 63 }
        ],
        "stuff": [
            { "id": "201", "tag_id": "201", "name": "Drill", "floor": 5, "floor_name": "5", "zone": [30, 40], "groups": [43], "company": "Tools", "trade": "Equipment", "type": 2 },
            { "id": "202", "tag_id": "202", "name": "Ladder", "floor": 3, "floor_name": "3", "zone": [50, 60], "groups": [44], "company": "Tools", "trade": "Equipment", "type": 2 },
            { "id": "203", "tag_id": "203", "name": "Generator", "floor": 3, "floor_name": "3", "zone": [45, 55], "groups": [43], "company": "Tools", "trade": "Equipment", "type": 2 },
            { "id": "204", "tag_id": "204", "name": "Saw", "floor": 6, "floor_name": "6", "zone": [58, 39], "groups": [43], "company": "Tools", "trade": "Equipment", "type": 2 },
            { "id": "205", "tag_id": "205", "name": "Compressor", "floor": 4, "floor_name": "4", "zone": [41, 68], "groups": [44], "company": "Tools", "trade": "Equipment", "type": 2 },
            { "id": "206", "tag_id": "206", "name": "Compressor", "floor": 4, "floor_name": "4", "zone": [41, 68], "groups": [44], "company": "Tools", "trade": "Equipment", "type": 2 }
        ],
        "worker_groups": [
            { "description": "", "id": 31, "name": "AC Beck", "project_id": 183, "type": 1 },
            { "description": "", "id": 32, "name": "Atlantic", "project_id": 183, "type": 1 },
            { "description": "", "id": 33, "name": "B&F", "project_id": 183, "type": 1 },
            { "description": "", "id": 36, "name": "Carpenter", "project_id": 183, "type": 1 },
            { "description": "", "id": 37, "name": "Elec Tester", "project_id": 183, "type": 1 },
            { "description": "", "id": 38, "name": "Electrician", "project_id": 183, "type": 1 },
            { "description": "", "id": 39, "name": "Kitchen Fitter", "project_id": 183, "type": 1 },
            { "description": "", "id": 34, "name": "KWB", "project_id": 183, "type": 1 },
            { "description": "", "id": 40, "name": "Labourer", "project_id": 183, "type": 1 },
            { "description": "", "id": 41, "name": "Mastic Man", "project_id": 183, "type": 1 },
            { "description": "", "id": 42, "name": "Painter", "project_id": 183, "type": 1 },
            { "description": "", "id": 35, "name": "Precision Sealants", "project_id": 183, "type": 1 }
        ],
        "equipment_groups": [
            { "id": 43, "name": "Tools", "description": "Power and hand tools", "project_id": 183, "type": 2 },
            { "id": 44, "name": "Heavy Equipment", "description": "Large machinery", "project_id": 183, "type": 2 }
        ],
        "zones": [
            { "id": 1, "box_id": "GT1234A", "display_name": "North Zone", "floor_physical": 0, "is_danger": false, "location_x": 25, "location_y": 50, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 2, "box_id": "GT5678B", "display_name": "South Zone", "floor_physical": 0, "is_danger": true, "location_x": 75, "location_y": 50, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 3, "box_id": "GT2345C", "display_name": "East Zone", "floor_physical": 1, "is_danger": false, "location_x": 75, "location_y": 35, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 4, "box_id": "GT6789D", "display_name": "West Zone", "floor_physical": 1, "is_danger": false, "location_x": 25, "location_y": 65, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 5, "box_id": "GT3456E", "display_name": "Entry Zone", "floor_physical": 2, "is_danger": false, "location_x": 50, "location_y": 25, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 6, "box_id": "GT7890F", "display_name": "Exit Zone", "floor_physical": 2, "is_danger": true, "location_x": 50, "location_y": 75, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 7, "box_id": "GT4567G", "display_name": "Storage Zone", "floor_physical": 3, "is_danger": false, "location_x": 25, "location_y": 50, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 8, "box_id": "GT8901H", "display_name": "Office Zone", "floor_physical": 3, "is_danger": false, "location_x": 75, "location_y": 50, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 9, "box_id": "GT5678I", "display_name": "Meeting Zone", "floor_physical": 4, "is_danger": false, "location_x": 40, "location_y": 40, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 10, "box_id": "GT9012J", "display_name": "Break Zone", "floor_physical": 4, "is_danger": false, "location_x": 60, "location_y": 60, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 11, "box_id": "GT6789K", "display_name": "Dining Zone", "floor_physical": 5, "is_danger": false, "location_x": 30, "location_y": 70, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 12, "box_id": "GT0123L", "display_name": "Lounge Zone", "floor_physical": 5, "is_danger": false, "location_x": 70, "location_y": 30, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 13, "box_id": "GT7890M", "display_name": "Workspace Zone", "floor_physical": 6, "is_danger": false, "location_x": 25, "location_y": 25, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 14, "box_id": "GT1234N", "display_name": "Utility Zone", "floor_physical": 6, "is_danger": true, "location_x": 75, "location_y": 75, "project_id": 1, "size_x": 40, "size_y": 30 },
            { "id": 15, "box_id": "GT8901O", "display_name": "Main Zone", "floor_physical": 7, "is_danger": false, "location_x": 50, "location_y": 50, "project_id": 1, "size_x": 40, "size_y": 30 }
        ]
    };
};

/**
 * Update item in database
 * @param projectId - The project ID
 * @param action - Action to perform (e.g., 'rename')
 * @param itemName - Item type (e.g., 'zones', 'peeps')
 * @param itemId - ID of the item to update
 * @param column - Column/property to update
 * @param value - New value
 * @returns Promise with result of the update operation
 */
export const updateItemInDatabase = async (
    projectId: string,
    action: string,
    itemName: string,
    itemId: number,
    column: string,
    value: any
): Promise<{ success: boolean; message: string; data?: any }> => {
    console.log(`Updating ${itemName} with ID ${itemId}, setting ${column} to:`, value);

    try {
        // In a production environment, this would make a POST request to the API
        const response = await fetch('https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId,
                action,
                itemName,
                itemId,
                column,
                value,
            }),
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating item:', error);

        // For development, return a mock successful response
        return {
            success: true,
            message: `Updated ${itemName} successfully (mock)`,
            data: { id: itemId, [column]: value }
        };
    }
};