import React from 'react';
import ZonesView from '../views/ZonesView';
import { Floor, Zone } from '../../types/building';
import WorkersView from '../views/WorkersView';
import EquipmentView from '../views/EquipmentView';
import SensorsView from '../views/SensorsView';



interface ProjectManagementProps {
  onExport: () => Promise<void>;
  floors: Floor[];
  cams: Record<string, string[]>;
  onUpdateFloorOrder: (newOrder: Floor[]) => void;
  onAddZone: (floorId: string) => void;
  onRemoveZone: (floorId: string, zoneId: string) => void;
  onUpdateZone: (floorId: string, zoneId: string, updates: Partial<Zone>) => void;
  onUpdateFloor: (floorId: string, updates: Partial<Floor>) => void;
}

const ProjectManagement = ({ 
  floors,
  cams,
  onUpdateFloorOrder,
  onAddZone,
  onRemoveZone,
  onUpdateZone,
  onUpdateFloor 
}: ProjectManagementProps) => {
  const [activeArea, setActiveArea] = React.useState('area1');

  const areas = [
    { id: 'area1', label: 'Zones' },
    { id: 'area2', label: 'Workers' },
    { id: 'area3', label: 'Equipment' },
    { id: 'area4', label: 'Sensors' }
  ];

  const handleAddZone = (floorId: string) => {
    const floor = floors.find(f => f.id === floorId);
    if (!floor) return;

    const newZone: Zone = {
      id: `zone_${Date.now()}`,
      name: `Zone ${floor.zones.length + 1}`,
      isWifi: false,
      isDanger: false,
      gateId: `GT${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      location: {
        floor_physical: floor.level,
        xy: [50, 50], // Default to center of the floor
        is_exact: true
      }
    };

    onUpdateFloor(floorId, {
      zones: [...floor.zones, newZone]
    });
  };

  const handleRemoveZone = (floorId: string, zoneId: string) => {
    const floor = floors.find(f => f.id === floorId);
    if (!floor) return;

    onUpdateFloor(floorId, {
      zones: floor.zones.filter(z => z.id !== zoneId)
    });
  };

  const handleUpdateZone = (floorId: string, zoneId: string, updates: Partial<Zone>) => {
    const floor = floors.find(f => f.id === floorId);
    if (!floor) return;

    onUpdateFloor(floorId, {
      zones: floor.zones.map(zone => 
        zone.id === zoneId ? { ...zone, ...updates } : zone
      )
    });
  };

  const renderAreaContent = () => {
    switch (activeArea) {
      case 'area1':
        return (
          <ZonesView 
            floors={floors}
            cams={cams}
            onUpdateOrder={onUpdateFloorOrder}
            onAddZone={onAddZone}
            onRemoveZone={onRemoveZone}
            onUpdateZone={onUpdateZone}
          />
        );
      case 'area2':
        return <WorkersView />;
      case 'area3':
        return <EquipmentView />;
      case 'area4':
        return <SensorsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13.5rem)]">
      <div className="p-6">
        <div className="inline-flex p-1 bg-gray-50 rounded-full w-full">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                activeArea === area.id 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500'
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {renderAreaContent()}
      </div>
    </div>
  );
};

export default ProjectManagement;