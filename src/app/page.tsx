'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import BasicInfo from '@/components/forms/BasicInfo'
import FloorConfig from '@/components/forms/FloorConfig'
import Steps from '@/components/layout/Steps'
import { ProjectBasicInfo } from '@/types/building'



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

interface Floor {
  id: string;
  level: number;
  selected: boolean;
  isBase?: boolean;
  items: Record<string, number>;
}

export default function Home() {
  const [step, setStep] = useState(1)
  const [floorCount, setFloorCount] = useState(0)
  const [activeFloor, setActiveFloor] = useState<number | undefined>(undefined)
  const [projectData, setProjectData] = useState<ProjectBasicInfo>({
    name: '',
    installationDate: '',
    comments: '',
    status: 'draft'
  });
  const [floors, setFloors] = useState<Floor[]>([
    {
      id: '0',
      level: 0,
      selected: false,
      isBase: true,
      items: { ...defaultItems }
    }
  ])

  // Handle floor count changes
  useEffect(() => {
    setFloors(currentFloors => {
      // Keep existing floors
      const existingFloors = currentFloors.slice(0, floorCount + 1);
      
      // Add new floors if needed
      if (floorCount + 1 > currentFloors.length) {
        const newFloors = Array.from({ length: floorCount + 1 - currentFloors.length }, (_, index) => ({
          id: String(currentFloors.length + index),
          level: currentFloors.length + index,
          selected: false,
          isBase: false,
          items: { ...defaultItems }
        }));
        return [...existingFloors, ...newFloors];
      }
      
      return existingFloors;
    });
  }, [floorCount]);

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

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        floorCount={floorCount}
        setFloorCount={setFloorCount}
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
      />
      <div className="w-1/2 flex flex-col relative shadow-xl" 
           style={{
             background: 'linear-gradient(180deg, white 0%, white 70%, #F7F7F7 100%)'
           }}>
        <Header />
        <Steps currentStep={step} />
        <div className="flex-1 relative overflow-hidden">
          {step === 1 && (
            <BasicInfo 
              formData={projectData}
              updateField={updateProjectField}
            />
          )}
          {step === 2 && (
            <FloorConfig 
              floors={floors}
              activeFloor={activeFloor}
              onUpdateItem={updateFloorItem}
              onUpdateOrder={updateFloorOrder}
              onClearItems={clearFloorItems}
            />
          )}
        </div>
        <Footer step={step} setStep={setStep} />
      </div>
    </div>
  );
}