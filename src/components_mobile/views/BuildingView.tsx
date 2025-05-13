import React, { useState, useRef, useEffect } from 'react';
import MobileFloor from '../building/Floor';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { FloorDetailsModal } from '../layout/FloorDetails';

// Types
interface FloorData {
    hasCameras?: boolean;
    hasAlerts?: boolean;
    zonesCount?: number;
    workerCount?: number;
    equipmentCount?: number;
    sensorCount?: number;
}

interface ItemDetails {
    id: string;
    name: string;
    type: 'worker' | 'equipment' | 'sensor';
    position?: string;
    location?: {
        floor: number;
        apartment?: string;
    };
    lastSeen?: string;
    duration?: string;
    image?: string;
    visitHistory?: {
        time: string;
        duration: string;
        floor: string;
        location: string;
    }[];
}

interface MobileBuildingProps {
    floorCount: number;
    activeFloor?: number;
    setActiveFloor: (floorNumber: number | undefined) => void;
    floorData?: {
        [key: number]: FloorData;
    };
    // Optional lists of actual workers, equipment, and sensors on each floor
    workersData?: ItemDetails[];
    equipmentData?: ItemDetails[];
    sensorsData?: ItemDetails[];
}

export default function MobileBuilding({
    floorCount,
    activeFloor,
    setActiveFloor,
    floorData = {},
    workersData = [],
    equipmentData = [],
    sensorsData = []
}: MobileBuildingProps) {
    const [scale, setScale] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

    // Sample worker data if none provided
    const sampleWorkers: ItemDetails[] = [
        {
            id: 'w1',
            name: 'Ernest Morgan',
            type: 'worker',
            position: 'Lift Engineer',
            location: { floor: 7, apartment: '02' },
            image: '/path/to/worker1.jpg',
        },
        {
            id: 'w2',
            name: 'Sarah Jenkins',
            type: 'worker',
            position: 'Electrician',
            location: { floor: 4, apartment: '05' },
        },
        {
            id: 'w3',
            name: 'Miguel Rodriguez',
            type: 'worker',
            position: 'Site Manager',
            location: { floor: 2, apartment: '01' },
        },
    ];

    // Sample equipment data if none provided
    const sampleEquipment: ItemDetails[] = [
        {
            id: 'e1',
            name: 'Power Drill XL-5000',
            type: 'equipment',
            location: { floor: 7 },
        },
        {
            id: 'e2',
            name: 'Mobile Generator',
            type: 'equipment',
            location: { floor: 3 },
        },
    ];

    // Sample sensor data if none provided
    const sampleSensors: ItemDetails[] = [
        {
            id: 's1',
            name: 'Motion Sensor A',
            type: 'sensor',
            location: { floor: 7 },
        },
        {
            id: 's2',
            name: 'Temperature Monitor',
            type: 'sensor',
            location: { floor: 5 },
        },
    ];

    // Function to get items for a specific floor
    const getFloorItems = (floorNumber: number) => {
        // Only use provided real data - don't create placeholders if data is missing
        const workers = workersData.filter(w => w.location?.floor === floorNumber);
        const equipment = equipmentData.filter(e => e.location?.floor === floorNumber);
        const sensors = sensorsData.filter(s => s.location?.floor === floorNumber);

        // Don't create placeholders just based on floor data counts
        // Only return actual items we have data for
        return { workers, equipment, sensors };
    };

    // Generate floors (from top to bottom)
    const floors = [];
    for (let i = floorCount; i >= 0; i--) {
        floors.push(
            <div
                key={i}
                style={{ marginBottom: i > 0 ? -26 : 0 }}
                className={`z-${floorCount - i}`}
                data-floor={i} // Add data attribute for scrolling
            >
                <MobileFloor
                    floorNumber={i}
                    isActive={activeFloor === i}
                    hasCamera={floorData[i]?.hasCameras}
                    hasAlerts={floorData[i]?.hasAlerts}
                    workerCount={floorData[i]?.workerCount || 0}
                    equipmentCount={floorData[i]?.equipmentCount || 0}
                    sensorCount={floorData[i]?.sensorCount || 0}
                    onClick={() => {
                        setActiveFloor(i);
                        setSelectedFloor(i);
                    }}
                />
            </div>
        );
    }

    // Function to zoom in/out
    const handleZoom = (direction: 'in' | 'out') => {
        const zoomFactor = direction === 'in' ? 0.1 : -0.1;
        setScale(prevScale => Math.max(0.6, Math.min(1.5, prevScale + zoomFactor)));
    };

    // Scroll to active floor when it changes
    useEffect(() => {
        if (activeFloor !== undefined && scrollContainerRef.current) {
            // Calculate position: each floor is roughly 60px in height, but we offset by 26px
            const activeFloorElement = scrollContainerRef.current.querySelector(`[data-floor="${activeFloor}"]`);

            if (activeFloorElement) {
                const scrollPosition = activeFloorElement.getBoundingClientRect().top +
                    scrollContainerRef.current.scrollTop -
                    scrollContainerRef.current.getBoundingClientRect().top -
                    100; // Center in viewport

                scrollContainerRef.current.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, [activeFloor]);

    return (
        <div className="relative h-full w-full bg-gray-50 overflow-hidden pb-16"> {/* Add padding at bottom for menu */}
            {/* Floor Details Modal */}
            {selectedFloor !== null && (
                <FloorDetailsModal
                    isOpen={selectedFloor !== null}
                    onClose={() => setSelectedFloor(null)}
                    floor={selectedFloor}
                    items={getFloorItems(selectedFloor)}
                />
            )}

            {/* Zoom controls */}
            <div className="absolute bottom-20 left-4 z-40 flex flex-col gap-2 bg-white rounded-lg shadow-md p-1">
                <button
                    onClick={() => handleZoom('in')}
                    className="p-2 bg-white hover:bg-gray-100 rounded-md text-gray-700"
                    aria-label="Zoom in"
                >
                    <ZoomIn size={20} />
                </button>
                <button
                    onClick={() => handleZoom('out')}
                    className="p-2 bg-white hover:bg-gray-100 rounded-md text-gray-700"
                    aria-label="Zoom out"
                >
                    <ZoomOut size={20} />
                </button>
            </div>

            {/* Building container with zoom and scroll */}
            <div
                ref={scrollContainerRef}
                className="relative h-full w-full overflow-y-auto overflow-x-hidden flex flex-col items-center"
            >
                <div
                    className="flex flex-col items-center py-10" /* Add top/bottom padding */
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'center top',
                        transition: 'transform 0.3s ease'
                    }}
                >
                    {floors}
                </div>
            </div>
        </div>
    );
}