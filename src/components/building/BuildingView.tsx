import React from 'react';
import BaseFloor from './BaseFloor';
import Floor from './Floor';
import ActiveFloor from './ActiveFloor';


interface BuildingViewProps {
    floorCount: number;
    zoom: number;
    activeFloor?: number;
    verticalOffset: number;
    onFloorClick?: (index: number) => void;
   }
   
   

   export default function BuildingView({ floorCount, zoom, activeFloor, verticalOffset, onFloorClick }: BuildingViewProps) {
    const adjustedZoom = zoom - Math.max(0, 
      floorCount <= 10 
        ? (floorCount - 5) * 8 
        : (40 + (floorCount - 10) * 2)
    );
    
    return (
      <div className="absolute bottom-0 left-20">
        <div style={{ transform: `scale(${adjustedZoom / 100}) translateY(${verticalOffset}px)` }}>
          {Array.from({ length: floorCount }).map((_, index) => (
            <div 
              key={index}
              className="absolute left-0 cursor-pointer"
              onClick={() => onFloorClick?.(index)}
              style={{ 
                bottom: `${index === 0 ? 110 : (110 + (index) * 90)}px`,
                opacity: 1,
                zIndex: -index 
              }}
            >
              {index === activeFloor ? <ActiveFloor /> : <Floor />}
            </div>
            
          ))}
          <div style={{ position: 'relative', zIndex: floorCount + 1 }}>
            <BaseFloor />
        
          </div>
        </div>
      </div>
    );
   }