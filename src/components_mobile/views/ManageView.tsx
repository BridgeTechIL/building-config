import React, { useState, useEffect } from 'react';
import { ChevronLeft, MoreVertical, Search, Edit, AlertTriangle, GridIcon, HardHat } from 'lucide-react';
import { getMockProjectData, updateItemInDatabase } from '@/utils/dataUtils';
import MobileWorkersView from './ManageWorkers';
import ZonesView from './ManageZones';
import MobileEquipmentView from './ManageEquipment';
import MobileSensorView from './ManageSensors';


// Define view types
type ManageViewType = 'overview' | 'zones' | 'workers' | 'equipment' | 'sensors' | 'restrictions';

interface ManageViewProps {
    onClose: () => void;
    onSelectItems?: (selections: {
        workers: any[],
        equipment: any[],
        sensors: any[]
    }) => void;
    projectId?: string | null;
    onViewChange?: (view: string) => void;
}

const ManageView: React.FC<ManageViewProps> = ({ onClose, onSelectItems, projectId = null, onViewChange }) => {
    const [currentView, setCurrentView] = useState<ManageViewType>('overview');
    const [expandedFloors, setExpandedFloors] = useState<Record<string, boolean>>({});
    const [projectData, setProjectData] = useState<any>(null);

    // Fetch project data on component mount
    useEffect(() => {
        onViewChange?.(currentView);
        const data = getMockProjectData();
        setProjectData(data);

        // Initialize expanded state for floors
        const initialExpandedState: Record<string, boolean> = {};
        Object.keys(data.floor_names).forEach((floor, index) => {
            // Expand the second floor by default (for demo purposes)
            initialExpandedState[floor] = index === 1;
        });
        setExpandedFloors(initialExpandedState);
    }, [currentView, onViewChange]);

    if (!projectData) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    // Calculate counts for the overview
    const floorCount = Object.keys(projectData.floor_names).length;
    const zoneCount = projectData.zones?.length || 0;
    const workerCount = projectData.peeps?.length || 0;
    const workerGroupCount = projectData.worker_groups?.filter((g: any) => g.type === 1).length || 0;

    // Count equipment by type
    const equipmentByType: Record<string, number> = {};
    projectData.stuff?.forEach((item: any) => {
        if (item.name) {
            const type = item.name.includes('Drill') ? 'Drills' :
                item.name.includes('Harness') ? 'Harness' :
                    item.name.includes('Fire') ? 'Fire Extinguishers' :
                        'Other';
            equipmentByType[type] = (equipmentByType[type] || 0) + 1;
        }
    });

    // Count sensors by type
    const sensorsByType: Record<string, number> = {};
    projectData.sensors?.forEach((sensor: any) => {
        const type = sensor.type || 'Unknown';
        sensorsByType[type] = (sensorsByType[type] || 0) + 1;
    });

    // Render the overview screen
    // Updating the renderOverview function with your custom icons
    const renderOverview = () => (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl text-gray-900">Manage Site Settings</h1>

            {/* Zones Section - keeping the original purple icon */}
            <div
                className="bg-white rounded-xl shadow-sm p-5 cursor-pointer active:bg-gray-50"
                onClick={() => 
                    {
                        setCurrentView('zones')
                        onViewChange?.('zones')
                }}
                
            >
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                        <GridIcon size={24} className="text-purple-500" />
                    </div>
                    <h2 className="text-xl">Zones</h2>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 bg-gray-50 px-4 py-2 rounded-full flex justify-between">
                        <span className="text-gray-700">Floor</span>
                        <span className="font-medium">{floorCount}</span>
                    </div>
                    <div className="flex-1 bg-gray-50 px-4 py-2 rounded-full flex justify-between">
                        <span className="text-gray-700">Zones</span>
                        <span className="font-medium">{zoneCount}</span>
                    </div>
                </div>
            </div>

            {/* Workers Section - with your worker SVG */}
            <div
                className="bg-white rounded-xl shadow-sm p-5 cursor-pointer active:bg-gray-50"
                onClick={() => {
                    setCurrentView('workers')
                    onViewChange?.('workers')
                }}
            >
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                        <div className="h-7 w-7 flex items-center justify-center text-orange-500">
                            <svg viewBox="0 0 40 40" className="h-10 w-10">
                                <g transform="translate(0, -5)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.974 34.761H33.763C34.816 34.761 35.154 33.341 34.212 32.868L31.565 31.535C31.167 27.61 28.405 19.761 20.536 19.761C10.7 19.761 8.613 28.825 8.613 30.761C7.708 30.761 6.974 31.495 6.974 32.4V32.761C6.974 33.865 7.869 34.761 8.974 34.761ZM18.608 25.436C18.596 25.441 18.589 25.445 18.586 25.446C17.964 25.74 17.222 25.476 16.925 24.856C16.627 24.233 16.89 23.487 17.512 23.188L18.052 24.316C17.512 23.188 17.513 23.188 17.514 23.188L17.515 23.187L17.518 23.186L17.526 23.182L17.548 23.172C17.566 23.164 17.588 23.154 17.616 23.142C17.671 23.118 17.745 23.087 17.839 23.051C18.025 22.98 18.285 22.89 18.607 22.805C19.246 22.634 20.147 22.475 21.186 22.527C23.333 22.637 25.916 23.651 27.909 26.894C28.271 27.482 28.087 28.252 27.499 28.613C26.911 28.975 26.141 28.791 25.779 28.203C24.239 25.696 22.425 25.094 21.059 25.024C20.343 24.988 19.708 25.098 19.251 25.22C19.024 25.281 18.847 25.342 18.731 25.386C18.674 25.408 18.632 25.426 18.608 25.436Z" fill="currentColor" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-xl">Workers</h2>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 bg-gray-50 px-4 py-2 rounded-full flex justify-between">
                        <span className="text-gray-700">Individual</span>
                        <span className="font-medium">{workerCount}</span>
                    </div>
                    <div className="flex-1 bg-gray-50 px-4 py-2 rounded-full flex justify-between">
                        <span className="text-gray-700">Group</span>
                        <span className="font-medium">{workerGroupCount.toString().padStart(2, '0')}</span>
                    </div>
                </div>
            </div>

            {/* Equipment Section - with your equipment SVG */}
            <div
                className="bg-white rounded-xl shadow-sm p-5 cursor-pointer active:bg-gray-50"
                onClick={() => {
                    setCurrentView('equipment')
                    onViewChange?.('equipment')
                }}
            >
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                        <div className="h-7 w-7 flex items-center justify-center text-green-500">
                            <svg viewBox="0 0 30 30" className="h-5 w-5">
                                <g transform="translate(0, -1)">
                                    <g transform="matrix(0.09262, 0, 0, 0.091869, -0.376461, 0.038726)">
                                        <path d="M352.203,286.132l-78.933-78.933c-3.578-3.578-8.35-5.548-13.436-5.548c-2.151,0-4.238,0.373-6.21,1.05l-18.929-18.929 c-2.825-2.826-6.593-4.382-10.607-4.382c-4.014,0-7.781,1.556-10.606,4.381l-4.978,4.978l-8.904-8.904l38.965-39.17 c9.105,3.949,19.001,5.837,29.224,5.837c0.002,0,0.004,0,0.007,0c19.618,0,38.064-7.437,51.939-21.312 c18.59-18.588,25.842-45.811,18.926-71.207c-0.859-3.159-3.825-5.401-7.053-5.401c-1.389,0-3.453,0.435-5.39,2.372 c-0.265,0.262-26.512,26.322-35.186,34.996c-0.955,0.955-2.531,1.104-3.45,1.104c-0.659,0-1.022-0.069-1.022-0.069v0.002 l-0.593-0.068c-10.782-0.99-23.716-2.984-26.98-4.489c-1.556-3.289-3.427-16.533-4.427-27.489v-0.147l-0.234-0.308 c-0.058-0.485-0.31-2.958,1.863-5.131c9.028-9.029,33.847-34.072,34.083-34.311c2.1-2.099,2.9-4.739,2.232-7.245 c-0.801-3.004-3.355-4.686-5.469-5.257C280.772,0.859,274.292,0,267.788,0c-19.62,0-38.068,7.64-51.941,21.512 c-21.901,21.901-27.036,54.296-15.446,81.141l-38.996,38.995L94.682,74.927c-0.041-0.041-0.086-0.075-0.128-0.115 c0.63-2.567,0.907-5.233,0.791-7.947c-0.329-7.73-3.723-15.2-9.558-21.034L62.041,22.083c-0.519-0.519-3.318-3.109-7.465-3.109 c-1.926,0-4.803,0.583-7.58,3.359L20.971,48.359c-3.021,3.021-4.098,6.903-2.954,10.652c0.767,2.512,2.258,4.139,2.697,4.578 l23.658,23.658c6.179,6.179,14.084,9.582,22.259,9.582c0,0,0,0,0.001,0c2.287,0,4.539-0.281,6.721-0.818 c0.041,0.042,0.075,0.087,0.116,0.128l66.722,66.722l-31.692,31.692c-1.428,1.428-2.669,2.991-3.726,4.654 c-9.281-4.133-19.404-6.327-29.869-6.327c-19.623,0-38.071,7.642-51.946,21.517c-18.589,18.589-25.841,45.914-18.926,71.31 c0.859,3.158,3.825,5.451,7.052,5.451c0,0,0,0,0.001,0c1.389,0,3.453-0.41,5.39-2.347c0.265-0.262,26.513-26.309,35.187-34.983 c0.955-0.955,2.639-1.097,3.557-1.097c0.66,0,1.125,0.072,1.132,0.072h-0.001l0.487,0.069c10.779,0.988,23.813,2.982,27.078,4.489 c1.556,3.29,3.575,16.534,4.554,27.49l0.07,0.501c0.006,0.026,0.362,2.771-1.952,5.086c-9.029,9.029-33.888,34.072-34.124,34.311 c-2.1,2.099-2.92,4.74-2.252,7.245c0.802,3.004,3.346,4.685,5.459,5.256c6.264,1.694,12.738,2.553,19.243,2.553 c19.621,0,38.066-7.64,51.938-21.512c13.876-13.875,21.518-32.324,21.517-51.947c0-10.465-2.193-20.586-6.326-29.868 c1.664-1.057,3.227-2.298,4.654-3.726l31.693-31.693l8.904,8.904l-4.979,4.979c-2.826,2.825-4.382,6.592-4.382,10.606 c0,4.015,1.556,7.782,4.382,10.607l18.929,18.929c-0.677,1.972-1.05,4.059-1.05,6.209c0,5.086,1.971,9.857,5.549,13.435 l78.934,78.934c3.577,3.577,8.349,5.548,13.435,5.548c5.086,0,9.857-1.971,13.435-5.548l40.659-40.66 c3.578-3.578,5.549-8.349,5.549-13.435C357.752,294.482,355.782,289.71,352.203,286.132z" fill="currentColor" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-xl">Equipment</h2>
                </div>
                <div className="flex gap-4">
                    {Object.entries(equipmentByType).slice(0, 2).map(([type, count]) => (
                        <div key={type} className="flex-1 bg-gray-50 px-4 py-2 rounded-full flex justify-between">
                            <span className="text-gray-700">{type}</span>
                            <span className="font-medium">{count.toString().padStart(2, '0')}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sensors Section - with your sensor SVG */}
            <div
                className="bg-white rounded-xl shadow-sm p-5 cursor-pointer active:bg-gray-50"
                onClick={() => {
                    setCurrentView('sensors')
                    onViewChange?.('sensors')
                }}
            >
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <div className="h-7 w-7 flex items-center justify-center text-blue-500">
                            <svg viewBox="0 0 40 40" className="h-8 w-8">
                                <g transform="translate(4, 4)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M16.791 4.069C23.418 4.069 28.791 9.441 28.791 16.069C28.791 22.696 23.418 28.069 16.791 28.069C10.164 28.069 4.791 22.696 4.791 16.069C4.791 9.441 10.164 4.069 16.791 4.069ZM22.31 19.743C22.907 18.677 23.255 17.421 23.255 16.069C23.255 14.717 22.907 13.46 22.31 12.395C21.972 11.792 22.186 11.031 22.788 10.693C23.39 10.355 24.152 10.569 24.49 11.171C25.296 12.608 25.755 14.285 25.755 16.069C25.755 17.853 25.296 19.53 24.49 20.966C24.152 21.568 23.39 21.782 22.788 21.445C22.186 21.107 21.972 20.345 22.31 19.743ZM11.273 19.743C11.61 20.345 11.396 21.107 10.794 21.445C10.192 21.782 9.43 21.568 9.092 20.966C8.286 19.53 7.827 17.853 7.827 16.069C7.827 14.285 8.286 12.608 9.092 11.171C9.43 10.569 10.192 10.355 10.794 10.693C11.396 11.031 11.61 11.792 11.273 12.395C10.675 13.46 10.327 14.717 10.327 16.069C10.327 17.421 10.675 18.677 11.273 19.743Z" fill="currentColor" />
                                    <circle cx="16.791" cy="16.069" r="3" fill="white" fillOpacity="0.6" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-xl">Sensors</h2>
                </div>
                <div className="flex gap-4">
                    {Object.entries(sensorsByType).slice(0, 1).map(([type, count]) => (
                        <div key={type} className="flex-1 bg-gray-50 px-4 py-2 rounded-full flex justify-between">
                            <span className="text-gray-700">{type}</span>
                            <span className="font-medium">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Render content based on current view
    const renderContent = () => {
        switch (currentView) {
            case 'zones':
                return (
                    <ZonesView
                        onBack={() => setCurrentView('overview')}
                        projectData={projectData}
                        projectId={projectId}
                        floorNames={projectData.floor_names}
                    />
                );
            case 'workers':
                return (
                    <MobileWorkersView
                        onBack={() => setCurrentView('overview')}
                        projectId={projectId}
                        updateDB={updateItemInDatabase}
                    />
                );
            case 'equipment':
                return (
                    <MobileEquipmentView
                        onBack={() => setCurrentView('overview')}
                        projectId={projectId}
                        updateDB={updateItemInDatabase}
                    />
                );
            case 'sensors':
                return (
                    <MobileSensorView
                        onBack={() => setCurrentView('overview')}
                        projectId={projectId}
                        updateDB={updateItemInDatabase}
                    />
                );
            case 'overview':
            default:
                onViewChange?.('overview');
                return renderOverview();
        }
    };


    return (
        <div className="h-full bg-gray-100 flex flex-col">
            {renderContent()}
        </div>
    );
};

export default ManageView;