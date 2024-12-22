import { Info, LayoutGrid, StarIcon, Settings } from 'lucide-react';
import { Step } from '@/types/building';

// Narrow down the possible icon types
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
  const getIcon = (icon: StepIconType) => {
    switch(icon) {
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