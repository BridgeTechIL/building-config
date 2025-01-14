import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Floor } from '@/types/building';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  floor: Floor;
  floors: Floor[];
  cams: Record<string, string[]>;
}

const CameraModal = ({ isOpen, onClose, floor, floors, cams }: CameraModalProps) => {
  floors = floors.sort((a, b) => a.level - b.level);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(
    floors.findIndex(f => f.level.toString() === floor.level.toString())
  );
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  useEffect(() => {
    setCurrentCameraIndex(0);
  }, [currentFloorIndex]);

  const currentFloor = floors[currentFloorIndex];
  const cameras = cams[currentFloor.level.toString()] || [];

const handlePrevious = () => {
  if (currentCameraIndex > 0) {
    setCurrentCameraIndex((prev) => prev - 1);
  } else {
    let prevFloorIndex = currentFloorIndex - 1;
    while (prevFloorIndex >= 0 && (!cams[floors[prevFloorIndex].level.toString()] || cams[floors[prevFloorIndex].level.toString()].length === 0)) {
      prevFloorIndex--;
    }
    if (prevFloorIndex >= 0) {
      const prevFloorCameras = cams[floors[prevFloorIndex].level.toString()];
      const lastCameraIndex = prevFloorCameras.length - 1;
      setCurrentFloorIndex(prevFloorIndex);
      setCurrentCameraIndex(lastCameraIndex);
    }
  }
};


  const handleNext = () => {
    if (currentCameraIndex < cameras.length - 1) {
      setCurrentCameraIndex(prev => prev + 1);
    } else {
      let nextFloorIndex = currentFloorIndex + 1;
      while (nextFloorIndex < floors.length && (!cams[floors[nextFloorIndex].level.toString()] || cams[floors[nextFloorIndex].level.toString()].length === 0)) {
        nextFloorIndex++;
      }
      if (nextFloorIndex < floors.length) {
        setCurrentFloorIndex(nextFloorIndex);
        setCurrentCameraIndex(0);
      }
    }
  };

  if (!isOpen) return null;

  const canGoPrevious = currentCameraIndex > 0 || (currentFloorIndex > 0 && floors.slice(0, currentFloorIndex).some(f => cams[f.level.toString()] && cams[f.level.toString()].length > 0));
  const canGoNext = currentCameraIndex < cameras.length - 1 || (currentFloorIndex < floors.length - 1 && floors.slice(currentFloorIndex + 1).some(f => cams[f.level.toString()] && cams[f.level.toString()].length > 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-[90vw]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-500">
            {`Floor ${currentFloor.id}`} Cameras
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
                key={`${currentFloor.level.toString()}-${cameras[currentCameraIndex]}`}
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