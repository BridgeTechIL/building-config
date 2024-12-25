import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, GripVertical, MapPin } from 'lucide-react';
import { Worker, WorkerGroup, workers as initialWorkers, workerGroups as initialWorkerGroups } from '@/config/workers';
import { MultiSelect } from '@/components/ui/MultiSelect';


const generateUniqueId = () => {
  return `G${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
};

type ViewMode = 'people' | 'groups';

const WorkersView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('people');
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [workerGroups, setWorkerGroups] = useState<WorkerGroup[]>(initialWorkerGroups);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [groupCounter, setGroupCounter] = useState(initialWorkerGroups.length);

  const handleWorkerUpdate = (tagId: string, updates: Partial<Worker>) => {
    setWorkers(prev => prev.map(worker => 
      worker.tagId === tagId ? { ...worker, ...updates } : worker
    ));
  };

  const handleAddGroup = () => {
    const newGroupId = generateUniqueId();
    const newGroup: WorkerGroup = {
      id: newGroupId,
      name: `Group ${groupCounter + 1}`,
      description: ''
    };
    
    setWorkerGroups(prev => [...prev, newGroup]);
    setGroupCounter(prev => prev + 1);
  };

  const handleDeleteGroup = (groupId: string) => {
    // Remove the group
    setWorkerGroups(prev => prev.filter(group => group.id !== groupId));
    
    // Remove the group from all workers
    setWorkers(prev => prev.map(worker => ({
      ...worker,
      groups: worker.groups.filter(gId => gId !== groupId)
    })));
  };

  const handleGroupUpdate = (groupId: string, updates: Partial<WorkerGroup>) => {
    setWorkerGroups(prev => 
      prev.map(group => 
        group.id === groupId ? { ...group, ...updates } : group
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
            floor_physical: Math.floor(Math.random() * 15) + 1,
            xy: [Math.floor(Math.random() * 66) + 5, Math.floor(Math.random() * 66) + 5],
            is_exact: true
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
        .filter(w => w.groups.includes(group.id))
        .map(worker => ({
          tag_id: worker.tagId,
          name: worker.name,
          location: {
            floor_physical: Math.floor(Math.random() * 15) + 1,
            xy: [Math.floor(Math.random() * 66) + 5, Math.floor(Math.random() * 66) + 5],
            is_exact: true
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
              <div className="col-span-2 text-gray-500">
                {worker.tagId}
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={worker.name}
                  onChange={(e) => handleWorkerUpdate(worker.tagId, { name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter worker name"
                />
              </div>
              <div className="col-span-5">
              <MultiSelect
                value={worker.groups}
                options={workerGroups.map(group => ({ id: group.id, name: group.name, label: group.name, value: group.id }))}
                onChange={(groups) => handleWorkerUpdate(worker.tagId, { groups })}
                placeholder="Select groups..."
              />
              </div>
              <div className="col-span-1 text-right">
                <button
                  onClick={() => handleLocateWorker(worker.tagId)}
                  className="text-gray-400 hover:text-cyan-500"
                >
                  <MapPin size={18} />
                </button>
              </div>
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
          <Plus size={18} />
          Add Group
        </button>
      </div>
      {workerGroups.map(group => {
        const groupWorkerCount = workers.filter(w => w.groups.includes(group.id)).length;
        
        return (
          <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center px-4 h-16">
              <div className="text-gray-400 cursor-grab">
                <GripVertical size={20} />
              </div>
              <div className="flex-1 ml-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleGroupUpdate(group.id, { name: e.target.value })}
                    className="font-medium text-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md px-2"
                  />
                  <span className="text-sm text-gray-500">
                    ({groupWorkerCount} workers)
                  </span>
                </div>
                <input
                  type="text"
                  value={group.description || ''}
                  onChange={(e) => handleGroupUpdate(group.id, { description: e.target.value })}
                  placeholder="Add group description"
                  className="text-sm text-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md px-2 mt-1 w-full"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLocateGroup(group.name)}
                  className="text-gray-400 hover:text-cyan-500 flex items-center"
                >
                  <MapPin size={18} /> Show Locations 
                  
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="text-red-400 hover:text-cyan-500 flex items-center"
                >
                  <Trash2 size={18} /> 
                  
                </button>
                <button 
                  onClick={() => setExpandedGroupId(
                    expandedGroupId === group.id ? null : group.id
                  )}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  {expandedGroupId === group.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>
            
            {expandedGroupId === group.id && (
              <div className="border-t">
                <div className="bg-gray-50 rounded-lg p-4">
                  {workers.filter(w => w.groups.includes(group.id)).map(worker => (
                    <div key={worker.tagId} className="flex items-center justify-between py-2 border-b last:border-0">
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