import React from 'react';
import ZonesView from '../views/ZonesView';
import {Floor, Zone} from '../../types/building';
import WorkersView from '../views/WorkersView';
import EquipmentView from '../views/EquipmentView';
import SensorsView from '../views/SensorsView';


interface ProjectManagementProps {
    onExport: () => Promise<void>,
    floors: Floor[],
    cams: Record<string, string[]>,
    onUpdateFloorOrder: (newOrder: Floor[]) => void,
    onAddZone: (floorId: string) => void,
    onRemoveZone: (floorId: string, zoneId: string) => void,
    onUpdateZone: (floor: number, zoneId: string, updates: Partial<Zone>) => void,
    updateDB: (projectId: string, action: string, itemName: string, itemId: number, column: string, value: any) => Promise<object>,
    projectId?: string | null,
    floorNames: Record<number, string>,
}

const ProjectManagement = ({
                               floors,
                               cams,
                               onUpdateFloorOrder,
                               onAddZone,
                               onRemoveZone,
                               onUpdateZone,
                               updateDB,
                               projectId,
                               floorNames,
                           }: ProjectManagementProps) => {
    const [activeArea, setActiveArea] = React.useState('area1');

    const areas = [
        {id: 'area1', label: 'Zones'},
        {id: 'area2', label: 'Workers'},
        {id: 'area3', label: 'Equipment'},
        {id: 'area4', label: 'Sensors'}
    ];

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
                return <WorkersView
                    updateDB={updateDB}
                />;
            case 'area3':
                return <EquipmentView
                    updateDB={updateDB}
                />;
            case 'area4':
                return <SensorsView
                    updateDB={updateDB}
                    projectId={projectId}
                    floorNames={floorNames}
                />;
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
                                    ? 'bg-white shadow-sm text-cyan-500'
                                    : 'text-gray-500'
                            }`}
                        >
                            {area.label}{area.label === 'Workers' ? <span id='peepCount'></span> : null}
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