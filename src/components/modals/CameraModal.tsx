import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { floorCameras } from '@/config/cameras';
import { Floor } from '@/types/building';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  floor: Floor;
  floors: Floor[];
}

const CameraModal = ({ isOpen, onClose, floor, floors }: CameraModalProps) => {
  const [currentFloorIndex, setCurrentFloorIndex] = useState(
    floors.findIndex(f => f.id === floor.id)
  );
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  useEffect(() => {
    setCurrentCameraIndex(0);
  }, [currentFloorIndex]);

  const currentFloor = floors[currentFloorIndex];
  const cameras = floorCameras[currentFloor.id] || [];

  const handlePrevious = () => {
    if (currentCameraIndex > 0) {
      setCurrentCameraIndex(prev => prev - 1);
    } else if (currentFloorIndex > 0) {
      const prevFloor = floors[currentFloorIndex - 1];
      const prevFloorCameras = floorCameras[prevFloor.id] || [];
      setCurrentFloorIndex(prev => prev - 1);
      setCurrentCameraIndex(prevFloorCameras.length - 1);
    }
  };

  const handleNext = () => {
    if (currentCameraIndex < cameras.length - 1) {
      setCurrentCameraIndex(prev => prev + 1);
    } else if (currentFloorIndex < floors.length - 1) {
      setCurrentFloorIndex(prev => prev + 1);
      setCurrentCameraIndex(0);
    }
  };

  if (!isOpen) return null;

  const canGoPrevious = currentCameraIndex > 0 || currentFloorIndex > 0;
  const canGoNext = currentCameraIndex < cameras.length - 1 || currentFloorIndex < floors.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-[90vw]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {currentFloor.isBase ? 'Ground Floor' : `Floor ${currentFloor.level}`} Cameras
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">
              Floor {currentFloorIndex + 1} of {floors.length}
            </span>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="relative w-full flex justify-center mb-4">
            <div className="relative">
              <iframe
                key={`${currentFloor.id}-${cameras[currentCameraIndex]}`}
                src={cameras[currentCameraIndex]}
                width="385"
                height="270"
                frameBorder="0"
                scrolling="no"
                allow="autoplay"
                allowFullScreen
                className="bg-gray-100"
              />

              {canGoPrevious && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-[-40px] top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {canGoNext && (
                <button
                  onClick={handleNext}
                  className="absolute right-[-40px] top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {cameras.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCameraIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentCameraIndex === index ? 'bg-cyan-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;