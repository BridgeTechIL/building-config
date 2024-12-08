import { useState } from 'react';
import { Plus, Minus, ZoomIn, ZoomOut } from 'lucide-react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import BuildingView from '@/components/building/BuildingView';

interface SidebarProps {
  floorCount: number;
  setFloorCount: (value: number) => void;
}

export default function Sidebar({ floorCount, setFloorCount }: SidebarProps) {
  const [activeFloor, setActiveFloor] = useState<number | undefined>(undefined); 
  const [zoom, setZoom] = useState(100);
  const [verticalOffset, setVerticalOffset] = useState(0);

  return (
    <div className="w-1/2 bg-white p-8 relative flex flex-col h-full">
      <div className="flex-1 relative overflow-hidden">
        <BuildingView 
          floorCount={floorCount} 
          zoom={zoom} 
          activeFloor={activeFloor}
          verticalOffset={verticalOffset}
          onFloorClick={setActiveFloor}
        />
      </div>

      <div className="absolute left-4 bottom-60 bg-white rounded-full shadow-lg p-2 flex flex-col gap-2">
        <button onClick={() => setVerticalOffset(v => v + 50)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronUp size={20} />
        </button>
        <button onClick={() => setVerticalOffset(v => v - 50)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="absolute left-4 bottom-32 bg-white rounded-full shadow-lg p-2 flex flex-col gap-2">
        <button onClick={() => setZoom(z => Math.min(z + 10, 200))} className="p-2 hover:bg-gray-100 rounded-full">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => setZoom(z => Math.max(z - 10, 50))} className="p-2 hover:bg-gray-100 rounded-full">
          <ZoomOut size={20} />
        </button>
      </div>

      <div className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-full shadow-lg">
        <span className="font-medium">Building View</span>
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={() => setFloorCount(c => Math.max(0, c - 1))}
            className={`bg-red-500 text-white px-4 me-2 py-2 rounded-full flex items-center gap-2 ${floorCount === 0 ? 'invisible' : ''}`}
          >
            <Minus size={20} />
            Remove Floor
          </button>
          <button 
            onClick={() => setFloorCount(c => c + 1)}
            className="bg-cyan-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Plus size={20} />
            Add Floor
          </button>
        </div>
      </div>
    </div>
  );
}