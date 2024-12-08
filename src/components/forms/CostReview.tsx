import React from 'react';
import { Building, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectBasicInfo } from '@/types/building';
import { itemCosts, calculateItemCost, getItemName } from '@/config/costs';

interface CostReviewProps {
  projectData: ProjectBasicInfo;
  floors: {
    id: string;
    level: number;
    selected: boolean;
    isBase?: boolean;
    items: Record<string, number>;
  }[];
  buildingItems: {
    crane: number;
    mastClimber: number;
    hoistSystem: {
      normalHoist: number;
      smartHoist: number;
    };
  };
}

export default function CostReview({ projectData, floors, buildingItems }: CostReviewProps) {
  const [expandedLevel, setExpandedLevel] = React.useState<string | null>('1');
  
  const hasItems = (floor: typeof floors[0]) => {
    return Object.values(floor.items).some(quantity => quantity > 0);
  };

  const hasBuildingItems = 
    buildingItems.crane > 0 || 
    buildingItems.mastClimber > 0 || 
    buildingItems.hoistSystem.normalHoist > 0 || 
    buildingItems.hoistSystem.smartHoist > 0;

  const floorsWithItems = floors.filter(hasItems);

  const generateOrderNumber = (projectName: string) => {
    if (!projectName) return '#10000';
    
    const firstLetter = projectName.charAt(0).toUpperCase();
    const randomNum = Math.floor(Math.random() * (9999 - 3500 + 1) + 3500);
    const lastChar = projectName.slice(-1).toUpperCase();
    
    return `#SMSI${firstLetter}${randomNum}${lastChar}`;
  };

  const orderNumber = React.useMemo(() => 
    generateOrderNumber(projectData.name), 
    [projectData.name]
  );

  const calculateFloorItemsCost = () => {
    return floorsWithItems.reduce((total, floor) => {
      return total + Object.entries(floor.items).reduce((floorTotal, [itemKey, quantity]) => 
        floorTotal + calculateItemCost(itemKey, quantity), 0);
    }, 0);
  };
  
  const calculateBuildingItemsCost = () => {
    return (
      calculateItemCost('crane', buildingItems.crane) +
      calculateItemCost('mastClimber', buildingItems.mastClimber) +
      calculateItemCost('normalHoist', buildingItems.hoistSystem.normalHoist) +
      calculateItemCost('smartHoist', buildingItems.hoistSystem.smartHoist)
    );
  };

  const getTotalItemCount = () => {
    const floorItems = floorsWithItems.reduce((count, floor) => 
      count + Object.values(floor.items).reduce((sum, qty) => sum + qty, 0), 0);
    
    const buildingItemsCount = 
      buildingItems.crane +
      buildingItems.mastClimber +
      buildingItems.hoistSystem.normalHoist +
      buildingItems.hoistSystem.smartHoist;
    
    return floorItems + buildingItemsCount;
  };

  const formatPrice = (price: number) => {
    return `$${Math.round(price).toLocaleString()}`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 pb-32">
        {/* Order Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building className="text-gray-400" size={20} />
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <span className="text-sm text-gray-500 ml-2">{orderNumber}</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div>{projectData.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Installation Date</div>
              <div>{new Date(projectData.installationDate).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}</div>
            </div>
          </div>

          {projectData.comments && (
            <div>
              <div className="text-sm text-gray-500">Comments</div>
              <div className="text-gray-700">{projectData.comments}</div>
            </div>
          )}
        </div>

        {/* Floor Planning */}
        {floorsWithItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Floor Planning</h3>
              <span className="text-sm text-gray-500">{getTotalItemCount()} Items</span>
            </div>

            <div className="bg-gray-50 rounded-lg">
              <div className="px-4 py-2 text-sm text-gray-500 grid grid-cols-3">
                <span>ITEM</span>
                <span>QTY.</span>
                <span>PRICE</span>
              </div>
              
              {floorsWithItems.map((floor) => (
                <div key={floor.id} className="border-t border-gray-200">
                  <button
                    onClick={() => setExpandedLevel(expandedLevel === floor.id ? null : floor.id)}
                    className="w-full px-4 py-3 flex items-center text-left"
                  >
                    <span className="mr-2">
                      {expandedLevel === floor.id ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                      }
                    </span>
                    <span>{floor.isBase ? 'Base Level' : `Level ${floor.level}`}</span>
                  </button>
                  
                  {expandedLevel === floor.id && (
                    <div className="px-4 pb-3 space-y-2">
                      {Object.entries(floor.items).map(([itemKey, quantity]) => {
                        if (quantity > 0) {
                          return (
                            <div key={itemKey} className="grid grid-cols-3 text-sm">
                              <span>{getItemName(itemKey)}</span>
                              <span>{String(quantity).padStart(2, '0')}</span>
                              <span>{formatPrice(calculateItemCost(itemKey, quantity))}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Building Items */}
        {hasBuildingItems && (
          <div className="space-y-4">
            <h3 className="font-medium">Building Items</h3>
            <div className="bg-gray-50 rounded-lg">
              <div className="px-4 py-2 text-sm text-gray-500 grid grid-cols-3">
                <span>ITEM</span>
                <span>QTY.</span>
                <span>PRICE</span>
              </div>
              
              {buildingItems.crane > 0 && (
                <div className="px-4 py-2 grid grid-cols-3 text-sm border-t border-gray-200">
                  <span>{getItemName('crane')}</span>
                  <span>{String(buildingItems.crane).padStart(2, '0')}</span>
                  <span>{formatPrice(calculateItemCost('crane', buildingItems.crane))}</span>
                </div>
              )}
              {buildingItems.mastClimber > 0 && (
                <div className="px-4 py-2 grid grid-cols-3 text-sm border-t border-gray-200">
                  <span>{getItemName('mastClimber')}</span>
                  <span>{String(buildingItems.mastClimber).padStart(2, '0')}</span>
                  <span>{formatPrice(calculateItemCost('mastClimber', buildingItems.mastClimber))}</span>
                </div>
              )}
              {buildingItems.hoistSystem.normalHoist > 0 && (
                <div className="px-4 py-2 grid grid-cols-3 text-sm border-t border-gray-200">
                  <span>{getItemName('normalHoist')}</span>
                  <span>{String(buildingItems.hoistSystem.normalHoist).padStart(2, '0')}</span>
                  <span>{formatPrice(calculateItemCost('normalHoist', buildingItems.hoistSystem.normalHoist))}</span>
                </div>
              )}
              {buildingItems.hoistSystem.smartHoist > 0 && (
                <div className="px-4 py-2 grid grid-cols-3 text-sm border-t border-gray-200">
                  <span>{getItemName('smartHoist')}</span>
                  <span>{String(buildingItems.hoistSystem.smartHoist).padStart(2, '0')}</span>
                  <span>{formatPrice(calculateItemCost('smartHoist', buildingItems.hoistSystem.smartHoist))}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-semibold">Total</div>
              <div className="text-sm text-gray-500">(incl. fees and tax)</div>
            </div>
            <div className="text-2xl font-semibold text-cyan-500">
              {formatPrice(calculateFloorItemsCost() + calculateBuildingItemsCost())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}