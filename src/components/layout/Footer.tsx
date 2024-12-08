import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FooterProps {
  step: number;
  setStep: (step: number) => void;
  canProgress: boolean;
  onExport?: () => Promise<void>;
}

export default function Footer({ step, setStep, canProgress, onExport }: FooterProps) {
  const handleNextClick = async () => {
    if (step === 3) {
      // On the last step, trigger PDF export
      if (onExport) {
        await onExport();
      }
    } else {
      setStep(Math.min(3, step + 1));
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-cyan-500 text-cyan-500">
            <span className="font-medium">{step}/3</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Step {String(step).padStart(2, '0')}</span>
            <span className="font-medium">
              {step === 1 ? 'Basic Information' : 
               step === 2 ? 'Floor & Items' : 'Cost & Review'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-cyan-500 text-white px-6 py-2 rounded-full font-medium">
            Save
          </button>
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`w-12 h-12 rounded-full border hover:bg-gray-50 flex items-center justify-center ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextClick}
            disabled={!canProgress}
            className={`w-12 h-12 rounded-full border hover:bg-gray-50 flex items-center justify-center ${
              !canProgress ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={step === 3 ? 'Download Summary PDF' : undefined}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}