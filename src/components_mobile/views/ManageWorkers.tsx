import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, List, ListTree, MoreVertical, Pencil, X } from 'lucide-react';
import { getMockProjectData, updateItemInDatabase } from '@/utils/dataUtils';
import { MultiSelect } from '@/components/ui/MultiSelect';

interface WorkersViewProps {
    onBack: () => void;
    projectId?: string | null;
    updateDB?: (projectId: string, action: string, itemName: string, itemId: number, column: string, value: any) => Promise<any>;
}

// Worker item component for rendering individual workers
const WorkerItem = ({ worker, groups, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(worker.name);

    const handleGroupChange = (selectedGroups) => {
        onUpdate(worker.id, { groups: selectedGroups });
    };

    return (
        <div className="flex flex-col py-3 border-b border-gray-200">
            <div className="flex items-center">
                <div className="w-10 text-center text-gray-500 font-medium">
                    {worker.tagId}
                </div>
                <div className="flex-1 px-2">
                    {isEditing ? (
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={() => {
                                    onUpdate(worker.id, { name });
                                    setIsEditing(false);
                                }}
                                className="flex-1 py-1 px-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div
                            className="cursor-text"
                            onClick={() => setIsEditing(true)}
                        >
                            {worker.name}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-2 pl-10 pr-2">
                <MultiSelect
                    value={worker.groups}
                    options={groups.map(group => ({
                        id: group.id,
                        name: group.name,
                        label: group.name,
                        value: group.id
                    }))}
                    onChange={handleGroupChange}
                    placeholder="Select groups..."
                />
            </div>
        </div>
    );
};
// Group item component for rendering groups
const GroupItem = ({ group, workers, onUpdate, onDelete, onColorChange, onWorkerUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(group.name);

    const groupWorkers = workers.filter(w => w.groups.includes(group.id));

    return (
        <div className="bg-white rounded-lg shadow-sm mt-3 overflow-hidden">
            <div className="p-3">
                <div className="flex items-center">
                    <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: group.color }}
                    />
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={() => {
                                    onUpdate(group.id, { name });
                                    setIsEditing(false);
                                }}
                                className="w-full px-2 border rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
                                autoFocus
                            />
                        ) : (
                            <div
                                className="cursor-text"
                                onClick={() => setIsEditing(true)}
                            >
                                {group.name} ({groupWorkers.length})
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            className="ml-7 p-1 text-gray-400 hover:text-gray-600"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? (
                                <ChevronLeft className="transform rotate-90" size={18} />
                            ) : (
                                <ChevronLeft className="transform -rotate-90" size={18} />
                            )}
                        </button>
                    </div>
                </div>
                
            </div>

            {isExpanded && (
                <div className="border-t border-gray-100">
                    {groupWorkers.length > 0 ? (
                        <div className="p-1">
                            {groupWorkers.map(worker => (
                                <div key={worker.id} className="py-2 px-4 flex justify-between items-center text-sm border-b last:border-0">
                                    <div className="flex items-center">
                                        <span className="text-gray-500 mr-2">{worker.tagId}</span>
                                        <span>{worker.name}</span>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-500"
                                        onClick={() => {
                                            // Remove worker from this group
                                            const updatedGroups = worker.groups.filter(g => g !== group.id);
                                            onWorkerUpdate(worker.id, { groups: updatedGroups });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No workers in this group
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MobileWorkersView: React.FC<WorkersViewProps> = ({ onBack, projectId = null, updateDB }) => {
    const [viewMode, setViewMode] = useState<'people' | 'groups'>('people');
    const [searchQuery, setSearchQuery] = useState('');
    const [workers, setWorkers] = useState<any[]>([]);
    const [workerGroups, setWorkerGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Define group colors
    const groupColors = {
        'Yellow': '#FFFF00',
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Pink': '#f652b6',
        'Green': '#8BC34A',
        'Purple': '#800080',
        'Orange': '#FF9800',
        'Teal': '#009688',
        'Indigo': '#3F51B5'
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (projectId) {
                    // Fetch from API if project ID is available
                    const response = await fetch(`https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d?project_id=${projectId}`);
                    const data = await response.json();

                    const parsedGroups = data.worker_groups.map((group: any, index: number) => ({
                        id: group.id.toString(),
                        name: group.name,
                        isActive: false,
                        color: Object.values(groupColors)[index % Object.keys(groupColors).length]
                    }));

                    const parsedWorkers = data.peeps.map((person: any) => ({
                        id: person.id.toString(),
                        tagId: person.tag_id.toString(),
                        floor_physical: person.floor,
                        floor_name: person.floor_name,
                        xy: person.zone || [Math.floor(Math.random() * 66) + 10, Math.floor(Math.random() * 66) + 10],
                        name: person.name || 'Unnamed Worker',
                        role: person.trade || 'Unknown',
                        groups: person.groups ? person.groups.map((g: any) => g.toString()) : [],
                    }));

                    setWorkerGroups(parsedGroups);
                    setWorkers(parsedWorkers);
                } else {
                    // Use mock data if no project ID
                    const data = getMockProjectData();

                    const parsedGroups = data.worker_groups.map((group: any, index: number) => ({
                        id: group.id.toString(),
                        name: group.name,
                        isActive: false,
                        color: Object.values(groupColors)[index % Object.keys(groupColors).length]
                    }));

                    const parsedWorkers = data.peeps.map((person: any) => ({
                        id: person.id.toString(),
                        tagId: person.tag_id.toString(),
                        floor_physical: person.floor,
                        floor_name: person.floor_name,
                        xy: person.zone || [Math.floor(Math.random() * 66) + 10, Math.floor(Math.random() * 66) + 10],
                        name: person.name || 'Unnamed Worker',
                        role: person.trade || 'Unknown',
                        groups: person.groups ? person.groups.map((g: any) => g.toString()) : [],
                    }));

                    setWorkerGroups(parsedGroups);
                    setWorkers(parsedWorkers);
                }
            } catch (error) {
                console.error('Error fetching worker data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    const handleWorkerUpdate = (id: string, updates: any) => {
        if (projectId && updateDB) {
            const key = Object.keys(updates)[0];
            const value = Object.values(updates)[0];

            // Handle group updates differently
            if (key === 'groups') {
                updateDB(projectId, 'change_groups', 'tags', parseInt(id, 10), key, value);
            } else {
                updateDB(projectId, 'rename', 'tags', parseInt(id, 10), key, value);
            }
        }

        setWorkers(prev => prev.map(worker =>
            worker.id === id ? { ...worker, ...updates } : worker
        ));
    };

    const handleGroupUpdate = (id: string, updates: any) => {
        if (projectId && updateDB) {
            const key = Object.keys(updates)[0];
            const value = Object.values(updates)[0];
            updateDB(projectId, 'rename', 'groups', parseInt(id, 10), key, value);
        }

        setWorkerGroups(prev => prev.map(group =>
            group.id === id ? { ...group, ...updates } : group
        ));
    };

    const handleDeleteGroup = (id: string) => {
        if (projectId && updateDB) {
            updateDB(projectId, 'delete_group', 'groups', parseInt(id, 10), '', '');
        }

        setWorkerGroups(prev => prev.filter(group => group.id !== id));

        // Remove the group from all workers
        setWorkers(prev => prev.map(worker => ({
            ...worker,
            groups: worker.groups.filter((gId: string) => gId !== id)
        })));
    };

    const handleAddGroup = () => {
        const newGroupName = `Group ${workerGroups.length + 1}`;
        const newGroup = {
            id: `temp_${Date.now()}`, // Temporary ID until API responds
            name: newGroupName,
            isActive: false,
            color: Object.values(groupColors)[workerGroups.length % Object.keys(groupColors).length]
        };

        setWorkerGroups(prev => [...prev, newGroup]);

        if (projectId && updateDB) {
            updateDB(projectId, 'add_group', 'groups', 1, newGroupName, '')
                .then((data: { id: number }) => {
                    if (data.id) {
                        // Update the temporary ID with the real one from the API
                        setWorkerGroups(prev =>
                            prev.map(group =>
                                group.id === newGroup.id
                                    ? { ...group, id: data.id.toString() }
                                    : group
                            )
                        );
                    }
                })
                .catch(error => {
                    console.error('Error adding group:', error);
                    // Remove the temporary group on error
                    setWorkerGroups(prev => prev.filter(group => group.id !== newGroup.id));
                });
        }
    };

    // Filter workers and groups based on search query
    const filteredWorkers = workers.filter(worker =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = workerGroups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Also include groups that have workers matching the search query
        workers.some(w =>
            w.groups.includes(group.id) &&
            (w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.tagId.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="p-4 flex items-center border-b bg-white">
                <button
                    onClick={onBack}
                    className="p-2 mr-2 rounded-full hover:bg-gray-100"
                    aria-label="Go back"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-semibold flex-1 text-center">Workers</h1>
            </div>

            {/* Search and View Toggle */}
            <div className="p-4 bg-white flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex bg-gray-100 rounded-full">
                    <button
                        onClick={() => setViewMode('people')}
                        className={`p-3 rounded-l-full ${viewMode === 'people' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('groups')}
                        className={`p-3 rounded-r-full ${viewMode === 'groups' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
                    >
                        <ListTree size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 pt-0">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                ) : viewMode === 'people' ? (
                    // People View
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-3">
                        {filteredWorkers.length > 0 ? (
                            filteredWorkers.map((worker, index) => (
                                <WorkerItem
                                    key={worker.id}
                                    worker={worker}
                                    groups={workerGroups}
                                    onUpdate={handleWorkerUpdate}
                                />
                            ))
                        ) : (
                            <div className="p-5 text-center text-gray-500">
                                No workers found matching your search.
                            </div>
                        )}
                    </div>
                ) : (
                    // Groups View
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mt-2">
                            <button
                                onClick={handleAddGroup}
                                className="flex items-center justify-center py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            >
                                + Add Group
                            </button>
                        </div>

                        {filteredGroups.length > 0 ? (
                            filteredGroups.map(group => (
                                <GroupItem
                                    key={group.id}
                                    group={group}
                                    workers={workers}
                                    onUpdate={handleGroupUpdate}
                                    onDelete={handleDeleteGroup}
                                    onColorChange={(color: string) => handleGroupUpdate(group.id, { color })}
                                    onWorkerUpdate={handleWorkerUpdate}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                                No groups found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileWorkersView;