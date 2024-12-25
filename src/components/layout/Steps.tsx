import React, { useState } from 'react';
import { Info, LayoutGrid, StarIcon, Settings, Camera } from 'lucide-react';
import { Step } from '@/types/building';
import SingleCameraModal from '../modals/SingleCameraModal';

type StepIconType = 'info' | 'floors' | 'review' | 'manage';

const steps: Step[] = [
  { id: 1, label: 'Basic Info', icon: 'info' },
  { id: 2, label: 'Floor & Items', icon: 'floors' },
  { id: 3, label: 'Cost & Review', icon: 'review' },
  { id: 4, label: 'Management', icon: 'manage' }
];

interface StepsProps {
  currentStep: number;
}

export default function Steps({ currentStep }: StepsProps) {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  
  const [selectedCamera, setSelectedCamera] = useState<{
    title: string;
    videoUrl: string;  // Changed from streamUrl to videoUrl
  } | null>(null);

  const cameraVideos = {
    crane: '/videos/crane.mp4',
    mastClimber: '/videos/mastclimber.mp4',
    hoist: '/videos/hoist.mp4'
  };

  const handleCameraClick = (title: string) => {
    let videoUrl;
    switch (title) {
      case 'Crane':
        videoUrl = cameraVideos.crane;
        break;
      case 'Mast Climber':
        videoUrl = cameraVideos.mastClimber;
        break;
      case 'Hoist':
        videoUrl = cameraVideos.hoist;
        break;
      default:
        videoUrl = cameraVideos.crane; // default video
    }
    setSelectedCamera({ title, videoUrl });
    setIsCameraModalOpen(true);
  };

  const getIcon = (icon: StepIconType) => {
    switch (icon) {
      case 'info':
        return <Info size={18} />;
      case 'floors':
        return <LayoutGrid size={18} />;
      case 'review':
        return <StarIcon size={18} />;
      case 'manage':
        return <Settings size={18} />;
      default:
        return null;
    }
  };

  // If on the Management step, return a different component
  if (currentStep === 4) {
    return (
      <>
        <div className="flex justify-center items-center w-full px-6 py-0 space-x-6">
          <button
            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 shadow-sm text-white border rounded-lg hover:bg-cyan-200 hover:text-black"
            onClick={() => handleCameraClick('Crane')}
          >
            <Camera size={18} />
            Crane
          </button>
          <button
            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 shadow-sm text-white border rounded-lg hover:bg-cyan-200 hover:text-black"
            onClick={() => handleCameraClick('Mast Climber')}
          >
            <Camera size={18} />
            Mast Climber
          </button>
          <button
            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 shadow-sm text-white border rounded-lg hover:bg-cyan-200 hover:text-black"
            onClick={() => handleCameraClick('Hoist')}
          >
            <Camera size={18} />
            Hoist
          </button>
        </div>

        {selectedCamera && (
          <SingleCameraModal
            isOpen={isCameraModalOpen}
            onClose={() => {
              setIsCameraModalOpen(false);
              setSelectedCamera(null);
            }}
            title={selectedCamera.title}
            videoUrl={selectedCamera.videoUrl}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex justify-between items-center w-full px-6">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className={`flex items-center gap-2 ${currentStep === step.id ? 'text-gray-900' : 'text-gray-400'}`}>
            {getIcon(step.icon as StepIconType)}
            <span>{step.label}</span>
          </div>
          {step.id !== 4 && <div className="h-px bg-gray-200 flex-1 mx-4" />}
        </div>
      ))}
    </div>
  );
}