import React, { useState, useEffect } from 'react';
import { Search, X, Check, List, ChevronDown, ChevronRight, ListTree } from 'lucide-react';
import { Worker, WorkerGroup } from '@/config/workers';
import { Equipment, EquipmentGroup } from '@/config/equipment';
import { Sensor, SensorType } from '@/config/sensors';
import { useSearchParams } from 'next/navigation';

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

const MobileFilter: React.FC<MobileFilterProps> = ({
    isOpen,
    onClose,
    updateDB,
    onSelectItems,
    floorNames = {},
}) => {
    const [mode, setMode] = useState<FilterMode>('workers');
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [workerGroups, setWorkerGroups] = useState<WorkerGroup[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroup[]>([]);
    const [sensors, setSensors] = useState<Sensor[]>([]);
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

        // Hardcoded data from provided JSON

        const hardcodedData = {
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
                { "company": "Atlantic", "floor": 7, "floor_name": "7", "groups": [32, 40], "id": 25, "name": "Arone  Kismae Menyha", "tag_id": 25, "trade": "Labourer", "type": 1, "zone": [28, 53] },
                { "company": "AC Beck", "floor": 1, "floor_name": "1", "groups": [31, 42], "id": 2, "name": "Augustus  Brown", "tag_id": 2, "trade": "Painter", "type": 1, "zone": [74, 38] },
                { "company": "AC Beck", "floor": 6, "floor_name": "6", "groups": [31, 42], "id": 3, "name": "Catalin  Balu", "tag_id": 3, "trade": "Painter", "type": 1, "zone": [63, 41] },
                { "company": "Atlantic", "floor": 8, "floor_name": "8", "groups": [32, 40], "id": 23, "name": "Charlie Willmott", "tag_id": 23, "trade": "Labourer", "type": 1, "zone": [56, 82] },
                { "company": "Atlantic", "floor": 3, "floor_name": "3", "groups": [32, 36], "id": 17, "name": "Constantin Betivu", "tag_id": 17, "trade": "Carpenter", "type": 1, "zone": [31, 44] },
                { "company": "KWB", "floor": 3, "floor_name": "3", "groups": [34, 40], "id": 8, "name": "Costea  Ilie", "tag_id": 8, "trade": "Labourer", "type": 1, "zone": [47, 65] },
                { "company": "Atlantic", "floor": 3, "floor_name": "3", "groups": [32, 40], "id": 20, "name": "Dan Smochina", "tag_id": 20, "trade": "Labourer", "type": 1, "zone": [53, 29] },
                { "company": "Precision Sealants", "floor": 11, "floor_name": "11", "groups": [41, 35], "id": 31, "name": "Dave  Rushman", "tag_id": 31, "trade": "Mastic Man", "type": 1, "zone": [71, 58] },
                { "company": "Atlantic", "floor": 0, "floor_name": "0", "groups": [32, 36], "id": 13, "name": "Dmitrij Saveljev", "tag_id": 13, "trade": "Carpenter", "type": 1, "zone": [39, 71] },
                // These already had floor locations in the original data
                { "company": "KWB", "floor": 5, "floor_name": "5", "groups": [34, 40], "id": 10, "name": "George Coroama", "tag_id": 10, "trade": "Labourer", "type": 1, "zone": [30, 40] },
                { "company": "Atlantic", "floor": 3, "floor_name": "3", "groups": [32, 36], "id": 16, "name": "Ilia Goriuc", "tag_id": 16, "trade": "Carpenter", "type": 1, "zone": [50, 60] },
                { "company": "KWB", "floor": 2, "floor_name": "2", "groups": [39, 34], "id": 12, "name": "Ioan Adrian Botezat", "tag_id": 12, "trade": "Kitchen Fitter", "type": 1, "zone": [45, 55] },
                { "company": "Atlantic", "floor": 2, "floor_name": "2", "groups": [32, 40], "id": 22, "name": "John Young ", "tag_id": 22, "trade": "Labourer", "type": 1, "zone": [48, 62] },
                { "company": "KWB", "floor": 3, "floor_name": "3", "groups": [39, 34], "id": 4, "name": "Klaidas Juervicius", "tag_id": 4, "trade": "Kitchen Fitter", "type": 1, "zone": [57, 43] },
                { "company": "Atlantic", "floor": 10, "floor_name": "10", "groups": [32, 40], "id": 24, "name": "Kyle  Mcauliffe", "tag_id": 24, "trade": "Labourer", "type": 1, "zone": [62, 77] }
            ],
            "project_name": "GallifordTry - Brent Cross",
            "sensors": [
                // These already had floor locations in the original data
                { "id": "101", "display_name": "Temperature Sensor 1", "type": "Temperature", "floor_physical": 5, "floor_name": "5", "location_x": 30, "location_y": 40 },
                { "id": "102", "display_name": "Humidity Sensor 1", "type": "Humidity", "floor_physical": 3, "floor_name": "3", "location_x": 50, "location_y": 60 },
                { "id": "103", "display_name": "Motion Sensor 1", "type": "Motion", "floor_physical": 3, "floor_name": "3", "location_x": 45, "location_y": 55 },
                // Assigning floors to previously null items
                { "id": "104", "display_name": "Temperature Sensor 2", "type": "Temperature", "floor_physical": 6, "floor_name": "6", "location_x": 72, "location_y": 54 },
                { "id": "105", "display_name": "Smoke Sensor 1", "type": "Smoke", "floor_physical": 8, "floor_name": "8", "location_x": 45, "location_y": 63 },
                { "id": "106", "display_name": "Smoke Sensor 3", "type": "Smoke", "floor_physical": 8, "floor_name": "8", "location_x": 45, "location_y": 63 }

            ],
            "stuff": [
                // These already had floor locations in the original data
                { "id": "201", "tag_id": "201", "name": "Drill", "floor": 5, "floor_name": "5", "zone": [30, 40], "groups": [43] },
                { "id": "202", "tag_id": "202", "name": "Ladder", "floor": 3, "floor_name": "3", "zone": [50, 60], "groups": [44] },
                { "id": "203", "tag_id": "203", "name": "Generator", "floor": 3, "floor_name": "3", "zone": [45, 55], "groups": [43] },
                // Assigning floors to previously null items
                { "id": "204", "tag_id": "204", "name": "Saw", "floor": 6, "floor_name": "6", "zone": [58, 39], "groups": [43] },
                { "id": "205", "tag_id": "205", "name": "Compressor", "floor": 4, "floor_name": "4", "zone": [41, 68], "groups": [44] },
                { "id": "206", "tag_id": "206", "name": "Compressor", "floor": 4, "floor_name": "4", "zone": [41, 68], "groups": [44] }

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
            "zones": []
        };


        // Load all data types when filter opens
        if (workers.length === 0) {
            // Load workers and groups
            const parsedGroups = hardcodedData.worker_groups.map((group: any, index: number) => ({
                id: group.id.toString(),
                name: group.name,
                description: group.description || '',
                isActive: false,
                color: getRandomColor(index),
            }));
            setWorkerGroups(parsedGroups);

            const parsedWorkers = hardcodedData.peeps.map((person: any) => ({
                id: person.id.toString(),
                tagId: person.tag_id.toString(),
                floor_name: person.floor_name || floorNames[person.floor] || '-',
                floor_physical: person.floor,
                xy: person.zone || [Math.floor(Math.random() * 66) + 10, Math.floor(Math.random() * 66) + 10],
                name: person.name ? person.name : 'Unnamed Worker',
                role: person.trade ? person.trade : 'Unknown',
                groups: person.groups.map((g: any) => g.toString()),
            }));
            setWorkers(parsedWorkers);

            // Initialize expanded state for worker groups
            const initialExpandedGroups: Record<string, boolean> = {};
            parsedGroups.forEach(group => {
                initialExpandedGroups[group.id] = false;
            });
            setExpandedGroups(initialExpandedGroups);
        }

        if (equipment.length === 0) {
            // Load equipment and groups
            const parsedGroups = hardcodedData.equipment_groups.map((group: any) => ({
                id: group.id.toString(),
                name: group.name,
                description: group.description || '',
                isActive: false
            }));
            setEquipmentGroups(parsedGroups);

            const parsedEquipment = hardcodedData.stuff.map((item: any) => ({
                id: item.id.toString(),
                tagId: item.tag_id.toString(),
                floor_physical: item.floor,
                floor_name: item.floor_name || floorNames[item.floor] || '-',
                name: item.name ? item.name : 'Unnamed Equipment',
                type: item.name ? item.name : 'Unnamed Equipment',
                xy: item.zone || [Math.floor(Math.random() * 66) + 10, Math.floor(Math.random() * 66) + 10],
                groups: item.groups.map((group: any) => group.toString())
            }));
            setEquipment(parsedEquipment);
        }

        if (sensors.length === 0) {
            // Load sensors and types
            const fetchedSensors = hardcodedData.sensors.map((sensor: any) => ({
                tagId: sensor.id.toString(),
                name: sensor.display_name,
                floor_name: sensor.floor_name || (sensor.floor_physical ? floorNames[sensor.floor_physical] : '-'),
                type: sensor.type,
                location: {
                    floor_physical: sensor.floor_physical,
                    xy: [
                        sensor.location_x ?? Math.floor(Math.random() * 66) + 10,
                        sensor.location_y ?? Math.floor(Math.random() * 66) + 10
                    ] as [number, number],
                    is_exact: true
                }
            }));
            setSensors(fetchedSensors);

            const fetchedTypes = Array.from(
                new Set(fetchedSensors.map((sensor: any) => sensor.type as string)) as Set<string>
            ).map(type => ({
                id: type,
                name: type,
            }));
            setSensorTypes(fetchedTypes);
        }

    }, [isOpen]);

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
                item.tagId.toLowerCase().includes(query)
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
        let filteredItemsList: (Worker | Equipment | Sensor)[] = [];
        let groupsList: (WorkerGroup | EquipmentGroup | SensorType)[] = [];

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
                item.tagId.toLowerCase().includes(query)
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
            const typesMap: { [key: string]: { id: string; name: string; items: Sensor[] } } = {};
            sensorTypes.forEach(type => {
                typesMap[type.name] = {
                    id: type.name,
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
                items: (Worker | Equipment | Sensor)[];
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
                color: 'color' in group ? group.color : undefined,
                items: []
            };
        });

        // Assign items to their groups
        filteredItemsList.forEach(item => {
            if (item.groups) {
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
        setCurrentSelection(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
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

    // Get selected count for current category
    const getCurrentSelectedCount = () => {
        return Object.values(getCurrentSelection()).filter(Boolean).length;
    };

    // Clear all selections
    const handleClearSelection = () => {
        if (mode === 'workers') {
            setSelectedWorkers({});
        } else if (mode === 'equipment') {
            setSelectedEquipment({});
        } else if (mode === 'sensors') {
            setSelectedSensors({});
        }
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
                sensors: selectedSensorObjs
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
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-3 ${group.items.every(item => getCurrentSelection()[item.tagId]) ? 'bg-cyan-500' : 'border border-gray-300'
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleGroupSelection(group.id, group.items);
                                            }}
                                        >
                                            {group.items.every(item => getCurrentSelection()[item.tagId]) &&
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
                                            {group.items.map(item => (
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