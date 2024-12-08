import { useState } from 'react';
import FloorList from '@/components/building/FloorList';

interface Floor {
  id: string;
  level: number;
  selected: boolean;
  isBase?: boolean;
  items: Record<string, number>;
}

interface FloorConfigProps {
  floors: Floor[];
  activeFloor?: number;
  onUpdateItem: (floorId: string, itemKey: string, value: number) => void;
  onUpdateOrder: (newOrder: Floor[]) => void;
  onClearItems: (floorId: string) => void;
}

export default function FloorConfig({ 
  floors, 
  activeFloor, 
  onUpdateItem, 
  onUpdateOrder, 
  onClearItems 
}: FloorConfigProps) {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <div className="flex flex-col h-[calc(100vh-13.5rem)]">
      <div className="p-6">
        <div className="inline-flex p-1 bg-gray-50 rounded-full w-full">
          <button
            onClick={() => setActiveTab('planning')}
            className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
              activeTab === 'planning' 
                ? 'bg-white shadow-sm' 
                : 'text-gray-500'
            }`}
          >
            Floor Planning
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
              activeTab === 'items' 
                ? 'bg-white shadow-sm' 
                : 'text-gray-500'
            }`}
          >
            Building Items
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {activeTab === 'planning' && 
          <FloorList 
            floors={floors}
            activeFloor={activeFloor}
            onUpdateItem={onUpdateItem}
            onUpdateOrder={onUpdateOrder}
            onClearItems={onClearItems}
          />
        }
        {activeTab === 'items' && <div>Building Items Content</div>}
      </div>
    </div>
  );
}