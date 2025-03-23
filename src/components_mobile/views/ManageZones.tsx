import React, { useState, useEffect } from 'react';
import { ChevronLeft, MoreVertical, Search, Edit, AlertTriangle } from 'lucide-react';
import { updateItemInDatabase } from '@/utils/dataUtils';

// Zone Item component for rendering individual zones
const ZoneItem = ({ zone, index, onUpdateZone, floorLevel }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [zoneName, setZoneName] = useState(zone.display_name || zone.name || `Zone ${index + 1}`);

    return (
        <div className="flex items-center py-3 px-4 border-b last:border-0">
            <div className="w-8 text-center text-gray-500 font-medium">
                {(index + 1).toString().padStart(2, '0')}
            </div>
            <div className="flex-1 px-2">
                {isEditing ? (
                    <input
                        type="text"
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                        onBlur={() => {
                            setIsEditing(false);
                            onUpdateZone(floorLevel, zone.id, { name: zoneName });
                        }}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                    />
                ) : (
                    <div
                        className="cursor-text hover:bg-gray-50 px-2 py-1 rounded"
                        onClick={() => setIsEditing(true)}
                    >
                        {zoneName}
                    </div>
                )}
            </div>
            <div className="w-16 flex justify-center">
                <button
                    className="p-1"
                    onClick={() => onUpdateZone(floorLevel, zone.id, { isDanger: !(zone.isDanger || zone.is_danger) })}
                >
                    <AlertTriangle
                        size={18}
                        className={(zone.isDanger || zone.is_danger) ? "text-red-500" : "text-gray-300"}
                    />
                </button>
            </div>
        </div>
    );
};

interface ZonesViewProps {
    onBack: () => void;
    projectData: any;
    projectId?: string | null;
    floorNames?: Record<number, string>;
}

const ZonesView: React.FC<ZonesViewProps> = ({
    onBack,
    projectData,
    projectId = null,
    floorNames = {}
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFloors, setExpandedFloors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Initialize expanded state for floors
        const initialExpandedState: Record<string, boolean> = {};
        Object.keys(projectData.floor_names || floorNames).forEach((floor, index) => {
            // Expand the second floor by default (for demo purposes)
            initialExpandedState[floor] = index === 1;
        });
        setExpandedFloors(initialExpandedState);
    }, [projectData, floorNames]);

    // Toggle expanded state for a floor
    const toggleFloorExpanded = (floorId: string) => {
        setExpandedFloors(prev => ({
            ...prev,
            [floorId]: !prev[floorId]
        }));
    };

    // Get zones for a specific floor
    const getZonesForFloor = (floorId: number) => {
        return projectData.zones?.filter((zone: any) =>
            zone.floor_physical === parseInt(floorId.toString(), 10)
        ) || [];
    };

    // Handle zone updates
    const onUpdateZone = (floorLevel: number, zoneId: string, updates: any) => {
        if (projectId) {
            // If there's a projectId, make an API call
            Object.entries(updates).forEach(([key, value]) => {
                updateItemInDatabase(
                    projectId,
                    'update',
                    'zones',
                    parseInt(zoneId, 10),
                    key === 'name' ? 'display_name' : key === 'isDanger' ? 'is_danger' : key,
                    value
                );
            });
        }

        // If your component needs to update local state, handle it here
        // You might want to implement a callback to the parent component
    };

    const sortedFloors = Object.entries(projectData.floor_names || floorNames)
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center border-b">
                <button
                    onClick={onBack}
                    className="p-2 mr-2 rounded-full hover:bg-gray-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl flex-1 text-center">Zones</h1>
            </div>

            {/* Search */}
            <div className="p-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Floor List */}
            <div className="flex-1 overflow-auto">
                {sortedFloors.map((floor) => {
                    const floorZones = getZonesForFloor(parseInt(floor.id));
                    const isExpanded = expandedFloors[floor.id];
                    const filterZones = searchQuery
                        ? floorZones.filter((zone: any) =>
                            zone.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            zone.box_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
                        : floorZones;

                    // Skip floors with no zones when searching
                    if (searchQuery && filterZones.length === 0) {
                        return null;
                    }

                    return (
                        <div key={floor.id} className="mb-2">
                            <div
                                className="mx-4 p-4 bg-white rounded-lg flex items-center cursor-pointer"
                                onClick={() => toggleFloorExpanded(floor.id)}
                            >
                                <div className="p-2 mr-2 rounded-full bg-gray-100">
                                    <ChevronLeft
                                        size={16}
                                        className={`transform transition-transform ${isExpanded ? 'rotate-90' : '-rotate-90'}`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="">Floor {floor.name.padStart(2, '0')}</h3>
                                </div>
                                <div className="rounded-full bg-gray-200 px-2 py-1 text-sm font-medium">
                                    {floorZones.length.toString().padStart(2, '0')}
                                </div>
                                <button className="p-2 ml-2">
                                    <MoreVertical size={16} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Expanded zone list */}
                            {isExpanded && (
                                <div className="mt-2 mx-7 bg-white rounded-lg overflow-hidden">
                                    {filterZones.length > 0 ? (
                                        <div>
                                            {filterZones.map((zone, index) => (
                                                <ZoneItem
                                                    key={zone.id}
                                                    zone={zone}
                                                    index={index}
                                                    onUpdateZone={onUpdateZone}
                                                    floorLevel={parseInt(floor.id, 10)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center text-gray-500">
                                            No zones found on this floor
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ZonesView;