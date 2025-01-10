import { Cross, Cog } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface BuildingItem {
  id: string;
  label: string;
  icon: LucideIcon;  // Changed this line to use LucideIcon type
  value: number;
}

interface HoistSystemItem {
  id: string;
  label: string;
  value: number;
}

interface BuildingItemsProps {
  items: {
    crane: number;
    mastClimber: number;
    hoistSystem: {
      normalHoist: number;
      smartHoist: number;
    };
  };
  onUpdateItem: (itemKey: string, value: number) => void;
  onUpdateHoistItem: (itemKey: string, value: number) => void;
}

export default function BuildingItems({ items, onUpdateItem, onUpdateHoistItem }: BuildingItemsProps) {
  const buildingItems: BuildingItem[] = [
    { id: 'crane', label: 'Crane', icon: Cross, value: items.crane },
    { id: 'mastClimber', label: 'Mast Climber', icon: Cross, value: items.mastClimber },
  ];

  const hoistItems: HoistSystemItem[] = [
    { id: 'normalHoist', label: 'Normal Hoist', value: items.hoistSystem.normalHoist },
    { id: 'smartHoist', label: 'Smart Hoist', value: items.hoistSystem.smartHoist },
  ];

  return (
    <div className="space-y-6">
      {/* Regular items */}
      {buildingItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <item.icon size={24} className="text-gray-600" />
              <span className="text-black">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onUpdateItem(item.id, Math.max(0, item.value - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center">{item.value}</span>
              <button 
                onClick={() => onUpdateItem(item.id, item.value + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Hoist System */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-black">
        <div className="flex items-center gap-3 mb-4">
          <Cog size={24} className="text-gray-600" />
          <span>Hoist System</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Selected
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {items.hoistSystem.normalHoist + items.hoistSystem.smartHoist}
          </span>
        </div>
        
        <div className="space-y-4 pl-9">
          {hoistItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>{item.label}</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onUpdateHoistItem(item.id, Math.max(0, item.value - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.value}</span>
                <button 
                  onClick={() => onUpdateHoistItem(item.id, item.value + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}