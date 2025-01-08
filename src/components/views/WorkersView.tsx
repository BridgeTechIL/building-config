import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronUp, Plus, Trash2, GripVertical, MapPin} from 'lucide-react';
import {Worker, WorkerGroup} from '@/config/workers';
import {MultiSelect} from '@/components/ui/MultiSelect';
import {useSearchParams} from "next/navigation";
import {Equipment} from "@/config/equipment";


const generateUniqueId = () => {
    return `G${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
};

type ViewMode = 'people' | 'groups';

interface WorkersViewProps {
    updateDB: (projectId: string, action: string, itemName: string, itemId: number, column: string, value: any) => Promise<any>;
}

const WorkersView = ({updateDB}: WorkersViewProps) => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [workerGroups, setWorkerGroups] = useState<WorkerGroup[]>([]);
    const searchParams = useSearchParams(); // Access search params
    const projectId = searchParams.get('project_id'); // Get the "project_id" param
    const [showColorDropdown, setShowColorDropdown] = useState<string | null>(null);
    const groupColors = {
        'Yellow': '#FFFF00',
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Pink': '#f652b6',
        'White': '#FFFFFF',
        'Black': '#000000',
        'Brown': '#795548',
        'Green': '#008000',
        'Purple': '#800080',
        'Deep Orange': '#FF5722',
        'Blue Grey': '#607D8B',
        'Violet': '#673AB7',
        'Fuchsia': '#FF00FF',
        'Teal': '#009688',
        'Cyan': '#00BCD4',
        'Lime': '#CDDC39',
        'Silver': '#C0C0C0',
        'Indigo': '#3F51B5',
        'Amber': '#FFC107',
        'Light Blue': '#03A9F4',
        'Deep Purple': '#673AB7',
        'Light Green': '#8BC34A',
        'Orange': '#FF9800',

        }

    useEffect(() => {
        fetch(`https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d?project_id=${projectId}`)
            .then(response => response.json())
            .then(data => {
                const parsedGroups = data.worker_groups.map((group: any, index: number) => ({
                    id: group.id.toString(),
                    name: group.name,
                    description: group.description,
                    color: Object.values(groupColors)[index % Object.keys(groupColors).length]
                }));
                setWorkerGroups(parsedGroups);

                const parsedWorkers = data.peeps.map((person: any) => ({
                    id: person.id.toString(),
                    tagId: person.tag_id.toString(),
                    floor_physical: person.floor,
                    xy: person.zone || [Math.floor(Math.random() * 66) + 10, Math.floor(Math.random() * 66) + 10],
                    name: person.name ? person.name : 'Unnamed Worker',
                    role: person.trade ? person.trade : 'Unknown',
                    groups: person.groups.map((g: any) => g.toString()),
                }));
                setWorkers(parsedWorkers);
                const peepCount = document.getElementById('peepCount');
                if (peepCount) {
                    peepCount.textContent = ` (${parsedWorkers.filter((w: any) => w.floor_physical !== null).length}/${parsedWorkers.length})`;
                }


            })
            .catch(error => console.error('Error fetching workers:', error));
    }, []);

    const [viewMode, setViewMode] = useState<ViewMode>('people');
    const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
    const [groupCounter, setGroupCounter] = useState(workerGroups.length);

    const handleWorkerUpdate = (id: string, updates: Partial<Worker>) => {
        if (projectId) {
            const key = Object.keys(updates)[0];
            const value = Object.values(updates)[0];
            updateDB(projectId,'rename', 'tags', parseInt(id, 10), key, value);
        }
        setWorkers(prev => prev.map(worker =>
            worker.id === id ? {...worker, ...updates} : worker
        ));
    };

    const handleGroupChange = (itemId: string, groups: Partial<Equipment>) => {
        if (projectId) {
            const key = Object.keys(groups)[0];
            const value = Object.values(groups)[0];
            updateDB(projectId,'change_groups', 'groups', parseInt(itemId, 10), key, value);
        }
        setWorkers(prev => prev.map(item =>
            item.id === itemId ? {...item, ...groups} : item
        ));
    }

    const handleAddGroup = () => {
        const newGroupName = `Group ${groupCounter + 1}`;
        if (projectId) {
            updateDB(projectId,'add_group', 'groups', 1 , newGroupName, '')
                .then((data: { id: number; }) => {
                if (data.id) {
                    const newGroupId = data.id;
                    const newGroup: WorkerGroup = {
                        id: newGroupId.toString(),
                        name: newGroupName,
                        description: '',
                        color: Object.values(groupColors)[workerGroups.length % Object.keys(groupColors).length]
                    };
                    setWorkerGroups(prev => [...prev, newGroup]);
                    setGroupCounter(prev => prev + 1);
                }
            });
        }
    };

    const handleDeleteGroup = (groupId: string) => {
        if (projectId) {
            updateDB(projectId,'delete_group', 'groups', parseInt(groupId, 10), '', '');
        }
        setWorkerGroups(prev => prev.filter(group => group.id !== groupId));

        // Remove the group from all workers
        setWorkers(prev => prev.map(worker => ({
            ...worker,
            groups: worker.groups.filter(gId => gId !== groupId)
        })));
    };

    const setGroupColor = (groupId: string, color: string) => {
        setWorkerGroups(prev =>
            prev.map(group =>
                group.id === groupId ? {...group, color} : group
            )
        );
    }

    const handleGroupUpdate = (groupId: string, updates: Partial<WorkerGroup>) => {
        if (projectId) {
            const key = Object.keys(updates)[0];
            const value = Object.values(updates)[0];
            updateDB(projectId,'rename', 'groups', parseInt(groupId, 10), key, value);
        }
        setWorkerGroups(prev =>
            prev.map(group =>
                group.id === groupId ? {...group, ...updates} : group
            )
        );
    };

    const showWorkersIframe = (title: string, workers: Array<object>) => {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'SHOW_ITEMS',
                data: {type: 'ppl', title: title, items: workers},
            }, '*');
        }
    };

    const handleLocateWorker = (tagId: string) => {
        const worker = workers.find(w => w.tagId === tagId);
        if (worker) {
            const workerLocation = [
                {
                    tag_id: worker.tagId,
                    name: worker.name,
                    location: {
                        floor_physical: worker.floor_physical,
                        xy: worker.xy,
                        is_exact: false
                    }
                }
            ];
            showWorkersIframe(worker.name, workerLocation);
        }
    };

    const handleLocateGroup = (groupName: string) => {
        const group = workerGroups.find(g => g.name === groupName);
        if (group) {
            // Find all workers in this group
            const groupWorkers = workers
                .filter(w => w.groups.includes(group.id) && w.floor_physical !== null)
                .map(worker => ({
                    tag_id: worker.tagId,
                    name: worker.name,
                    color: group.color,
                    location: {
                        floor_physical: worker.floor_physical,
                        xy: worker.xy,
                        is_exact: false
                    }
                }));

            showWorkersIframe(groupName, groupWorkers);
        }
    };


    const renderPeopleView = () => (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 font-medium mb-4">
                <div className="col-span-2">TAG ID</div>
                <div className="col-span-4">NAME</div>
                <div className="col-span-5">GROUPS</div>

            </div>
            {workers.map((worker) => (
                <div key={worker.tagId} className="bg-white rounded-lg p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col text-gray-500">
                            {worker.tagId}
                        </div>
                        <div className="col-span-3">
                            <input
                                type="text"
                                value={worker.name}
                                onChange={(e) => handleWorkerUpdate(worker.id, {name: e.target.value})}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800"
                                placeholder="Enter worker name"
                            />
                        </div>
                        <div className="col-span-7 text-gray-500">
                            <MultiSelect
                                value={worker.groups}
                                options={workerGroups.map(group => ({
                                    id: group.id,
                                    name: group.name,
                                    label: group.name,
                                    value: group.id
                                }))}
                                onChange={(groups) => handleGroupChange(worker.id, {groups})}
                                placeholder="Select groups..."
                            />
                        </div>
                        {worker.floor_physical !== null && (
                            <div className="col-span-1 text-right">
                                <button
                                    onClick={() => handleLocateWorker(worker.tagId)}
                                    className="text-gray-400 hover:text-cyan-500"
                                >
                                    <MapPin size={18}/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderGroupsView = () => (
        <div className="space-y-4">
            <div className="flex justify-start mb-4">
                <button
                    onClick={handleAddGroup}
                    className="flex items-center gap-1 text-cyan-500 hover:text-cyan-600 px-3 py-0"
                >
                    <Plus size={18}/>
                    Add Group
                </button>
            </div>
            {workerGroups.map(group => {
                const groupWorkerCount = workers.filter(w => w.groups.includes(group.id)).length;
                const groupWorkerOnSiteCount = workers.filter(w => w.groups.includes(group.id) && w.floor_physical !== null).length;

                return (
                    <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center px-4 h-16">
                            <div className="text-gray-400 cursor-grab">
                                <GripVertical size={20}/>
                            </div>
                            <div className="flex-1 ml-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={group.name}
                                        onChange={(e) => handleGroupUpdate(group.id, {name: e.target.value})}
                                        className="font-medium text-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md px-2 text-gray-800 mr-10"
                                    />
                                    <span className="text-lg text-gray-500">
                                      {groupWorkerCount}
                                    </span>
                                </div>
                                <div  className="flex items-center">
                                <input
                                    type="text"
                                    value={group.description || ''}
                                    onChange={(e) => handleGroupUpdate(group.id, {description: e.target.value})}
                                    placeholder="Add group description"
                                    className="text-sm text-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md px-2 mt-1 mr-20"
                                />
                                <span className="text-sm text-gray-500">
                                      ({groupWorkerOnSiteCount} on site)
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <button
                                        style={{backgroundColor: group.color}}
                                        className="w-7 h-7 rounded-full border border-gray-300"
                                        onClick={() => setShowColorDropdown(prev => (prev === group.id ? null : group.id))}
                                    />
                                    {showColorDropdown === group.id && (
                                        <div
                                            className="absolute left-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-10">
                                            {Object.entries(groupColors).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                    onClick={() => {
                                                        setGroupColor(group.id, value);
                                                        setShowColorDropdown(null);
                                                    }}
                                                    >
                                                    <span
                                                        className="w-4 h-4 rounded-full mr-2"
                                                        style={{
                                                            backgroundColor: value,
                                                            border: value === "#FFFFFF" ? "1px solid #000000" : "none",
                                                        }}
                                                    />
                                                    <span style={{color: value === "#FFFFFF" ? "#000000" : value,}}>{key}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleLocateGroup(group.name)}
                                    className="text-gray-400 hover:text-cyan-500 flex items-center"
                                >
                                    <MapPin size={18}/> Show Locations

                                </button>
                                <button
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="text-red-400 hover:text-cyan-500 flex items-center"
                                >
                                    <Trash2 size={18}/>

                                </button>
                                <button
                                    onClick={() => setExpandedGroupId(
                                        expandedGroupId === group.id ? null : group.id
                                    )}
                                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-3 py-2"
                                >
                                    {expandedGroupId === group.id ? (
                                        <ChevronUp size={20}/>
                                    ) : (
                                        <ChevronDown size={20}/>
                                    )}
                                </button>
                            </div>
                        </div>

                        {expandedGroupId === group.id && (
                            <div className="border-t">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {workers.filter(w => w.groups.includes(group.id)).map(worker => (
                                        <div key={worker.tagId}
                                             className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-500">{worker.tagId}</span>
                                                <span>{worker.name || 'Unnamed Worker'}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {workers.filter(w => w.groups.includes(group.id)).length === 0 && (
                                        <div className="text-center text-gray-500 py-4">
                                            No workers in this group
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-0">
                <div className="inline-flex p-1 bg-gray-50 rounded-full w-full mb-4">
                    <button
                        onClick={() => setViewMode('people')}
                        className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                            viewMode === 'people'
                                ? 'bg-cyan-500 shadow-sm text-white'
                                : 'text-gray-500'
                        }`}
                    >
                        People
                    </button>
                    <button
                        onClick={() => setViewMode('groups')}
                        className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                            viewMode === 'groups'
                                ? 'bg-cyan-500 shadow-sm text-white'
                                : 'text-gray-500'
                        }`}
                    >
                        Groups
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {viewMode === 'people' ? renderPeopleView() : renderGroupsView()}
                </div>
            </div>
        </div>
    );
};

export default WorkersView;