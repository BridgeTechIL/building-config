import React, { useEffect } from 'react';
import BaseFloor from './BaseFloor';
import Floor from './Floor';
import ActiveFloor from './ActiveFloor';
import Crane from './Crane';
import MastClimber from './MastClimber';
import Hoist from './Hoist';

interface BuildingItems {
  crane: number;
  mastClimber: number;
  hoistSystem: {
    normalHoist: number;
    smartHoist: number;
  };
}

interface BuildingViewProps {
  floorCount: number;
  zoom: number;
  activeFloor?: number;
  verticalOffset: number;
  onFloorClick?: (index: number) => void;
  buildingItems?: BuildingItems;
}

export default function BuildingView({ 
  floorCount, 
  zoom, 
  activeFloor, 
  verticalOffset, 
  onFloorClick,
  buildingItems = { crane: 0, mastClimber: 0, hoistSystem: { normalHoist: 0, smartHoist: 0 } }
}: BuildingViewProps) {
  
  console.log('BuildingView Render');
  console.log('Props:', {
    floorCount,
    zoom,
    activeFloor,
    verticalOffset,
    buildingItems
  });

  useEffect(() => {
    console.log('buildingItems changed:', buildingItems);
  }, [buildingItems]);

  const adjustedZoom = zoom - Math.max(0, 
    floorCount <= 10 
      ? (floorCount - 5) * 8 
      : (40 + (floorCount - 10) * 2)
  );

  const shouldShowHoist = (buildingItems?.hoistSystem.normalHoist ?? 0) > 0 || (buildingItems?.hoistSystem.smartHoist ?? 0) > 0;
  const shouldShowCrane = (buildingItems?.crane ?? 0) > 0;
  const shouldShowMastClimber = (buildingItems?.mastClimber ?? 0) > 0;
  console.log('Should show crane:', shouldShowCrane);

  const totalHeight = floorCount <= 2 ? 110 : ((floorCount - 1) * 90);
  
  return (
    <div className="absolute bottom-0 left-20">
      <div style={{ 
        transform: `scale(${adjustedZoom / 100}) translateY(${verticalOffset}px)`,
        position: 'relative'
      }}>
        {shouldShowHoist && (
          <div
            style={{
              position: 'absolute',
              left: '100px',
              bottom: '370px',
              width: '200px',
              height: '300px',
              zIndex: 1000,
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative'
            }}>
              <Hoist />
            </div>
          </div>
        )}

        {shouldShowCrane && (
          <div 
            style={{ 
              position: 'absolute',
              left: '0px',
              bottom: `${totalHeight}px`,
              width: '400px',
              height: '600px',
              zIndex: -1000,
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative'
            }}>
              <Crane />
            </div>
          </div>
        )}

        {shouldShowMastClimber && (
          <div 
            style={{ 
              position: 'absolute',
              left: '350px',
              bottom: '-5px',
              width: '400px',
              height: '600px',
              zIndex: 1000,
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative'
            }}>
              <MastClimber />
            </div>
          </div>
        )}

        {floorCount > 0 && Array.from({ length: floorCount }).map((_, index) => (
          <div 
            key={index}
            className="absolute left-0 cursor-pointer"
            onClick={() => onFloorClick?.(index + 1)}
            style={{ 
              bottom: `${110 + ((index) * 90)}px`,
              opacity: 1,
              zIndex: -(index + 1)
            }}
          >
            {(index + 1) === activeFloor ? <ActiveFloor /> : <Floor />}
          </div>
        ))}

        <div style={{ position: 'relative', zIndex: floorCount + 1 }}>
          <BaseFloor />
        </div>
      </div>
    </div>
  );
}