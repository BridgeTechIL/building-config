import React, { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Plus, Camera, Wifi, Trash2, AlertTriangle } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CameraModal from '../modals/CameraModal';
import { Floor } from '@/types/building';

interface Zone {
  id: string;
  name: string;
  isWifiPoint: boolean;
  isDangerPoint: boolean;
  gateId?: string;
  location: {
    floor_physical: number;
    xy: [number, number];
    is_exact: boolean;
  };
}


interface ZoneFloorItemProps {
  floor: Floor;
  floors: Floor[];
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onAddZone: (floorId: string) => void;
  onRemoveZone: (floorId: string, zoneId: string) => void;
  onUpdateZone: (floorId: string, zoneId: string, updates: Partial<Zone>) => void;
}

interface ZonesViewProps {
  floors: Floor[];
  onUpdateOrder: (newOrder: Floor[]) => void;
  onAddZone: (floorId: string) => void;
  onRemoveZone: (floorId: string, zoneId: string) => void;
  onUpdateZone: (floorId: string, zoneId: string, updates: Partial<Zone>) => void;
}

function ZoneFloorItem({
  floor,
  floors,
  isExpanded,
  onToggleExpand,
  onAddZone,
  onRemoveZone,
  onUpdateZone
}: ZoneFloorItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: floor.id });

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Function to communicate with the iframe
  const notifyIframeOfFloorChange = (floorNumber: number, isExpanded: boolean) => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'FLOOR_TOGGLE',
        floorNumber: floorNumber,
        action: isExpanded ? 'expand' : 'collapse'
      }, '*');
    }
  };

  const handleToggle = (id: string) => {
    const floorNumber = floor.isBase ? 0 : floor.level;
    notifyIframeOfFloorChange(floorNumber, !isExpanded);
    onToggleExpand(id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-sm border border-gray-100"
    >
      <div className="flex items-center px-4 h-16">
        <div className="text-gray-400 cursor-grab" {...attributes} {...listeners}>
          <GripVertical size={20} />
        </div>
        <div className="flex-1 flex items-center gap-4 ml-2">
          <span className="font-medium text-lg">
            {floor.isBase ? 'Ground Floor' : `Level ${floor.level}`}
          </span>
          <span className="text-sm text-gray-500">
            {floor.zones.length} Zones
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddZone(floor.id)}
              className="flex items-center gap-1 text-cyan-500 hover:text-cyan-600 px-3 py-2"
            >
              <Plus size={18} />
              Add Zone
            </button>
            <button
              onClick={() => setIsCameraModalOpen(true)}
              className="flex items-center gap-1 text-cyan-500 hover:text-cyan-600 px-3 py-2"
            >
              <Camera size={18} />
              View Cameras
            </button>
            <button
              onClick={() => handleToggle(floor.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-3 py-2"
            >
              {isExpanded ? "Hide zones" : "View zones"}
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="h-px bg-gray-100 mx-4" />
          <div className="p-4">
            {floor.zones.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No zones defined. Click Add Zone to create one.
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 font-medium mb-4">
                  <div className="col-span-5">NAME</div>
                  <div className="col-span-2">GATE ID</div>
                  <div className="col-span-2">WIFI</div>
                  <div className="col-span-2">DANGER</div>
                  <div className="col-span-1"></div>
                </div>
                <div className="space-y-3">
                  {floor.zones.map((zone) => (
                    <div key={zone.id} className="grid grid-cols-12 gap-4 items-center border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => onUpdateZone(floor.id, zone.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
                          placeholder="Zone name"
                        />
                      </div>
                      <div className="col-span-2 text-gray-500">
                        {zone.gateId}
                      </div>
                      <div className="col-span-2">
                        <button
                          onClick={() => onUpdateZone(floor.id, zone.id, { isWifiPoint: !zone.isWifiPoint })}
                          className={`p-2 rounded-md ${zone.isWifiPoint ? 'text-cyan-500 bg-white' : 'text-gray-400 bg-white'}`}
                        >
                          <Wifi size={18} />
                        </button>
                      </div>
                      <div className="col-span-2">
                        <button
                          onClick={() => onUpdateZone(floor.id, zone.id, { isDangerPoint: !zone.isDangerPoint })}
                          className={`p-2 rounded-md ${zone.isDangerPoint ? 'text-red-500 bg-white' : 'text-gray-400 bg-white'}`}
                        >
                          <AlertTriangle size={18} />
                        </button>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => onRemoveZone(floor.id, zone.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {isCameraModalOpen && (
        <CameraModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          floor={floor}
          floors={floors}
        />
      )}
    </div>
  );
}

export default function ZonesView({
  floors,
  onUpdateOrder,
  onAddZone,
  onRemoveZone,
  onUpdateZone
}: ZonesViewProps) {
  const [expandedFloorId, setExpandedFloorId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleExpand = (floorId: string) => {
    setExpandedFloorId(prevId => prevId === floorId ? null : floorId);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = floors.findIndex(item => item.id === active.id);
      const newIndex = floors.findIndex(item => item.id === over?.id);

      if (floors[oldIndex].isBase || newIndex === 0) return;

      const newOrder = arrayMove(floors, oldIndex, newIndex);
      onUpdateOrder(newOrder);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={floors.map(f => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {floors.map((floor) => (
            <ZoneFloorItem
              key={floor.id}
              floor={floor}
              floors={floors}
              isExpanded={expandedFloorId === floor.id}
              onToggleExpand={handleToggleExpand}
              onAddZone={onAddZone}
              onRemoveZone={onRemoveZone}
              onUpdateZone={onUpdateZone}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}