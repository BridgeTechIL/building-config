import React, { useState, useEffect } from 'react';
import { Search, X, Check, List, ChevronDown, ChevronRight, ListTree } from 'lucide-react';
import { Worker, WorkerGroup } from '@/config/workers';
import { Equipment, EquipmentGroup } from '@/config/equipment';
import { Sensor, SensorType } from '@/config/sensors';
import { useSearchParams } from 'next/navigation';
import { fetchProjectData, getMockProjectData, updateItemInDatabase } from '@/utils/dataUtils';

type FilterMode = 'workers' | 'equipment' | 'sensors';

interface MobileFilterProps {
    isOpen: boolean;
    onClose: () => void;
    updateDB: (projectId: string, action: string, itemName: string, itemId: number, column: string, value: any) => Promise<any>;
    onSelectItems?: (selections: {
        workers: Worker[],
        equipment: Equipment[],
        sensors: Sensor[]
    }) => void;
    floorNames?: Record<number, string>;
}

// Extended interfaces for internal use
interface ExtendedWorkerGroup extends WorkerGroup {
    color: string;
}

interface DisplayableSensor extends Omit<Sensor, 'location'> {
    location: {
        floor_physical: number;
        xy: [number, number];
        is_exact: boolean;
    };
}

const MobileFilter: React.FC<MobileFilterProps> = ({
    isOpen,
    onClose,
    updateDB,
    onSelectItems,
    floorNames = {},
}) => {
    const [mode, setMode] = useState<FilterMode>('workers');
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [workerGroups, setWorkerGroups] = useState<ExtendedWorkerGroup[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroup[]>([]);
    const [sensors, setSensors] = useState<DisplayableSensor[]>([]);
    const [sensorTypes, setSensorTypes] = useState<SensorType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Track selections for each category separately
    const [selectedWorkers, setSelectedWorkers] = useState<Record<string, boolean>>({});
    const [selectedEquipment, setSelectedEquipment] = useState<Record<string, boolean>>({});
    const [selectedSensors, setSelectedSensors] = useState<Record<string, boolean>>({});

    const [viewType, setViewType] = useState<'list' | 'grid'>('list');
    const [viewMode, setViewMode] = useState<'list' | 'group'>('list');
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    const searchParams = useSearchParams();
    const projectId = searchParams.get('project_id');

    // Helper to get the current selection state based on mode
    const getCurrentSelection = () => {
        switch (mode) {
            case 'workers': return selectedWorkers;
            case 'equipment': return selectedEquipment;
            case 'sensors': return selectedSensors;
            default: return {};
        }
    };

    // Helper to set the current selection state based on mode
    const setCurrentSelection = (selectionState: Record<string, boolean>) => {
        switch (mode) {
            case 'workers':
                setSelectedWorkers(selectionState);
                break;
            case 'equipment':
                setSelectedEquipment(selectionState);
                break;
            case 'sensors':
                setSelectedSensors(selectionState);
                break;
        }
    };

    // Load hardcoded data when the filter opens
    useEffect(() => {
        if (!isOpen) return;

        const loadData = async () => {
            // Use the project ID if available, otherwise use mock data
            const projectData = projectId
                ? await fetchProjectData(projectId)
                : getMockProjectData();

            // Load all data types when filter opens
            if (workers.length === 0) {
                // Load workers and groups
                const parsedGroups = projectData.worker_groups.map((group: any, index: number) => ({
                    id: group.id.toString(),
                    name: group.name,
                    description: group.description || '',
                    isActive: false,
                    color: getRandomColor(index),
                }));
                setWorkerGroups(parsedGroups);

                const parsedWorkers = projectData.peeps.map((person: any) => ({
                    id: person.id.toString(),
                    tagId: person.tag_id.toString(),
                    name: person.name ? person.name : 'Unnamed Worker',
                    floor_name: person.floor_name || (person.floor !== null ? floorNames[person.floor] || '-' : '-'),
                    floor_physical: person.floor ?? undefined,
                    xy: person.zone || [Math.floor(Math.random() * 66) + 10, Math.floor(Math.random() * 66) + 10],
                    role: person.trade ? person.trade : 'Unknown',
                    groups: person.groups ? person.groups.map((g: any) => g.toString()) : [],
                }));
                setWorkers(parsedWorkers);

                // Initialize expanded state for worker groups
                const initialExpandedGroups: Record<string, boolean> = {};
                parsedGroups.forEach((group: ExtendedWorkerGroup) => {
                    initialExpandedGroups[group.id] = false;
                });
                setExpandedGroups(initialExpandedGroups);
            }

            if (equipment.length === 0) {
                // Load equipment and groups
                const parsedGroups = projectData.equipment_groups.map((group: any) => ({
                    id: group.id.toString(),
                    name: group.name,
                    description: group.description || '',
                    isActive: false
                }));
                setEquipmentGroups(parsedGroups);

                const parsedEquipment = projectData.stuff.map((item: any) => ({
                    id: item.id.toString(),
                    tagId: item.tag_id.toString(),
                    name: item.name ? item.name : 'Unnamed Equipment',
                    floor_name: item.floor_name || (item.floor !== null ? floorNames[item.floor] || '-' : '-'),
                    floor_physical: item.floor ?? undefined,
                    type: item.type || 'Unknown',
                    xy: item.zone || [Math.floor(Math.random() * 66) + 10, Math.floor(Math.random() * 66) + 10],
                    groups: item.groups ? item.groups.map((group: any) => group.toString()) : []
                }));
                setEquipment(parsedEquipment);
            }

            if (sensors.length === 0) {
                // Load sensors and types
                const fetchedSensors = projectData.sensors.map((sensor: any) => ({
                    id: sensor.id.toString(),
                    tagId: sensor.id.toString(),
                    name: sensor.display_name || 'Unnamed Sensor',
                    floor_name: sensor.floor_name || (sensor.floor_physical ? floorNames[sensor.floor_physical] : '-'),
                    type: sensor.type || 'Unknown',
                    location: {
                        floor_physical: sensor.floor_physical,
                        xy: [
                            sensor.location_x ?? Math.floor(Math.random() * 66) + 10,
                            sensor.location_y ?? Math.floor(Math.random() * 66) + 10
                        ] as [number, number],
                        is_exact: Boolean(sensor.location_x && sensor.location_y)
                    }
                }));
                setSensors(fetchedSensors);

                const fetchedTypes = Array.from(
                    new Set(fetchedSensors.map(sensor => sensor.type as string)) as Set<string>
                ).map((type, index) => ({
                    id: `type_${index}`,
                    name: type,
                    description: `${type} sensors`
                }));
                setSensorTypes(fetchedTypes);
            }
        };

        loadData();
    }, [isOpen, projectId, floorNames, equipment.length, sensors.length, workers.length]);

    const getRandomColor = (index: number) => {
        const colors = [
            '#FFFF00', '#FF0000', '#0000FF', '#f652b6', '#008000',
            '#800080', '#FF5722', '#607D8B', '#673AB7', '#009688',
            '#00BCD4', '#CDDC39', '#3F51B5', '#FFC107', '#03A9F4',
            '#8BC34A', '#FF9800'
        ];
        return colors[index % colors.length];
    };

    const filteredItems = () => {
        const query = searchQuery.toLowerCase();

        if (mode === 'workers') {
            return workers.filter(worker =>
                worker.name.toLowerCase().includes(query) ||
                worker.tagId.toLowerCase().includes(query) ||
                worker.role.toLowerCase().includes(query)
            );
        }
        else if (mode === 'equipment') {
            return equipment.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.tagId.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query)
            );
        }
        else if (mode === 'sensors') {
            return sensors.filter(sensor =>
                sensor.name.toLowerCase().includes(query) ||
                sensor.tagId.toLowerCase().includes(query) ||
                sensor.type.toLowerCase().includes(query)
            );
        }

        return [];
    };

    const getGroupedItems = () => {
        const query = searchQuery.toLowerCase();
        let filteredItemsList: (Worker | Equipment | DisplayableSensor)[] = [];
        let groupsList: (ExtendedWorkerGroup | EquipmentGroup | SensorType)[] = [];

        if (mode === 'workers') {
            filteredItemsList = workers.filter(worker =>
                worker.name.toLowerCase().includes(query) ||
                worker.tagId.toLowerCase().includes(query) ||
                worker.role.toLowerCase().includes(query)
            );
            groupsList = workerGroups;
        }
        else if (mode === 'equipment') {
            filteredItemsList = equipment.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.tagId.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query)
            );
            groupsList = equipmentGroups;
        }
        else if (mode === 'sensors') {
            const filteredSensors = sensors.filter(sensor =>
                sensor.name.toLowerCase().includes(query) ||
                sensor.tagId.toLowerCase().includes(query) ||
                sensor.type.toLowerCase().includes(query)
            );
            filteredItemsList = filteredSensors;

            // Group sensors by type
            const typesMap: { [key: string]: { id: string; name: string; items: DisplayableSensor[] } } = {};
            sensorTypes.forEach(type => {
                typesMap[type.name] = {
                    id: type.id,
                    name: type.name,
                    items: []
                };
            });

            filteredSensors.forEach(sensor => {
                if (typesMap[sensor.type]) {
                    typesMap[sensor.type].items.push(sensor);
                }
            });

            return Object.values(typesMap).filter(group => group.items.length > 0);
        }

        // For workers and equipment - group items by their groups
        interface GroupedItems {
            [key: string]: {
                id: string;
                name: string;
                description?: string;
                isActive?: boolean;
                color?: string;
                items: (Worker | Equipment | DisplayableSensor)[];
            };
        }
        const groupedItems: GroupedItems = {};

        // Initialize groups
        groupsList.forEach(group => {
            groupedItems[group.id] = {
                id: group.id,
                name: group.name,
                description: group.description,
                isActive: 'isActive' in group ? group.isActive : undefined,
                color: 'color' in group ? (group as ExtendedWorkerGroup).color : undefined,
                items: []
            };
        });

        // Assign items to their groups
        filteredItemsList.forEach(item => {
            if ('groups' in item && Array.isArray(item.groups)) {
                item.groups.forEach(groupId => {
                    if (groupedItems[groupId]) {
                        groupedItems[groupId].items.push(item);
                    }
                });
            }
        });

        // Filter out empty groups and sort by name
        return Object.values(groupedItems)
            .filter(group => group.items.length > 0)
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
    };

    const toggleItemSelection = (id: string) => {
        const currentSelection = getCurrentSelection();
        const newSelection = {
            ...currentSelection,
            [id]: !currentSelection[id]
        };
        setCurrentSelection(newSelection);
    };

    const toggleGroupExpanded = (groupId: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    // Get total selected count across all categories
    const getTotalSelectedCount = () => {
        return Object.values(selectedWorkers).filter(Boolean).length +
            Object.values(selectedEquipment).filter(Boolean).length +
            Object.values(selectedSensors).filter(Boolean).length;
    };

    // Clear all selections across all categories
    const handleClearAllSelections = () => {
        setSelectedWorkers({});
        setSelectedEquipment({});
        setSelectedSensors({});
    };

    const toggleGroupSelection = (groupId: string, items: any[]) => {
        // Check if all items in the group are selected
        const currentSelection = getCurrentSelection();
        const allSelected = items.every(item => currentSelection[item.tagId]);

        // Toggle selection for all items in the group
        const newSelection = { ...currentSelection };
        items.forEach(item => {
            newSelection[item.tagId] = !allSelected;
        });

        setCurrentSelection(newSelection);
    };

    const showLocation = () => {
        // Get the selected objects from each category
        const selectedWorkerObjs = workers.filter(w => selectedWorkers[w.tagId]);
        const selectedEquipmentObjs = equipment.filter(e => selectedEquipment[e.tagId]);
        const selectedSensorObjs = sensors.filter(s => selectedSensors[s.tagId]);

        // Call the parent with all selected items
        if (onSelectItems) {
            onSelectItems({
                workers: selectedWorkerObjs,
                equipment: selectedEquipmentObjs,
                sensors: selectedSensorObjs as unknown as Sensor[]
            });
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end">
            {/* Overlay backdrop */}
            <div className="absolute inset-0 bg-gray-900/50" onClick={onClose}></div>

            {/* Filter panel - With fixed height of 75vh */}
            <div
                className="absolute bottom-0 w-full z-10 flex flex-col rounded-t-3xl bg-white overflow-hidden"
                style={{ height: "75vh", maxHeight: "75vh" }}
            >
                {/* Fixed Header (Title, Tabs, and Search) */}
                <div className="px-4 pt-4 pb-2 border-b border-gray-200 bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-2xl font-bold">Filters</h2>
                        <button onClick={onClose} className="p-2">
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Mode Selection (Workers, Equipment, Sensors) */}
                    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 mb-3 no-scrollbar">
                        {['workers', 'equipment', 'sensors'].map((item) => {
                            // Calculate count based on the specific item category
                            let count = 0;
                            let selectedCount = 0;

                            if (item === 'workers') {
                                count = workers.length;
                                selectedCount = Object.values(selectedWorkers).filter(Boolean).length;
                            } else if (item === 'equipment') {
                                count = equipment.length;
                                selectedCount = Object.values(selectedEquipment).filter(Boolean).length;
                            } else if (item === 'sensors') {
                                count = sensors.length;
                                selectedCount = Object.values(selectedSensors).filter(Boolean).length;
                            }

                            return (
                                <button
                                    key={item}
                                    className={`py-2 px-4 rounded-full text-center whitespace-nowrap mr-2 flex-shrink-0 relative
                                        ${mode === item ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                    onClick={() => setMode(item as FilterMode)}
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                    <span className="text-sm ml-1">({count})</span>

                                    {selectedCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            {selectedCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search and View Mode Toggle */}
                    <div className="flex gap-3 mb-2">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder={`Search ${mode}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div className="flex bg-gray-100 rounded-full">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-l-full ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-gray-500'}`}
                            >
                                <List size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('group')}
                                className={`p-2 rounded-r-full ${viewMode === 'group' ? 'bg-cyan-500 text-white' : 'text-gray-500'}`}
                            >
                                <ListTree size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-4 pb-20">
                    {viewMode === 'list' ? (
                        // List View
                        <div className="space-y-1 pt-2">
                            {filteredItems().map((item) => (
                                <div
                                    key={item.tagId || item.id}
                                    className={`flex items-center bg-gray-50 p-2 rounded-lg border ${getCurrentSelection()[item.tagId] ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'
                                        }`}
                                    onClick={() => toggleItemSelection(item.tagId)}
                                >
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-2 ml-2 ${getCurrentSelection()[item.tagId] ? 'bg-cyan-500' : 'border border-gray-300'
                                        }`}>
                                        {getCurrentSelection()[item.tagId] && <Check size={16} className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-md flex">
                                            <span className="w-10">{item.tagId}</span>
                                            <span className="">{item.name}</span>
                                        </div>
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        {`Zone ${item.floor_name}`}
                                    </div>
                                </div>
                            ))}
                            {filteredItems().length === 0 && (
                                <div className="text-center py-8 text-gray-500">No {mode} found matching your search</div>
                            )}
                        </div>
                    ) : (
                        // Group View
                        <div className="pt-2">
                            {getGroupedItems().map((group: any) => (
                                <div key={group.id} className="mb-1 border rounded-lg overflow-hidden">
                                    <div
                                        className="flex items-center p-2 bg-gray-50 cursor-pointer"
                                        onClick={() => toggleGroupExpanded(group.id)}
                                    >
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-3 ${group.items.every((item: any) => getCurrentSelection()[item.tagId]) ? 'bg-cyan-500' : 'border border-gray-300'
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleGroupSelection(group.id, group.items);
                                            }}
                                        >
                                            {group.items.every((item: any) => getCurrentSelection()[item.tagId]) &&
                                                <Check size={16} className="text-white" />
                                            }
                                        </div>

                                        <div className="flex-1 flex items-center">
                                            <span className="px-3 py-1 bg-amber-200 rounded-full text-md font-medium">
                                                {group.name}
                                            </span>
                                            <span className="ml-2 text-gray-700">
                                                {group.items.length} {mode === 'workers' ? 'People' : mode === 'equipment' ? 'Items' : 'Sensors'}
                                            </span>
                                        </div>
                                        {expandedGroups[group.id] ?
                                            <ChevronDown className="text-gray-400" /> :
                                            <ChevronRight className="text-gray-400" />
                                        }
                                    </div>

                                    {expandedGroups[group.id] && (
                                        <div className="p-1 pl-3">
                                            {group.items.map((item: any) => (
                                                <div
                                                    key={item.tagId}
                                                    className="flex items-center justify-between p-1 border-b border-gray-100 last:border-0"
                                                    onClick={() => toggleItemSelection(item.tagId)}
                                                >
                                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${getCurrentSelection()[item.tagId] ? 'bg-cyan-500' : 'border border-gray-300'}`}>
                                                        {getCurrentSelection()[item.tagId] && <Check size={16} className="text-white" />}
                                                    </div>
                                                    <div className="flex items-center pl-3 flex-1">
                                                        <div className="text-md text-gray-500 w-4"><b>{item.tagId}</b></div>
                                                        <div className="ml-3">{item.name}</div>
                                                    </div>
                                                    <div className="text-gray-500 text-sm">
                                                        {item.floor_name && item.floor_name !== "-" ? `Zone ${item.floor_name}` : ""}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {getGroupedItems().length === 0 && (
                                <div className="text-center py-8 text-gray-500">No groups found matching your search</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Fixed Footer (Buttons) */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-md">
                    <div className="flex gap-2">
                        <button
                            onClick={handleClearAllSelections}
                            className={`px-3 py-2 ${getTotalSelectedCount() > 0 ? 'text-red-600' : 'text-gray-400'}`}
                        >
                            Clear {getTotalSelectedCount() > 0 && `(${getTotalSelectedCount()})`}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={showLocation}
                            disabled={getTotalSelectedCount() === 0}
                            className={`px-6 py-2 rounded-full ${getTotalSelectedCount() > 0 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            Show {getTotalSelectedCount() > 0 && `(${getTotalSelectedCount()})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileFilter;