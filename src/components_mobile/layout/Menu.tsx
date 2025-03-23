import React from 'react';
import { Pencil, Target, Bell } from 'lucide-react';

type ActivePage = 'modify' | 'realtime' | 'alerts';

interface BottomMenuProps {
    activePage?: ActivePage;
    onEditClick?: () => void;
    onTargetClick?: () => void;
    onAlertsClick?: () => void;
    hasNotifications?: boolean;
    isHidden?: boolean;
}

export default function BottomMenuBar({
    activePage,
    onEditClick,
    onTargetClick,
    onAlertsClick,
    isHidden = false,
    hasNotifications = false
}: BottomMenuProps) {
    if (isHidden) return null;
    
    return (
        <div className="fixed bottom-0 left-0 right-0 w-full px-4 pb-4 z-50">
            <div className="bg-black rounded-full h-16 flex items-center justify-center gap-4 shadow-lg border border-gray-700/50">
                {/* Manage Button */}
                <button
                    className="flex items-center transition-colors"
                    onClick={onEditClick}
                >
                    <div
                        className="flex items-center gap-2 py-2 px-4 rounded-full"
                        style={{ backgroundColor: activePage === 'modify' ? '#4b5563' : 'transparent' }}
                    >
                        <Pencil size={18} className={activePage === 'modify' ? 'text-white' : 'text-gray-300'} />
                        <span className={`text-sm font-medium ${activePage === 'modify' ? 'text-white' : 'text-gray-300'}`}>Manage</span>
                    </div>
                </button>

                {/* Middle Realtime Button */}
                <button
                    className="flex items-center justify-center transition-colors"
                    onClick={onTargetClick}
                >
                    <div
                        className="flex items-center gap-2 py-2 px-4 rounded-full"
                        style={{ backgroundColor: activePage === 'realtime' ? '#4b5563' : 'transparent' }}
                    >
                        <Target size={18} className={activePage === 'realtime' ? 'text-white' : 'text-gray-300'} />
                        <span className={`text-sm font-medium ${activePage === 'realtime' ? 'text-white' : 'text-gray-300'}`}>Real-Time</span>
                    </div>
                </button>

                {/* Alerts Button */}
                <button
                    className="flex items-center transition-colors relative"
                    onClick={onAlertsClick}
                >
                    <div
                        className="flex items-center gap-2 py-2 px-4 rounded-full"
                        style={{ backgroundColor: activePage === 'alerts' ? '#4b5563' : 'transparent' }}
                    >
                        <Bell size={18} className={activePage === 'alerts' ? 'text-white' : 'text-gray-300'} />
                        <span className={`text-sm font-medium ${activePage === 'alerts' ? 'text-white' : 'text-gray-300'}`}>Alerts</span>
                        {hasNotifications && (
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}