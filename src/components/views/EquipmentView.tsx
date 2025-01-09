import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronUp, Plus, Trash2, GripVertical, MapPin} from 'lucide-react';
import {Equipment, EquipmentGroup} from '@/config/equipment';
import {MultiSelect} from '@/components/ui/MultiSelect';
import {useSearchParams} from "next/navigation";

const generateUniqueId = () => {
    return `G${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
};

type ViewMode = 'equipment' | 'groups';

interface EquipmentViewProps {
    updateDB: (projectId: string, action: string, itemName: string, itemId: number, column: string, value: any) => Promise<any>;
}

const EquipmentView = ({updateDB}: EquipmentViewProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>('equipment');
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroup[]>([]);
    const searchParams = useSearchParams(); // Access search params
    const projectId = searchParams.get('project_id'); // Get the "project_id" param

    useEffect(() => {
        fetch(`https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d?project_id=${projectId}`)
            .then(response => response.json())
            .then(data => {
                const parsedGroups = data.equipment_groups.map((group: any) => ({
                    id: group.id.toString(),
                    name: group.name,
                    description: group.description,
                    isActive: false
                }));
                setEquipmentGroups(parsedGroups);
                const parsedEquipment = data.stuff.map((item: any) => ({
                    id: item.id.toString(),
                    tagId: item.tag_id.toString(),
                    floor_physical: item.floor,
                    name: item.name ? item.name : 'Unnamed Equipment',
                    type: item.name ? item.name : 'Unnamed Equipment',
                    xy: item.zone || [Math.floor(Math.random() * 66) + 10, Math.floor(Math.random() * 66) + 10],
                    groups: item.groups.map((group: any) => group.toString())
                }));
                setEquipment(parsedEquipment);

            })
            .catch(error => console.error('Error fetching equipment:', error));
    }, []);


    const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
    const [groupCounter, setGroupCounter] = useState(equipmentGroups.length);

    const handleEquipmentUpdate = (id: string, updates: Partial<Equipment>) => {
        if (projectId) {
            const key = Object.keys(updates)[0];
            const value = Object.values(updates)[0];
            updateDB(projectId,'rename', 'tags', parseInt(id, 10), key, value);
        }
        setEquipment(prev => prev.map(item =>
            item.id === id ? {...item, ...updates} : item
        ));
    };

    const handleAddGroup = () => {
        const newGroupName = `Group ${groupCounter + 1}`;
        if (projectId) {
            updateDB(projectId,'add_group', 'groups', 2 , newGroupName, '')
                .then((data: { id: number; }) => {
                if (data.id) {
                    const newGroupId = data.id;
                    const newGroup: EquipmentGroup = {
                        id: newGroupId.toString(),
                        name: newGroupName,
                        description: '',
                        isActive: false
                    };
                    setEquipmentGroups(prev => [...prev, newGroup]);
                    setGroupCounter(prev => prev + 1);
                }
            });
        }
    };


    const handleDeleteGroup = (groupId: string) => {
        if (projectId) {
            updateDB(projectId,'delete_group', 'groups', parseInt(groupId, 10), '', '');
        }
        setEquipmentGroups(prev => prev.filter(group => group.id !== groupId));

        // Remove the group from all equipment
        setEquipment(prev => prev.map(item => ({
            ...item,
            groups: item.groups.filter(gId => gId !== groupId)
        })));
    };

    const handleGroupUpdate = (groupId: string, updates: Partial<EquipmentGroup>) => {
        if (projectId) {
            const key = Object.keys(updates)[0];
            const value = Object.values(updates)[0];
            updateDB(projectId,'rename', 'groups', parseInt(groupId, 10), key, value);
        }
        setEquipmentGroups(prev =>
            prev.map(group =>
                group.id === groupId ? {...group, ...updates} : group
            )
        );
    };

    const handleGroupChange = (itemId: string, groups: Partial<Equipment>) => {
        if (projectId) {
            const key = Object.keys(groups)[0];
            const value = Object.values(groups)[0];
            updateDB(projectId,'change_groups', 'groups', parseInt(itemId, 10), key, value);
        }
        setEquipment(prev => prev.map(item =>
            item.id === itemId ? {...item, ...groups} : item
        ));
    }

    const handleLocateEquipment = (tagId: string, name: string) => {
        const eqp = equipment.find(e => e.tagId === tagId);
        if (eqp && eqp.floor_physical !== null) {
            const eqpLocation = [
                {
                    tag_id: eqp.tagId,
                    name: eqp.name,
                    location: {
                        floor_physical: eqp.floor_physical,
                        xy: eqp.xy,
                        is_exact: false
                    }
                }
            ];
            showEquipmentIframe(name, eqpLocation);
        }
    };

    const showEquipmentIframe = (title: string, equipment: Array<object>) => {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'SHOW_ITEMS',
                data: {
                    type: 'equipment',
                    title: title,
                    items: equipment
                },
            }, '*');
        }
    };

    const handleLocateGroup = (groupId: string) => {
        const updatedGroups = equipmentGroups.map(g =>
            g.id === groupId ? {...g, isActive: !g.isActive} : g
        );
        setEquipmentGroups(updatedGroups);
        const activeGroups = updatedGroups.filter(g => g.isActive);
        const groupEquipment = equipment
            .filter(eq => eq.groups.some(gId => activeGroups.map(g => g.id).includes(gId)) && eq.floor_physical !== null)
            .map(eq => ({
                tag_id: eq.tagId,
                name: eq.name,
                location: {
                    floor_physical: eq.floor_physical,
                    xy: eq.xy,
                    is_exact: false
                }
            }));

        const groupNames = activeGroups.map(g => g.name).join(', ');
        showEquipmentIframe(groupNames, groupEquipment);
    };

    const renderEquipmentView = () => (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 font-medium mb-4">
                <div className="col-span-2">TAG ID</div>
                <div className="col-span-4">NAME</div>
                <div className="col-span-5">GROUPS</div>
            </div>
            {equipment.map((item) => (
                <div key={item.tagId} className="bg-white rounded-lg p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col text-gray-500">
                            {item.tagId}
                        </div>
                        <div className="col-span-3">
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleEquipmentUpdate(item.id, {name: e.target.value})}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800"
                                placeholder="Enter equipment name"
                            />
                        </div>
                        <div className="col-span-7 text-gray-500">
                            <MultiSelect
                                value={item.groups}
                                options={equipmentGroups.map(group => ({
                                    id: group.id,
                                    name: group.name,
                                    label: group.name,
                                    value: group.id
                                }))}
                                onChange={(groups) => handleGroupChange(item.id, {groups})}
                                placeholder="Select groups..."
                            />
                        </div>
                        {item.floor_physical !== null && (<div className="col-span-1 text-right">
                            <button
                                onClick={() => handleLocateEquipment(item.tagId, item.name)}
                                className="text-gray-400 hover:text-cyan-500"
                            >
                                <MapPin size={18}/>
                            </button>
                        </div>)}
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
            {equipmentGroups.map(group => {
                const groupItemCount = equipment.filter(w => w.groups.includes(group.id)).length;
                const groupOnSiteCount = equipment.filter(w => w.groups.includes(group.id) && w.floor_physical !== null).length;

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
                                      {groupItemCount}
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
                                      ({groupOnSiteCount} on site)
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        handleLocateGroup(group.id);
                                    }}
                                    className={`flex items-center ${group.isActive ? 'text-cyan-500' : 'text-gray-400'} hover:text-cyan-500`}
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
                                    {equipment.filter(w => w.groups.includes(group.id)).map(item => (
                                        <div key={item.tagId}
                                             className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-500">{item.tagId}</span>
                                                <span>{item.name || 'Unnamed Equipment'}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {equipment.filter(w => w.groups.includes(group.id)).length === 0 && (
                                        <div className="text-center text-gray-500 py-4">
                                            No equipment in this group
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
                        onClick={() => setViewMode('equipment')}
                        className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                            viewMode === 'equipment'
                                ? 'bg-cyan-500 shadow-sm text-white'
                                : 'text-gray-500'
                        }`}
                    >
                        Equipment
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
                    {viewMode === 'equipment' ? renderEquipmentView() : renderGroupsView()}
                </div>
            </div>
        </div>
    );
};

export default EquipmentView;