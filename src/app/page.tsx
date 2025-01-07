'use client'
import {useEffect, useRef, useState} from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import BasicInfo from '@/components/forms/BasicInfo'
import FloorConfig from '@/components/forms/FloorConfig'
import Steps from '@/components/layout/Steps'
import CostReview from '@/components/forms/CostReview'
import ProjectManagement from '@/components/forms/ProjectManagement'
import {Floor, ProjectBasicInfo, Zone} from '@/types/building'
import {calculateItemCost, getItemName} from '@/config/costs'
import {useSearchParams} from "next/navigation";


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


export default function Home() {
  const searchParams = useSearchParams(); // Access search params
  const projectId = searchParams.get('project_id'); // Get the "project_id" param
  const [step, setStep] = projectId? useState(4) : useState(1);
  const [activeFloor, setActiveFloor] = useState<number | undefined>(undefined)
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
const [floors, setFloors] = useState<Floor[]>([]);
const [floorNames, setFloorNames] = useState<Floor[]>([]);
const [cameras, setCameras] = useState<[]>([]);
const [cams, setCams] = useState<{}>({});
const [sensors, setSensors] = useState<[]>([]);
const [devicesCameras, setDevicesCameras] = useState<Record<string, string>>({});
useEffect(() => {

  if (projectId) {
    fetch(`https://us-central1-quiet-225015.cloudfunctions.net/manage-in-3d?project_id=${projectId}`)
        .then(response => response.json())
        .then(data => {

          const projectName = data.project_name;
          updateProjectField('name', projectName);
          const hideElements = document.querySelectorAll('.hideOnProjectView');
          hideElements.forEach(element => {
              element.classList.add('hidden');
          });

          const fetchedZones = data.zones.map((zone: any) => ({
            id: zone.id.toString(),
            gateId: zone.box_id,
            name: zone.display_name,
            isDanger: zone.is_danger,
            isWifi: false,
            location: {
              floor_physical: zone.floor_physical,
              xy: [zone.location_x? zone.location_x : Math.floor(Math.random() * 66) + 5, zone.location_y? zone.location_y : Math.floor(Math.random() * 66) + 5],
              is_exact: true
            }
          }));

          const wifiZones = data.access_points.map((ap: any) => ({
            id: ap.id.toString(),
            gateId: ap.id,
            name: 'Access Point',
            isDanger: false,
            isWifi: true,
            location: {
              floor_physical: ap.floor_physical,
              xy: [ap.location_x? ap.location_x : Math.floor(Math.random() * 66) + 5, ap.location_y? ap.location_y : Math.floor(Math.random() * 66) + 5],
              is_exact: true
            }
          }));

          const fetchedFloors = Object.entries(data.floor_names).map(([key, value]) => ({
            id: String(value),
            level: parseInt(key, 10),
            selected: false,
            isBase: key === "0",
            items: {...defaultItems},
            zones: [...fetchedZones.filter((zone: any) => zone.location.floor_physical === parseInt(key, 10)), ...wifiZones.filter((zone: any) => zone.location.floor_physical === parseInt(key, 10))]
          }));
          const sortedFloors = [...fetchedFloors].sort((a, b) => b.level - a.level);
          setFloors(sortedFloors);
          setFloorNames(data.floor_names);

          const cameras = data.cameras.map((cam: any) => ({
            name: cam.display_name,
            streamUrl: cam.stream_url,
            location: {
              floor_physical: cam.floor_physical,
              xy: [cam.location_x, cam.location_y],
              is_exact: true
            }
          }));
          setCameras(cameras);


          const fetchedCameras = Object.keys(data.floor_names).reduce((acc: any, floorId: string) => {
            acc[floorId] = data.cameras
              .filter((cam: any) => cam.floor_physical.toString() === floorId)
              .map((cam: any) => cam.stream_url);
            return acc;
          }, {});

          // Update cams object
          setCams(fetchedCameras)

          initializeIframeData(fetchedFloors, data.floor_names, cameras);

          const fetchSensors = data.sensors.map((sensor: any) => ({
                    tagId: sensor.id.toString(),
                    name: sensor.display_name,
                    type: sensor.type,
                    location: {
                      floor_physical: sensor.floor_physical,
                      xy: [sensor.location_x, sensor.location_y],
                      is_exact: true
                    }
                }));
          setSensors(fetchSensors);

          setDevicesCameras(data.devices_cameras);

        })
        .catch(error => console.error('Error fetching floors:', error));
  }}, []);



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
      updateDB(projectId,'rename', 'zones', parseInt(zoneId, 10), key, value);
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

  function initializeIframeData(floors: Floor[], floorNames: Floor[], cameras: Array<object>) {
    console.log('Initializing iframe data');
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {

      const contentWindow = iframe.contentWindow as Window & typeof globalThis & { updateFloors?: () => void } & { showZones?: (zones: Array<object>) => void } & { addCameras?: (cams: Array<object>) => void } & { updateFloorNames?: (names: Array<object>) => void };
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

  return (
    <div className="flex h-screen bg-white">
      {step < 4 ? (
        <Sidebar
          floorCount={floors.length}
          activeFloor={activeFloor}
          setActiveFloor={setActiveFloor}
          buildingItems={buildingItems}
        />
      ) : (
        <div className="w-1/2 bg-white p-8 relative flex flex-col h-full">
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
              cams={cams}
              sensors={sensors}
              projectId={projectId}
              onUpdateFloorOrder={updateFloorOrder}
              onAddZone={handleAddZone}
              onRemoveZone={handleRemoveZone}
              onUpdateZone={handleUpdateZone}
              updateDB={updateDB}
              onUpdateFloor={(floorId, updates) => {
                setFloors(prevFloors =>
                  prevFloors.map(floor =>
                    floor.id === floorId ? { ...floor, ...updates } : floor
                  )
                );
              }}
            />
          )}
        </div>
        {step < 4 && (<Footer
          step={step} 
          setStep={handleStepChange} 
          canProgress={step === 1 ? projectData.name.trim() !== '' : true}
          status={projectData.status}
          onExport={handleExport}
        /> )}
      </div>
    </div>
  );
}
