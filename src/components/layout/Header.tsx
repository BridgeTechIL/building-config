import { Building, X } from 'lucide-react';
import { montserrat } from '../../app/fonts';

interface HeaderProps {
  projectName: string;
  status?: 'draft' | 'saved';
}

export default function Header({ projectName, status = 'draft' }: HeaderProps) {  // Added status with default value
    return (
    <div className="flex justify-between items-center p-6 bg-white">
      <div className="flex items-center gap-4">
        <div className="text-cyan-500">
          <Building size={40} />
        </div>
        <div className={montserrat.className}>
          <div className="text-sm text-gray-500 hideOnProjectView">New Project</div>
          <div className="font-semibold text-cyan-500">{projectName || 'Untitled'}</div>
          <div className="text-xs text-gray-500 hideOnProjectView">{status === 'draft' ? 'unsaved' : 'saved'}</div>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <X size={24} />
      </button>
    </div>
  );
}