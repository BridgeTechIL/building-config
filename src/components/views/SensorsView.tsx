import React, {useEffect, useState} from 'react';
import {MapPin, ChevronDown, ChevronUp} from 'lucide-react';
import {Sensor, SensorType} from '@/config/sensors';


type ViewMode = 'sensors' | 'types';

interface SensorsViewProps {
    updateDB: (projectId: string, action: string, itemName: string, itemId: number, column: string, value: any) => void,
    projectId?: string | null,
    floorNames: Record<number, string>,
}

const SensorsView = ({
                         updateDB,
                         projectId,
                         floorNames,
                     }: SensorsViewProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>('sensors');
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [sensorTypes, setSensorTypes] = useState<SensorType[]>([]);

    useEffect(() => {
        fetch(`https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d?project_id=${projectId}`)
            .then(response => response.json())
            .then(data => {
              const fetchedSensors = data.sensors.map((sensor: any) => ({
                    tagId: sensor.id.toString(),
                    name: sensor.display_name,
                    type: sensor.type,
                    location: {
                      floor_physical: sensor.floor_physical,
                      xy: [sensor.location_x || Math.floor(Math.random() * 66) + 10, sensor.location_y || Math.floor(Math.random() * 66) + 10],
                      is_exact: true
                    }
                }));
              setSensors(fetchedSensors);

              const fetchedTypes = Array.from(new Set(fetchedSensors.map((sensor: any) => sensor.type as string)) as Set<string>
                ).map(type => ({
                    name: type,
                }));

              setSensorTypes(fetchedTypes);




            })
            .catch(error => console.error('Error fetching sensors:', error));
    }, []);


    const handleSensorUpdate = (tagId: string, updates: Partial<Sensor>) => {
        if (projectId) {
            const key = Object.keys(updates)[0];
            const value = Object.values(updates)[0];
            updateDB(projectId, 'rename', 'sensors', parseInt(tagId, 10), key, value);
        }
        setSensors(prev => prev.map(sensor =>
            sensor.tagId === tagId ? {...sensor, ...updates} : sensor
        ));
    };

    const handleFloorChange = (tagId: string, location: any, floor: number) => {
        if (projectId) {
            updateDB(projectId, 'rename', 'sensors', parseInt(tagId, 10), 'floor_physical', floor);
        }
        setSensors(prev => prev.map(sensor =>
            sensor.tagId === tagId ? {...sensor, location: {...location, floor_physical: floor}} : sensor
        ));
    }


    const [expandedTypeId, setExpandedTypeId] = useState<string | null>(null);

    const handleLocateSensor = (tagId: string) => {
        const sensor = sensors.find(sensor => sensor.tagId === tagId);
        if (!sensor || sensor.location.floor_physical === null) return;
        showSensorsIframe(sensor.name, [sensor]);
    };

    const showSensorsIframe = (title: string, sensors: Array<object>) => {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'SHOW_ITEMS',
                data: {
                    type: 'sensors',
                    title: title,
                    items: sensors
                },
            }, '*');
        }
    };

    const handleLocateType = (typeName: string) => {
        const typeSensors = sensors
            .filter(sensor => sensor.type === typeName)
            .map(sensor => ({
                tag_id: sensor.tagId,
                name: sensor.name,
                location: sensor.location,
            }));

        showSensorsIframe(typeName, typeSensors);
    };

    const renderSensorsView = () => (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 font-medium mb-4">
                <div className="col-span-2">TAG ID</div>
                <div className="col-span-3">NAME</div>
                <div className="col-span-4">TYPE</div>
                <div className="col-span-2">FLOOR</div>
            </div>
            {sensors.map((sensor) => (
                <div key={sensor.tagId} className="bg-white rounded-lg p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col text-gray-500">
                            {sensor.tagId}
                        </div>
                        <div className="col-span-4">
                            <input
                                type="text"
                                value={sensor.name}
                                onChange={(e) => handleSensorUpdate(sensor.tagId, {name: e.target.value})}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800"
                                placeholder="Enter sensor name"
                            />
                        </div>
                        <div className="col-span-4 text-gray-500">
                            {sensorTypes.find(type => type.name === sensor.type)?.name}
                        </div>
                        <div className="col-span-2">
                            <select
                                value={sensor.location.floor_physical !== null ? sensor.location.floor_physical : '-'}
                                onChange={(e) => handleFloorChange(sensor.tagId, sensor.location, parseInt(e.target.value, 10))}
                                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800"
                            >
                                {Object.entries(floorNames).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                                <option value="-">Not Set</option>
                            </select>
                        </div>
                        <div className="col-span-1 text-right">
                            <button
                                onClick={() => handleLocateSensor(sensor.tagId)}
                                className="text-gray-400 hover:text-cyan-500"
                            >
                                <MapPin size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderTypesView = () => (
        <div className="space-y-4">
            {sensorTypes.map(type => {
                const typeSensorCount = sensors.filter(sensor => sensor.type === type.name).length;

                return (
                    <div key={type.name} className="bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500">
                        <div className="flex items-center px-4 h-16">
                            <div className="flex-1 ml-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-lg">{type.name}</span>
                                    <span className="text-sm text-gray-500">
                    ({typeSensorCount} sensors)
                  </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button

                                    onClick={() => handleLocateType(type.name)}
                                    className="text-gray-400 hover:text-cyan-500 flex items-center"
                                >
                                    <MapPin size={18}/> Show Locations
                                </button>
                                <button
                                    onClick={() => setExpandedTypeId(
                                        expandedTypeId === type.name ? null : type.name
                                    )}
                                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-3 py-2"
                                >
                                    {expandedTypeId === type.name ? (
                                        <ChevronUp size={20}/>
                                    ) : (
                                        <ChevronDown size={20}/>
                                    )}
                                </button>
                            </div>
                        </div>

                        {expandedTypeId === type.name && (
                            <div className="border-t">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {sensors.filter(sensor => sensor.type === type.name).map(sensor => (
                                        <div key={sensor.tagId}
                                             className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-500">{sensor.tagId}</span>
                                                <span>{sensor.name || 'Unnamed Sensor'}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {sensors.filter(sensor => sensor.type === type.name).length === 0 && (
                                        <div className="text-center text-gray-500 py-4">
                                            No sensors of this type
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-0">
                <div className="inline-flex p-1 bg-gray-50 rounded-full w-full mb-4">
                    <button
                        onClick={() => setViewMode('sensors')}
                        className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                            viewMode === 'sensors'
                                ? 'bg-cyan-500 shadow-sm text-white'
                                : 'text-gray-500'
                        }`}
                    >
                        Sensors
                    </button>
                    <button
                        onClick={() => setViewMode('types')}
                        className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                            viewMode === 'types'
                                ? 'bg-cyan-500 shadow-sm text-white'
                                : 'text-gray-500'
                        }`}
                    >
                        Types
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {viewMode === 'sensors' ? renderSensorsView() : renderTypesView()}
                </div>
            </div>
        </div>
    );
};

export default SensorsView;