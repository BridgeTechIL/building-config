import { useState } from 'react';
import { 
    ChevronDown, 
    ChevronUp, 
    GripVertical, 
    Wifi,
    Camera,
    DoorOpen,
    Flame,
    Droplet,
    MapPin,
    Hand
} from 'lucide-react';
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
import { Zone } from '../../types/building';

export interface Floor {
  id: string;
  level: number;
  selected: boolean;
  isBase?: boolean;
  items: Record<string, number>;
  zones: Zone[];  // Add this new property
}

interface FloorItemProps {
  floor: Floor;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: (id: string) => void;
  onUpdateItem: (floorId: string, itemKey: string, value: number) => void;
  onClearItems: (floorId: string) => void;
}

interface FloorListProps {
  floors: Floor[];
  activeFloor?: number;
  onUpdateItem: (floorId: string, itemKey: string, value: number) => void;
  onUpdateOrder: (newOrder: Floor[]) => void;
  onClearItems: (floorId: string) => void;
}

function FloorItemComponent({ floor, isExpanded, isSelected, onToggleExpand, onUpdateItem, onClearItems }: FloorItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: floor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const items = [
    { key: 'gate', label: 'Personnel / Material Gate', icon: MapPin },
    { key: 'motionSensor', label: 'Motion Sensor', icon: Hand },
    { key: 'fireDetection', label: 'Fire Detection', icon: Flame },
    { key: 'waterDetection', label: 'Flood Detection', icon: Droplet },
    { key: 'floorDetection', label: 'Hoist Door Detection', icon: DoorOpen },
    { key: 'smartAICamera', label: 'Smart AI Camera', icon: Camera },
    { key: 'existingCamera', label: 'Smart AI for Existing Camera', icon: Camera },
    { key: 'wifi', label: 'WIFI', icon: Wifi },
  ];

  const handleUpdateItem = (itemKey: string, value: number) => {
    onUpdateItem(floor.id, itemKey, value);
  };

  const handleClearAll = () => {
    onClearItems(floor.id);
  };

  // Count non-zero items
  const nonZeroItemCount = Object.values(floor.items).filter(value => value > 0).length;

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
            {floor.id}
          </span>
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600">
              {nonZeroItemCount}
            </span>
            {isSelected && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600">
                Selected
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={() => onToggleExpand(floor.id)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-3 py-2"
        >
          {isExpanded ? "Hide items" : "View items"}
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="h-px bg-gray-100 mx-4" />
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Available items for floor</p>
              <button 
                onClick={handleClearAll}
                className="text-blue-500 hover:text-blue-600"
              >
                Clear all
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={24} className="text-gray-600" />
                    <span>{label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleUpdateItem(key, Math.max(0, (floor.items[key] || 0) - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{floor.items[key] || 0}</span>
                    <button 
                      onClick={() => handleUpdateItem(key, (floor.items[key] || 0) + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function FloorList({ floors, activeFloor, onUpdateItem, onUpdateOrder, onClearItems }: FloorListProps) {
  const [expandedFloorId, setExpandedFloorId] = useState<string | null>(null);

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
            <FloorItemComponent
              key={floor.id}
              floor={floor}
              isExpanded={expandedFloorId === floor.id}
              isSelected={floor.level === activeFloor}
              onToggleExpand={handleToggleExpand}
              onUpdateItem={onUpdateItem}
              onClearItems={onClearItems}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}