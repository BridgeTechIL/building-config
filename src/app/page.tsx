'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import BasicInfo from '@/components/forms/BasicInfo'
import FloorConfig from '@/components/forms/FloorConfig'
import Steps from '@/components/layout/Steps'
import CostReview from '@/components/forms/CostReview'
import ProjectManagement from '@/components/forms/ProjectManagement'
import { Floor, ProjectBasicInfo, Zone } from '@/types/building'
import { calculateItemCost, getItemName } from '@/config/costs'
import { useSearchParams } from "next/navigation"
import { useMobile } from '@/components_mobile/MobileProvider';
import MobileBuilding from '@/components_mobile/views/BuildingView';
import BottomMenuBar from '@/components_mobile/layout/Menu';
import MobileFilter from '@/components_mobile/layout/Filter';



type SearchParamsRenderProp = (params: { projectId: string | null }) => React.ReactElement

// Update the provider with correct typing
function SearchParamsProvider({ children }: { children: SearchParamsRenderProp }) {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project_id')
  return children({ projectId })
}

const defaultItems = {
  gate: 0,
  motionSensor: 0,
  fireDetection: 0,
  waterDetection: 0,
  floorDetection: 0,
  smartAICamera: 0,
  existingCamera: 0,
  wifi: 0,
  hoistDoor: 0
};

interface BuildingItems {
  crane: number;
  mastClimber: number;
  hoistSystem: {
    normalHoist: number;
    smartHoist: number;
  };
}

function HomeContent({ projectId }: { projectId: string | null }) {
  const [showFilters, setShowFilters] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRealtimeMode, setIsRealtimeMode] = useState(false);
  const [activeItems, setActiveItems] = useState<{ type: string; ids: string[] }>({ type: '', ids: [] });
  const [showAlerts, setShowAlerts] = useState(false);

  const initialState = projectId ? 4 : 1;
  const [step, setStep] = useState(initialState);
  const [floorCount, setFloorCount] = useState(0)
  const [activeFloor, setActiveFloor] = useState<number | undefined>(undefined);
  const [projectData, setProjectData] = useState<ProjectBasicInfo>({
    name: '',
    installationDate: '',
    comments: '',
    status: 'draft',
  });

  const [validationError, setValidationError] = useState(false);
  const basicInfoRef = useRef<{ validateName: () => boolean } | null>(null);

  const [buildingItems, setBuildingItems] = useState<BuildingItems>({
    crane: 0,
    mastClimber: 0,
    hoistSystem: {
      normalHoist: 0,
      smartHoist: 0
    }
  });

  // Modified floors state initialization
  const initialFloors = projectId ? [] : [
    {
      id: '0',
      level: 0,
      selected: false,
      isBase: true,
      items: { ...defaultItems },
      zones: []  // Add this
    }
  ];
  const [floors, setFloors] = useState<Floor[]>(initialFloors);
  const [floorNames, setFloorNames] = useState<Record<number, string>>({});
  const [cameras, setCameras] = useState<[]>([]);
  const [cams, setCams] = useState<Record<string, string[]>>({});
  const [devicesCameras, setDevicesCameras] = useState<Record<string, string>>({});
  const { isMobile, forceDesktopView } = useMobile();

  // Define state variables for worker, equipment, and sensor data
  const [workers, setWorkers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);

  const formatWorkerDataForModal = (rawWorkers) => {
    return rawWorkers.map(worker => ({
      id: worker.tagId || worker.id || `worker-${Math.random().toString(36).substring(7)}`,
      name: worker.name || worker.display_name || 'Unnamed Worker',
      type: 'worker',
      position: worker.position || worker.role || 'Construction Worker',
      location: {
        floor: Number(worker.floor_physical || worker.location?.floor_physical || 0),
        apartment: worker.apartment || worker.location?.apartment || 'TBD'
      },
      image: worker.image || worker.avatar || undefined,
      lastSeen: worker.lastSeen || worker.last_update || new Date().toISOString(),
      visitHistory: worker.history || worker.visitHistory || [],
    }));
  };

  const formatEquipmentDataForModal = (rawEquipment) => {
    return rawEquipment.map(item => ({
      id: item.tagId || item.id || `equip-${Math.random().toString(36).substring(7)}`,
      name: item.name || item.display_name || 'Unnamed Equipment',
      type: 'equipment',
      position: item.type || 'Construction Equipment',
      location: {
        floor: Number(item.floor_physical || item.location?.floor_physical || 0)
      },
      lastSeen: item.lastSeen || item.last_update || new Date().toISOString(),
    }));
  };

  const formatSensorDataForModal = (rawSensors) => {
    return rawSensors.map(sensor => ({
      id: sensor.tagId || sensor.id || `sensor-${Math.random().toString(36).substring(7)}`,
      name: sensor.name || sensor.display_name || 'Unnamed Sensor',
      type: 'sensor',
      position: sensor.sensor_type || 'Environmental Sensor',
      location: {
        floor: Number(sensor.floor_physical || sensor.location?.floor_physical || 0)
      },
      lastSeen: sensor.lastSeen || sensor.last_update || new Date().toISOString(),
    }));
  };

  useEffect(() => {

// if (projectId) {
//   fetch(`https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d?project_id=${projectId}`)
//       .then(response => response.json())
//       .then(data => {

//         const projectName = data.project_name;
//         updateProjectField('name', projectName);
//         const hideElements = document.querySelectorAll('.hideOnProjectView');
//         hideElements.forEach(element => {
//             element.classList.add('hidden');
//         });

//         const fetchedZones = data.zones.map((zone: any) => ({
//           id: zone.id.toString(),
//           gateId: zone.box_id,
//           name: zone.display_name,
//           isDanger: zone.is_danger,
//           isWifi: false,
//           location: {
//             floor_physical: zone.floor_physical,
//             xy: [zone.location_x || Math.floor(Math.random() * 51) + 25, zone.location_y || Math.floor(Math.random() * 51) + 25],
//             size_xy: [zone.size_x? zone.size_x : 49, zone.size_y? zone.size_y : 49],
//             is_exact: true
//           }
//         }));
    //         const wifiZones = data.access_points.map((ap: any) => ({
    //           id: ap.id.toString(),
    //           gateId: ap.id,
    //           name: 'Access Point',
    //           isDanger: false,
    //           isWifi: true,
    //           location: {
    //             floor_physical: ap.floor_physical,
    //             xy: [ap.location_x? ap.location_x : 50, ap.location_y? ap.location_y : 50],
    //             size_xy: [ap.size_x? ap.size_x : 99, ap.size_y? ap.size_y : 99],
    //             is_exact: true
    //           }
    //         }));

    //         const fetchedFloors = Object.entries(data.floor_names).map(([key, value]) => ({
    //           id: String(value),
    //           level: parseInt(key, 10),
    //           selected: false,
    //           isBase: key === "0",
    //           items: {...defaultItems},
    //           zones: [...fetchedZones.filter((zone: any) => zone.location.floor_physical === parseInt(key, 10)), ...wifiZones.filter((zone: any) => zone.location.floor_physical === parseInt(key, 10))]
    //         }));
    //         const sortedFloors = [...fetchedFloors].sort((a, b) => b.level - a.level);
    //         setFloors(sortedFloors);
    //         setFloorNames(data.floor_names);

    //         const cameras = data.cameras.map((cam: any) => ({
    //           name: cam.display_name,
    //           streamUrl: cam.stream_url,
    //           location: {
    //             floor_physical: cam.floor_physical,
    //             xy: [cam.location_x, cam.location_y],
    //             is_exact: true
    //           }
    //         }));
    //         setCameras(cameras);


    //         const fetchedCameras = Object.keys(data.floor_names).reduce((acc: any, floorId: string) => {
    //           acc[floorId] = data.cameras
    //             .filter((cam: any) => cam.floor_physical.toString() === floorId)
    //             .map((cam: any) => cam.stream_url);
    //           return acc;
    //         }, {});

    //         // Update cams object
    //         setCams(fetchedCameras)

    //         initializeIframeData(fetchedFloors, data.floor_names, cameras);

    //         setDevicesCameras(data.devices_cameras);

    //       })
    //       .catch(error => console.error('Error fetching floors:', error));
    // } else {
    //   setFloors(currentFloors => {
    //     const baseFloor = currentFloors[0];

    //     const additionalFloors = Array.from({ length: floorCount }, (_, index) => ({
    //       id: String(index + 1),
    //       level: index + 1,
    //       selected: false,
    //       isBase: false,
    //       items: { ...defaultItems },
    //       zones: []  // Add this
    //     }));

    //     return [baseFloor, ...additionalFloors];
    //   });
    // }

  }, [floorCount]);

  // Zone management functions
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
        xy: [50, 50] as [number, number], // Type assertion to ensure it's a tuple
        is_exact: true
      }
    };

    const updatedFloors = floors.map(f =>
      f.id === floorId
        ? { ...f, zones: [...f.zones, newZone] }
        : f
    );

    setFloors(updatedFloors);
  };

  const handleRemoveZone = (floorId: string, zoneId: string) => {
    const updatedFloors = floors.map(f =>
      f.id === floorId
        ? { ...f, zones: f.zones.filter(z => z.id !== zoneId) }
        : f
    );

    setFloors(updatedFloors);
    updateIframeZones(updatedFloors);
  };

  function updateDB(projectId: string, action: string, itemName: string, itemId: number, column: string, value: any): Promise<any> {
    return fetch('https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        action,
        itemName,
        itemId,
        column,
        value,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .catch(error => {
        console.error('Error updating item:', error)
      })
  }
  const handleUpdateZone = (floor: number, zoneId: string, updates: Partial<Zone>) => {
    if (projectId) {
      const key = Object.keys(updates)[0];
      const value = Object.values(updates)[0];
      updateDB(projectId, 'rename', 'zones', parseInt(zoneId, 10), key, value);
    }
    const updatedFloors = floors.map(f =>
      f.level === floor
        ? {
          ...f,
          zones: f.zones.map(z =>
            z.id === zoneId ? { ...z, ...updates } : z
          )
        }
        : f
    );

    setFloors(updatedFloors);

    // Convert and update iframe zones
    const iframe = document.querySelector('iframe');
    if (iframe?.contentWindow) {
      const contentWindow = iframe.contentWindow as Window & typeof globalThis & { showZones?: (zones: Array<object>) => void };
      if (typeof contentWindow.showZones === 'function') {
        const iframeZones = updatedFloors.flatMap(floor =>
          floor.zones.map(zone => ({
            name: zone.name,
            is_wifi: zone.isWifi,      // Convert to iframe format
            is_dangerous: zone.isDanger, // Convert to iframe format
            location: zone.location
          }))
        );
        contentWindow.showZones(iframeZones);
      }
    }
  };

  // Function to update iframe zones
  const updateIframeZones = (updatedFloors: Floor[]) => {
    const iframe = document.querySelector('iframe');
    if (iframe?.contentWindow) {
      const contentWindow = iframe.contentWindow as Window & typeof globalThis & { showZones?: (zones: Array<object>) => void };
      if (typeof contentWindow.showZones === 'function') {
        const iframeZones = updatedFloors.flatMap(floor =>
          floor.zones.map(zone => ({
            name: zone.name,
            is_wifi: zone.isWifi,
            is_dangerous: zone.isDanger,
            location: zone.location
          }))
        );
        contentWindow.showZones(iframeZones);
      }
    }
  };

  const formatPrice = (price: number) => {
    return `$${Math.round(price).toLocaleString()}`;
  };

  const calculateFloorItemsCost = () => {
    return floors.reduce((total, floor) => {
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

  const generateOrderNumber = (projectName: string) => {
    if (!projectName) return '#10000';

    const firstLetter = projectName.charAt(0).toUpperCase();
    const randomNum = Math.floor(Math.random() * (9999 - 3500 + 1) + 3500);
    const lastChar = projectName.slice(-1).toUpperCase();

    return `#SMSI${firstLetter}${randomNum}${lastChar}`;
  };

  const handleExport = async () => {
    if (typeof window === 'undefined') return;

    const hasItems = (floor: Floor) => {
      return Object.values(floor.items).some(quantity => quantity > 0);
    };

    const floorsWithItems = floors.filter(hasItems);

    try {
      const { generateAndDownloadPDF } = await import('@/utils/pdfUtils');
      await generateAndDownloadPDF({
        projectData,
        orderNumber: generateOrderNumber(projectData.name),
        floorsWithItems,
        buildingItems,
        formatPrice,
        getItemName,
        calculateItemCost,
        totalCost: calculateFloorItemsCost() + calculateBuildingItemsCost()
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleStepChange = async (newStep: number) => {
    if (newStep > step) {
      if (step === 1) {
        const isValid = basicInfoRef.current?.validateName();
        if (!isValid) {
          setValidationError(true);
          return;
        }
      }
    }

    setValidationError(false);
    setStep(newStep);
  };

  const updateProjectField = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const updateFloorItem = (floorId: string, itemKey: string, value: number) => {
    setFloors(prevFloors =>
      prevFloors.map(floor =>
        floor.id === floorId
          ? { ...floor, items: { ...floor.items, [itemKey]: value } }
          : floor
      )
    );
  };

  const updateFloorOrder = (newOrder: Floor[]) => {
    setFloors(newOrder);
    updateIframeZones(newOrder);
  };

  const clearFloorItems = (floorId: string) => {
    setFloors(prevFloors =>
      prevFloors.map(floor =>
        floor.id === floorId
          ? {
            ...floor,
            items: Object.keys(floor.items).reduce((acc, key) => ({
              ...acc,
              [key]: 0
            }), {})
          }
          : floor
      )
    );
  };

  const updateBuildingItem = (itemKey: string, value: number) => {
    setBuildingItems(prev => ({
      ...prev,
      [itemKey]: value
    }));
  };
  const updateHoistItem = (itemKey: string, value: number) => {
    setBuildingItems(prev => ({
      ...prev,
      hoistSystem: {
        ...prev.hoistSystem,
        [itemKey]: value
      }
    }));
  };

  function initializeIframeData(floors: Floor[], floorNames: Record<number, string>, cameras: Array<object>) {
    console.log('Initializing iframe data');
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {

      const contentWindow = iframe.contentWindow as Window & typeof globalThis & { updateFloors?: () => void } & { showZones?: (zones: Array<object>) => void } & { addCameras?: (cams: Array<object>) => void } & { updateFloorNames?: (names: Record<string, string>) => void };
      const iframeDocument = contentWindow.document;
      const floorAmount = iframeDocument.getElementById('floorInput') as HTMLInputElement | null;
      if (floorAmount) {
        floorAmount.value = String(floors.length);
      }

      if (typeof contentWindow.updateFloorNames === 'function') {
        contentWindow.updateFloorNames(floorNames);
      }
      iframe.hidden = false;

      if (typeof contentWindow.updateFloors === 'function') {
        contentWindow.updateFloors();
        updateIframeZones(floors);
      }

      if (typeof contentWindow.addCameras === 'function' && cameras.length > 0) {
        contentWindow.addCameras(cameras);
      }
    }
  }
  console.log('isMobile:', isMobile);
  console.log('forceDesktopView:', forceDesktopView);


  // Implementation for the mobile view section in your page.tsx

  // In your HomeContent component, within the mobile view section
  if (isMobile && !forceDesktopView) {

    const floorWorkerCounts: { [key: number]: number } = {};
    const floorEquipmentCounts: { [key: number]: number } = {};
    const floorSensorCounts: { [key: number]: number } = {};

    // If there are active workers, count them by floor
    
      workers.forEach(worker => {
        if (worker.floor_physical !== null && activeItems.ids.includes(worker.tagId)) {
          const floorNum = Number(worker.floor_physical);
          floorWorkerCounts[floorNum] = (floorWorkerCounts[floorNum] || 0) + 1;
        }
      });
    

    // Count equipment per floor
      equipment.forEach(item => {
        if (item.floor_physical !== null && activeItems.ids.includes(item.tagId)) {
          const floorNum = Number(item.floor_physical);
          floorEquipmentCounts[floorNum] = (floorEquipmentCounts[floorNum] || 0) + 1;
        }
      });

    // Count sensors per floor
      sensors.forEach(sensor => {
        if (sensor.location?.floor_physical !== null && activeItems.ids.includes(sensor.tagId)) {
          const floorNum = Number(sensor.location.floor_physical);
          floorSensorCounts[floorNum] = (floorSensorCounts[floorNum] || 0) + 1;
        }
      });

    const activeWorkersData = formatWorkerDataForModal(
      workers.filter(worker => activeItems.ids.includes(worker.tagId || worker.id))
    );

    const activeEquipmentData = formatEquipmentDataForModal(
      equipment.filter(item => activeItems.ids.includes(item.tagId || item.id))
    );

    const activeSensorsData = formatSensorDataForModal(
      sensors.filter(sensor => activeItems.ids.includes(sensor.tagId || sensor.id))
    );
    
    console.log('Floor Worker counts:', floorWorkerCounts);
    console.log('Floor Sensor counts:', floorSensorCounts);
    console.log('Floor Equipment counts:', floorEquipmentCounts);

    const floorCount = 10

    return (
      <div className="h-screen flex flex-col">
        {/* Main content area - takes all available space except bottom menu */}
        <div className="flex-1 relative overflow-hidden">
          <MobileBuilding
            floorCount={10}
            activeFloor={activeFloor}
            setActiveFloor={setActiveFloor}
            floorData={{
              ...Object.fromEntries(
                Array.from({ length: floorCount + 1 }, (_, i) => {
                  const floor = floors.find(f => Number(f.level) === i) || { zones: [] };
                  return [
                    i,
                    {
                      hasCameras: floor.zones && floor.zones.some ? floor.zones.some(zone => !zone.isWifi) : false,
                      hasAlerts: floor.zones && floor.zones.some ? floor.zones.some(zone => zone.isDanger) : false,
                      zonesCount: floor.zones ? floor.zones.length : 0,
                      workerCount: floorWorkerCounts[i] || 0,
                      equipmentCount: floorEquipmentCounts[i] || 0,
                      sensorCount: floorSensorCounts[i] || 0
                    }
                  ];
                })
              )
            }}
            workersData={activeWorkersData}
            equipmentData={activeEquipmentData}
            sensorsData={activeSensorsData}
          />
          

          {/* Filter button */}
          <button
            className="absolute right-6 bottom-20 z-40"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="27.25" fill="#41A3EA" stroke="url(#paint0_linear_37_12426)" strokeWidth="1.5" />
              <path d="M30.7061 38.1803C30.7061 38.9734 30.186 40.0135 29.523 40.4166L27.6898 41.5997C25.9866 42.6528 23.6204 41.4697 23.6204 39.3635V32.4077C23.6204 31.4846 23.1003 30.3015 22.5673 29.6514L17.5747 24.3989C16.9116 23.7358 16.3916 22.5657 16.3916 21.7726V18.7563C16.3916 17.1831 17.5748 16 19.0179 16H36.3617C37.8048 16 38.988 17.1831 38.988 18.6263V21.5126C38.988 22.5657 38.3249 23.8788 37.6748 24.5289" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32.9817 34.8655C35.2795 34.8655 37.1422 33.0029 37.1422 30.7051C37.1422 28.4074 35.2795 26.5447 32.9817 26.5447C30.684 26.5447 28.8213 28.4074 28.8213 30.7051C28.8213 33.0029 30.684 34.8655 32.9817 34.8655Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M37.9217 35.6455L36.6216 34.3453" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="paint0_linear_37_12426" x1="269.5" y1="-94.5" x2="6.49999" y2="51" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#05061A" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#05061A" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </button>

          <MobileFilter
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            updateDB={updateDB}
            floorNames={floorNames}
            onSelectItems={(selections) => {
              // Log the selections correctly
              console.log(`Received ${selections.workers.length} workers, ${selections.equipment.length} equipment, ${selections.sensors.length} sensors`);

              // Store all selected items in their respective state variables
              setWorkers(selections.workers);
              setEquipment(selections.equipment);
              setSensors(selections.sensors);

              // Determine which type to use as "primary" for display purposes
              // Let's choose the one with the most selected items or just use a default
              let primaryType = 'workers';
              if (selections.equipment.length > selections.workers.length &&
                selections.equipment.length > selections.sensors.length) {
                primaryType = 'equipment';
              } else if (selections.sensors.length > selections.workers.length &&
                selections.sensors.length > selections.equipment.length) {
                primaryType = 'sensors';
              }

              // Collect all IDs from all selected items
              const allItemIds = [
                ...selections.workers.map(item => item.tagId),
                ...selections.equipment.map(item => item.tagId),
                ...selections.sensors.map(item => item.tagId)
              ];

              // Set active items with all IDs
              setActiveItems({
                type: primaryType,
                ids: allItemIds
              });
            }}
          />


          {/* Show alerts overlay when alerts button is clicked */}
          {showAlerts && (
            <div className="absolute inset-0 bg-gray-900/80 z-40 p-4">
              {/* Your existing alerts content */}
            </div>
          )}
        </div>

        {/* Bottom menu - fixed at bottom */}
        <BottomMenuBar
          activePage={isEditMode ? "modify" : isRealtimeMode ? "realtime" : showAlerts ? "alerts" : "realtime"}
          onEditClick={() => {
            setIsEditMode(true);
            setIsRealtimeMode(false);
            setShowAlerts(false);
            setShowFilters(false);
          }}
          onTargetClick={() => {
            setIsEditMode(false);
            setIsRealtimeMode(true);
            setShowAlerts(false);
            setShowFilters(false);
          }}
          onAlertsClick={() => {
            setIsEditMode(false);
            setIsRealtimeMode(false);
            setShowAlerts(true);
            setShowFilters(false);
          }}
          hasNotifications={false}
          isHidden={showFilters}
        />
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-white">
      {step < 4 ? (
        <Sidebar
          floorCount={floorCount}
          setFloorCount={setFloorCount}
          activeFloor={activeFloor}
          setActiveFloor={setActiveFloor}
          buildingItems={buildingItems}
        />
      ) : (
        <div className="w-1/2 bg-white relative flex flex-col h-full">
          <iframe
            src="/buildingModel.html"
            width="100%"
            height="100%"
            hidden
          ></iframe>
        </div>
      )}
      <div className="w-1/2 flex flex-col relative shadow-xl"
        style={{
          background: 'linear-gradient(180deg, white 0%, white 70%, #F7F7F7 100%)'
        }}>
        <Header projectName={step === 1 ? '' : projectData.name} />
        <Steps
          currentStep={step}
          devicesCameras={devicesCameras}
        />
        <div className="flex-1 relative overflow-hidden">
          {step === 1 && (
            <BasicInfo
              ref={basicInfoRef}
              formData={projectData}
              updateField={updateProjectField}
              hasError={validationError}
            />
          )}
          {step === 2 && (
            <FloorConfig
              floors={floors}
              activeFloor={activeFloor}
              buildingItems={buildingItems}
              onUpdateItem={updateFloorItem}
              onUpdateOrder={updateFloorOrder}
              onClearItems={clearFloorItems}
              onUpdateBuildingItem={updateBuildingItem}
              onUpdateHoistItem={updateHoistItem}
            />
          )}
          {step === 3 && (
            <CostReview
              projectData={projectData}
              floors={floors}
              buildingItems={buildingItems}
            />
          )}
          {step === 4 && (
            <ProjectManagement
              onExport={handleExport}
              floors={floors}
              floorNames={floorNames}
              cams={cams}
              projectId={projectId}
              onUpdateFloorOrder={updateFloorOrder}
              onAddZone={handleAddZone}
              onRemoveZone={handleRemoveZone}
              onUpdateZone={handleUpdateZone}
              updateDB={updateDB}
            />
          )}
        </div>
        {step < 4 && (<Footer
          step={step}
          setStep={handleStepChange}
          canProgress={step === 1 ? projectData.name.trim() !== '' : true}
          status={projectData.status}
          onExport={handleExport}
        />)}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SearchParamsProvider>
        {({ projectId }) => <HomeContent projectId={projectId} />}
      </SearchParamsProvider>
    </Suspense>
  )
}