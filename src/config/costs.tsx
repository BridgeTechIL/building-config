
export interface ItemCost {
    basePrice: number;
    name: string;
    category: 'floor' | 'building';
  }
  
  export const itemCosts: Record<string, ItemCost> = {
    // Floor Items
    gate: {
      basePrice: 500.00,
      name: 'Gate',
      category: 'floor'
    },
    motionSensor: {
      basePrice: 500.00,
      name: 'Motion Sensor',
      category: 'floor'
    },
    fireDetection: {
      basePrice: 500.00,
      name: 'Fire Detection',
      category: 'floor'
    },
    waterDetection: {
      basePrice: 500.00,
      name: 'Water Detection',
      category: 'floor'
    },
    floorDetection: {
      basePrice: 500.00,
      name: 'Floor Detection',
      category: 'floor'
    },
    smartAICamera: {
      basePrice: 500.00,
      name: 'Smart AI Camera',
      category: 'floor'
    },
    existingCamera: {
      basePrice: 500.00,
      name: 'Existing Camera',
      category: 'floor'
    },
    wifi: {
      basePrice: 500.00,
      name: 'WiFi',
      category: 'floor'
    },
    hoistDoor: {
      basePrice: 500.00,
      name: 'Hoist Door',
      category: 'floor'
    },
  
    // Building Items
    crane: {
      basePrice: 500.00,
      name: 'Crane',
      category: 'building'
    },
    mastClimber: {
      basePrice: 500.00,
      name: 'Mast Climber',
      category: 'building'
    },
    normalHoist: {
      basePrice: 500.00,
      name: 'Hoist',
      category: 'building'
    },
    smartHoist: {
      basePrice: 500.00,
      name: 'Smart Hoist',
      category: 'building'
    }
  };
  
  export const calculateItemCost = (itemKey: string, quantity: number): number => {
    const item = itemCosts[itemKey];
    if (!item) return 0;
    return item.basePrice * quantity;
  };
  
  export const getItemName = (itemKey: string): string => {
    return itemCosts[itemKey]?.name || itemKey;
  };