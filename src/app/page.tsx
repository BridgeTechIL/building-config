'use client'
import { useState, useEffect, useRef } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import BasicInfo from '@/components/forms/BasicInfo'
import FloorConfig from '@/components/forms/FloorConfig'
import Steps from '@/components/layout/Steps'
import CostReview from '@/components/forms/CostReview'
import ProjectManagement from '@/components/forms/ProjectManagement'
import { ProjectBasicInfo } from '@/types/building'
import { calculateItemCost, getItemName } from '@/config/costs'
import { Floor } from '@/types/building'

const TOTAL_FLOORS = 25;

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
  const [step, setStep] = useState(1)
  // const [floorCount, setFloorCount] = useState(0)
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

  const [floors, setFloors] = useState<Floor[]>([
    {
      id: '0',
      level: 0,
      selected: false,
      isBase: true,
      items: { ...defaultItems },
      zones: []  // Add this
    }
  ]);

  useEffect(() => {
    setFloors(currentFloors => {
      const baseFloor = currentFloors[0];
      
      const additionalFloors = Array.from({ length: TOTAL_FLOORS }, (_, index) => ({
        id: String(index + 1),
        level: index + 1,
        selected: false,
        isBase: false,
        items: { ...defaultItems },
        zones: []  // Add this
      }));
  
      return [baseFloor, ...additionalFloors];
    });
  }, []);

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

  return (
    <div className="flex h-screen bg-white">
{step < 4 ? (
  <Sidebar
    floorCount={TOTAL_FLOORS}
    // setFloorCount={setFloorCount}
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
        onLoad={() => {
          const iframe = document.querySelector('iframe');

          // Ensure iframe exists and its contentWindow is accessible
          if (iframe && iframe.contentWindow) {
            const contentWindow = iframe.contentWindow as Window & typeof globalThis & { updateFloors?: () => void } & { showZones?: (zones: Array<object>) => void } & { addCameras?: (cams: Array<object>) => void };
            const iframeDocument = contentWindow.document;
            const floorAmount = iframeDocument.getElementById('floorInput') as HTMLInputElement | null;
            if (floorAmount) {
                    // floorAmount.value = String(floorCount + 1);
                    floorAmount.value = String(25);
            }

                  // Update floors
                  // if (typeof contentWindow.updateFloors === 'function') {
                  //   contentWindow.updateFloors();
                  // }

                  // Show zones
            if (typeof contentWindow.showZones === 'function') {
              const zones = [
                {name: 'normal', is_wifi: false, is_dangerous: false, location:{floor_physical: 4, xy: [70,25], is_exact: true}},
                {name: 'danger', is_wifi: true, is_dangerous: true, location:{floor_physical: 7, xy: [50,70], is_exact: true}},
                {name: 'wifi', is_wifi: true, is_dangerous: false, location:{floor_physical: 2, xy: [35,50], is_exact: true}},
              ]
              contentWindow.showZones(zones);
            }

            if (typeof contentWindow.addCameras === 'function') {
              const cams = [
                {name: 'Left', streamUrl: 'https://player.castr.com/live_094d9a001ee811eda8c7d91f796d7ea9', location:{floor_physical: 1, xy: [70,25], is_exact: true}},
                {name: 'Right', streamUrl: 'https://player.castr.com/live_0f4235e0186e11edaba527aa44cc5f75', location:{floor_physical: 5, xy: [35,50], is_exact: true}},
                {name: 'Lobby', streamUrl: 'https://player.castr.com/live_4aff5df0551411edb095b3325e745ec8', location:{floor_physical: 3, xy: [5,5], is_exact: true}},
              ]
              contentWindow.addCameras(cams);
            }

          }
        }}
    ></iframe>
  </div>
)}
      <div className="w-1/2 flex flex-col relative shadow-xl"
           style={{
             background: 'linear-gradient(180deg, white 0%, white 70%, #F7F7F7 100%)'
           }}>
        <Header projectName={step === 1 ? '' : projectData.name}/>
        <Steps currentStep={step}/>
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
              onUpdateFloorOrder={updateFloorOrder}
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
        <Footer 
          step={step} 
          setStep={handleStepChange} 
          canProgress={step === 1 ? projectData.name.trim() !== '' : true}
          status={projectData.status}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}
