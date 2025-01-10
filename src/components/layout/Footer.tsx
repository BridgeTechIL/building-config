import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FooterProps {
  step: number;
  setStep: (step: number) => void;
  canProgress: boolean;
  status: 'draft' | 'saved';
  onExport?: () => Promise<void>;
}

export default function Footer({ step, setStep, canProgress, onExport }: FooterProps) {
  const handleSave = async () => {
    if (onExport) {
      await onExport();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t bg-white text-gray-500">
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-cyan-500 text-cyan-500">
            <span className="font-medium">{step}/3</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Step {String(step).padStart(2, '0')}</span>
            <span className="font-medium">
              {step === 1 ? 'Basic Information' : 
               step === 2 ? 'Floor & Items' : 
               step === 3 ? 'Cost & Review' :
               'Management'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className="bg-cyan-500 text-white px-6 py-2 rounded-full font-medium"
          >
            {step === 3 ? 'Save & Download' : 'Save'}
          </button>
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`w-12 h-12 rounded-full border hover:bg-gray-50 flex items-center justify-center border-gray-500 ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setStep(Math.min(4, step + 1))}
            disabled={!canProgress}
            className={`w-12 h-12 rounded-full border hover:bg-gray-50 flex items-center justify-center border-gray-500${
              !canProgress || step === 3 ? 'opacity-50 cursor-not-allowed text-gray-200' : ''
            } ${step === 3 ? 'invisible' : ''} `}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}