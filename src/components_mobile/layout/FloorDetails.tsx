import React from 'react';
import { X } from 'lucide-react';

// Types
interface ItemDetails {
    id: string;
    name: string;
    type: 'worker' | 'equipment' | 'sensor';
    position?: string;
    location?: {
        floor: number;
        apartment?: string;
    };
    lastSeen?: string;
    duration?: string;
    image?: string;
    visitHistory?: {
        time: string;
        duration: string;
        floor: string;
        location: string;
    }[];
}

interface FloorDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    floor: number;
    items: {
        workers: ItemDetails[];
        equipment: ItemDetails[];
        sensors: ItemDetails[];
    };
}

interface ItemSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    floor: number;
    items: {
        workers: ItemDetails[];
        equipment: ItemDetails[];
        sensors: ItemDetails[];
    };
    onSelectItem: (item: ItemDetails) => void;
}

interface ItemDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ItemDetails | null;
}

// Floor Details Modal Controller Component
export const FloorDetailsModal: React.FC<FloorDetailsModalProps> = ({
    isOpen,
    onClose,
    floor,
    items
}) => {
    const [selectedItem, setSelectedItem] = React.useState<ItemDetails | null>(null);

    // Count total items
    const totalItems = items.workers.length + items.equipment.length + items.sensors.length;

    // If there are no items, don't show anything
    if (!isOpen || totalItems === 0) return null;

    // If there's only one item, go directly to item details
    if (totalItems === 1) {
        const singleItem = items.workers[0] || items.equipment[0] || items.sensors[0];
        return <ItemDetailsModal isOpen={isOpen} onClose={onClose} item={singleItem} />;
    }

    // If there are multiple items, show the selection screen
    return (
        <>
            <ItemSelectionModal
                isOpen={isOpen && !selectedItem}
                onClose={onClose}
                floor={floor}
                items={items}
                onSelectItem={(item) => setSelectedItem(item)}
            />

            <ItemDetailsModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
            />
        </>
    );
};

// Item Selection Modal Component
const ItemSelectionModal: React.FC<ItemSelectionModalProps> = ({
    isOpen,
    onClose,
    floor,
    items,
    onSelectItem
}) => {
    if (!isOpen) return null;

    return (
        
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-lg flex flex-col" style={{ maxHeight: '75vh' }}>
                <div className="p-6 border-b flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Floor {floor}</h2>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Scrollable content area */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(75vh - 80px)' }}>
                    {/* Workers Section */}
                    {items.workers.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 text-orange-500">Workers ({items.workers.length})</h3>
                            <div className="space-y-2">
                                {items.workers.map(worker => (
                                    <div
                                        key={worker.id}
                                        className="p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors flex items-center cursor-pointer"
                                        onClick={() => onSelectItem(worker)}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-orange-200 mr-3 overflow-hidden flex items-center justify-center text-orange-500">
                                            {/* Worker icon (hard hat) */}
                                            <div className="h-10 w-10 rounded-full bg-orange-200 overflow-hidden flex items-center justify-center text-orange-500">
                                                <svg viewBox="0 0 20 20" className="h-5 w-8">
                                                    <g transform="translate(-10, -19)">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.974 34.761H33.763C34.816 34.761 35.154 33.341 34.212 32.868L31.565 31.535C31.167 27.61 28.405 19.761 20.536 19.761C10.7 19.761 8.613 28.825 8.613 30.761C7.708 30.761 6.974 31.495 6.974 32.4V32.761C6.974 33.865 7.869 34.761 8.974 34.761ZM18.608 25.436C18.596 25.441 18.589 25.445 18.586 25.446C17.964 25.74 17.222 25.476 16.925 24.856C16.627 24.233 16.89 23.487 17.512 23.188L18.052 24.316C17.512 23.188 17.513 23.188 17.514 23.188L17.515 23.187L17.518 23.186L17.526 23.182L17.548 23.172C17.566 23.164 17.588 23.154 17.616 23.142C17.671 23.118 17.745 23.087 17.839 23.051C18.025 22.98 18.285 22.89 18.607 22.805C19.246 22.634 20.147 22.475 21.186 22.527C23.333 22.637 25.916 23.651 27.909 26.894C28.271 27.482 28.087 28.252 27.499 28.613C26.911 28.975 26.141 28.791 25.779 28.203C24.239 25.696 22.425 25.094 21.059 25.024C20.343 24.988 19.708 25.098 19.251 25.22C19.024 25.281 18.847 25.342 18.731 25.386C18.674 25.408 18.632 25.426 18.608 25.436Z" fill="currentColor" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium">{worker.name}</div>
                                            <div className="text-sm text-gray-500">{worker.position || 'Worker'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Equipment Section */}
                    {items.equipment.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 text-green-500">Equipment ({items.equipment.length})</h3>
                            <div className="space-y-2">
                                {items.equipment.map(equipment => (
                                    <div
                                        key={equipment.id}
                                        className="p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors flex items-center cursor-pointer"
                                        onClick={() => onSelectItem(equipment)}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-green-200 mr-3 overflow-hidden flex items-center justify-center text-green-500">
                                            {/* Equipment icon - tools */}
                                            <svg viewBox="0 0 30 30" className="h-8 w-8 text-green-500">
                                                <g transform="translate(0, 0)">
                                                    <g transform="matrix(0.09262, 0, 0, 0.091869, -0.376461, 0.038726)">
                                                        <path d="M352.203,286.132l-78.933-78.933c-3.578-3.578-8.35-5.548-13.436-5.548c-2.151,0-4.238,0.373-6.21,1.05l-18.929-18.929 c-2.825-2.826-6.593-4.382-10.607-4.382c-4.014,0-7.781,1.556-10.606,4.381l-4.978,4.978l-8.904-8.904l38.965-39.17 c9.105,3.949,19.001,5.837,29.224,5.837c0.002,0,0.004,0,0.007,0c19.618,0,38.064-7.437,51.939-21.312 c18.59-18.588,25.842-45.811,18.926-71.207c-0.859-3.159-3.825-5.401-7.053-5.401c-1.389,0-3.453,0.435-5.39,2.372 c-0.265,0.262-26.512,26.322-35.186,34.996c-0.955,0.955-2.531,1.104-3.45,1.104c-0.659,0-1.022-0.069-1.022-0.069v0.002 l-0.593-0.068c-10.782-0.99-23.716-2.984-26.98-4.489c-1.556-3.289-3.427-16.533-4.427-27.489v-0.147l-0.234-0.308 c-0.058-0.485-0.31-2.958,1.863-5.131c9.028-9.029,33.847-34.072,34.083-34.311c2.1-2.099,2.9-4.739,2.232-7.245 c-0.801-3.004-3.355-4.686-5.469-5.257C280.772,0.859,274.292,0,267.788,0c-19.62,0-38.068,7.64-51.941,21.512 c-21.901,21.901-27.036,54.296-15.446,81.141l-38.996,38.995L94.682,74.927c-0.041-0.041-0.086-0.075-0.128-0.115 c0.63-2.567,0.907-5.233,0.791-7.947c-0.329-7.73-3.723-15.2-9.558-21.034L62.041,22.083c-0.519-0.519-3.318-3.109-7.465-3.109 c-1.926,0-4.803,0.583-7.58,3.359L20.971,48.359c-3.021,3.021-4.098,6.903-2.954,10.652c0.767,2.512,2.258,4.139,2.697,4.578 l23.658,23.658c6.179,6.179,14.084,9.582,22.259,9.582c0,0,0,0,0.001,0c2.287,0,4.539-0.281,6.721-0.818 c0.041,0.042,0.075,0.087,0.116,0.128l66.722,66.722l-31.692,31.692c-1.428,1.428-2.669,2.991-3.726,4.654 c-9.281-4.133-19.404-6.327-29.869-6.327c-19.623,0-38.071,7.642-51.946,21.517c-18.589,18.589-25.841,45.914-18.926,71.31 c0.859,3.158,3.825,5.451,7.052,5.451c0,0,0,0,0.001,0c1.389,0,3.453-0.41,5.39-2.347c0.265-0.262,26.513-26.309,35.187-34.983 c0.955-0.955,2.639-1.097,3.557-1.097c0.66,0,1.125,0.072,1.132,0.072h-0.001l0.487,0.069c10.779,0.988,23.813,2.982,27.078,4.489 c1.556,3.29,3.575,16.534,4.554,27.49l0.07,0.501c0.006,0.026,0.362,2.771-1.952,5.086c-9.029,9.029-33.888,34.072-34.124,34.311 c-2.1,2.099-2.92,4.74-2.252,7.245c0.802,3.004,3.346,4.685,5.459,5.256c6.264,1.694,12.738,2.553,19.243,2.553 c19.621,0,38.066-7.64,51.938-21.512c13.876-13.875,21.518-32.324,21.517-51.947c0-10.465-2.193-20.586-6.326-29.868 c1.664-1.057,3.227-2.298,4.654-3.726l31.693-31.693l8.904,8.904l-4.979,4.979c-2.826,2.825-4.382,6.592-4.382,10.606 c0,4.015,1.556,7.782,4.382,10.607l18.929,18.929c-0.677,1.972-1.05,4.059-1.05,6.209c0,5.086,1.971,9.857,5.549,13.435 l78.934,78.934c3.577,3.577,8.349,5.548,13.435,5.548c5.086,0,9.857-1.971,13.435-5.548l40.659-40.66 c3.578-3.578,5.549-8.349,5.549-13.435C357.752,294.482,355.782,289.71,352.203,286.132z" fill="#aad500" />
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">{equipment.name}</div>
                                            <div className="text-sm text-gray-500">Equipment</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sensors Section */}
                    {items.sensors.length > 0 && (
                        <div className="mb-2">
                            <h3 className="text-lg font-semibold mb-3 text-blue-500">Sensors ({items.sensors.length})</h3>
                            <div className="space-y-2">
                                {items.sensors.map(sensor => (
                                    <div
                                        key={sensor.id}
                                        className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center cursor-pointer"
                                        onClick={() => onSelectItem(sensor)}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-blue-200 mr-3 overflow-hidden flex items-center justify-center text-blue-500">
                                            {/* Sensor icon */}
                                            <svg viewBox="0 0 40 40" className="h-10 w-10">
                                                <g transform="translate(4, 4)">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M16.791 4.069C23.418 4.069 28.791 9.441 28.791 16.069C28.791 22.696 23.418 28.069 16.791 28.069C10.164 28.069 4.791 22.696 4.791 16.069C4.791 9.441 10.164 4.069 16.791 4.069ZM22.31 19.743C22.907 18.677 23.255 17.421 23.255 16.069C23.255 14.717 22.907 13.46 22.31 12.395C21.972 11.792 22.186 11.031 22.788 10.693C23.39 10.355 24.152 10.569 24.49 11.171C25.296 12.608 25.755 14.285 25.755 16.069C25.755 17.853 25.296 19.53 24.49 20.966C24.152 21.568 23.39 21.782 22.788 21.445C22.186 21.107 21.972 20.345 22.31 19.743ZM11.273 19.743C11.61 20.345 11.396 21.107 10.794 21.445C10.192 21.782 9.43 21.568 9.092 20.966C8.286 19.53 7.827 17.853 7.827 16.069C7.827 14.285 8.286 12.608 9.092 11.171C9.43 10.569 10.192 10.355 10.794 10.693C11.396 11.031 11.61 11.792 11.273 12.395C10.675 13.46 10.327 14.717 10.327 16.069C10.327 17.421 10.675 18.677 11.273 19.743Z" fill="currentColor" />
                                                    <circle cx="16.791" cy="16.069" r="3" fill="white" fillOpacity="0.6" />
                                                </g>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">{sensor.name}</div>
                                            <div className="text-sm text-gray-500">Sensor</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Item Details Modal Component
const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    // Sample visit history for demonstration
    const visitHistory = item.visitHistory || [
        { time: '10:25', duration: '00:35', floor: '03', location: '03 Apt' },
        { time: '09:15', duration: '00:10', floor: '04', location: '02 Apt' },
        { time: '09:05', duration: '01:14', floor: '06', location: 'Lobby' },
        { time: '08:50', duration: '00:50', floor: '07', location: 'Lobby' },
        { time: '07:49', duration: '01:00', floor: '08', location: 'Lobby' },
        { time: '07:30', duration: '02:03', floor: '09', location: 'Storage' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-lg">
                {/* Header with image and name */}
                <div className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                            <div className="h-16 w-16 rounded-full overflow-hidden mr-4 bg-gray-100">
                                {item.type === 'worker' ? (
                                    <div className="h-full w-full flex items-center justify-center bg-orange-100 ">
                                        {/* Worker icon (hard hat) - same as in the floor component */}
                                        <div className="h-full w-full flex items-center justify-center bg-orange-100  pb-5">
                                            <svg viewBox="0 0 40 40" className="h-12 w-12 text-orange-500">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.974 34.761H33.763C34.816 34.761 35.154 33.341 34.212 32.868L31.565 31.535C31.167 27.61 28.405 19.761 20.536 19.761C10.7 19.761 8.613 28.825 8.613 30.761C7.708 30.761 6.974 31.495 6.974 32.4V32.761C6.974 33.865 7.869 34.761 8.974 34.761ZM18.608 25.436C18.596 25.441 18.589 25.445 18.586 25.446C17.964 25.74 17.222 25.476 16.925 24.856C16.627 24.233 16.89 23.487 17.512 23.188L18.052 24.316C17.512 23.188 17.513 23.188 17.514 23.188L17.515 23.187L17.518 23.186L17.526 23.182L17.548 23.172C17.566 23.164 17.588 23.154 17.616 23.142C17.671 23.118 17.745 23.087 17.839 23.051C18.025 22.98 18.285 22.89 18.607 22.805C19.246 22.634 20.147 22.475 21.186 22.527C23.333 22.637 25.916 23.651 27.909 26.894C28.271 27.482 28.087 28.252 27.499 28.613C26.911 28.975 26.141 28.791 25.779 28.203C24.239 25.696 22.425 25.094 21.059 25.024C20.343 24.988 19.708 25.098 19.251 25.22C19.024 25.281 18.847 25.342 18.731 25.386C18.674 25.408 18.632 25.426 18.608 25.436Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : item.type === 'equipment' ? (
                                    <div className="h-full w-full flex items-center justify-center bg-green-100">
                                        {/* Equipment icon - tools */}
                                        <svg viewBox="0 0 40 40" className="h-10 w-10 text-green-500">
                                            <g transform="translate(5, 2)">
                                                <g transform="matrix(0.09262, 0, 0, 0.091869, -0.376461, 0.038726)">
                                                    <path d="M352.203,286.132l-78.933-78.933c-3.578-3.578-8.35-5.548-13.436-5.548c-2.151,0-4.238,0.373-6.21,1.05l-18.929-18.929 c-2.825-2.826-6.593-4.382-10.607-4.382c-4.014,0-7.781,1.556-10.606,4.381l-4.978,4.978l-8.904-8.904l38.965-39.17 c9.105,3.949,19.001,5.837,29.224,5.837c0.002,0,0.004,0,0.007,0c19.618,0,38.064-7.437,51.939-21.312 c18.59-18.588,25.842-45.811,18.926-71.207c-0.859-3.159-3.825-5.401-7.053-5.401c-1.389,0-3.453,0.435-5.39,2.372 c-0.265,0.262-26.512,26.322-35.186,34.996c-0.955,0.955-2.531,1.104-3.45,1.104c-0.659,0-1.022-0.069-1.022-0.069v0.002 l-0.593-0.068c-10.782-0.99-23.716-2.984-26.98-4.489c-1.556-3.289-3.427-16.533-4.427-27.489v-0.147l-0.234-0.308 c-0.058-0.485-0.31-2.958,1.863-5.131c9.028-9.029,33.847-34.072,34.083-34.311c2.1-2.099,2.9-4.739,2.232-7.245 c-0.801-3.004-3.355-4.686-5.469-5.257C280.772,0.859,274.292,0,267.788,0c-19.62,0-38.068,7.64-51.941,21.512 c-21.901,21.901-27.036,54.296-15.446,81.141l-38.996,38.995L94.682,74.927c-0.041-0.041-0.086-0.075-0.128-0.115 c0.63-2.567,0.907-5.233,0.791-7.947c-0.329-7.73-3.723-15.2-9.558-21.034L62.041,22.083c-0.519-0.519-3.318-3.109-7.465-3.109 c-1.926,0-4.803,0.583-7.58,3.359L20.971,48.359c-3.021,3.021-4.098,6.903-2.954,10.652c0.767,2.512,2.258,4.139,2.697,4.578 l23.658,23.658c6.179,6.179,14.084,9.582,22.259,9.582c0,0,0,0,0.001,0c2.287,0,4.539-0.281,6.721-0.818 c0.041,0.042,0.075,0.087,0.116,0.128l66.722,66.722l-31.692,31.692c-1.428,1.428-2.669,2.991-3.726,4.654 c-9.281-4.133-19.404-6.327-29.869-6.327c-19.623,0-38.071,7.642-51.946,21.517c-18.589,18.589-25.841,45.914-18.926,71.31 c0.859,3.158,3.825,5.451,7.052,5.451c0,0,0,0,0.001,0c1.389,0,3.453-0.41,5.39-2.347c0.265-0.262,26.513-26.309,35.187-34.983 c0.955-0.955,2.639-1.097,3.557-1.097c0.66,0,1.125,0.072,1.132,0.072h-0.001l0.487,0.069c10.779,0.988,23.813,2.982,27.078,4.489 c1.556,3.29,3.575,16.534,4.554,27.49l0.07,0.501c0.006,0.026,0.362,2.771-1.952,5.086c-9.029,9.029-33.888,34.072-34.124,34.311 c-2.1,2.099-2.92,4.74-2.252,7.245c0.802,3.004,3.346,4.685,5.459,5.256c6.264,1.694,12.738,2.553,19.243,2.553 c19.621,0,38.066-7.64,51.938-21.512c13.876-13.875,21.518-32.324,21.517-51.947c0-10.465-2.193-20.586-6.326-29.868 c1.664-1.057,3.227-2.298,4.654-3.726l31.693-31.693l8.904,8.904l-4.979,4.979c-2.826,2.825-4.382,6.592-4.382,10.606 c0,4.015,1.556,7.782,4.382,10.607l18.929,18.929c-0.677,1.972-1.05,4.059-1.05,6.209c0,5.086,1.971,9.857,5.549,13.435 l78.934,78.934c3.577,3.577,8.349,5.548,13.435,5.548c5.086,0,9.857-1.971,13.435-5.548l40.659-40.66 c3.578-3.578,5.549-8.349,5.549-13.435C357.752,294.482,355.782,289.71,352.203,286.132z" fill="#aad500" />
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-blue-100">
                                        {/* Sensor icon - wave pattern */}
                                        <svg viewBox="0 0 40 40" className="h-10 w-10 text-blue-500">
                                            <g transform="translate(3, 3)">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M16.791 4.069C23.418 4.069 28.791 9.441 28.791 16.069C28.791 22.696 23.418 28.069 16.791 28.069C10.164 28.069 4.791 22.696 4.791 16.069C4.791 9.441 10.164 4.069 16.791 4.069ZM22.31 19.743C22.907 18.677 23.255 17.421 23.255 16.069C23.255 14.717 22.907 13.46 22.31 12.395C21.972 11.792 22.186 11.031 22.788 10.693C23.39 10.355 24.152 10.569 24.49 11.171C25.296 12.608 25.755 14.285 25.755 16.069C25.755 17.853 25.296 19.53 24.49 20.966C24.152 21.568 23.39 21.782 22.788 21.445C22.186 21.107 21.972 20.345 22.31 19.743ZM11.273 19.743C11.61 20.345 11.396 21.107 10.794 21.445C10.192 21.782 9.43 21.568 9.092 20.966C8.286 19.53 7.827 17.853 7.827 16.069C7.827 14.285 8.286 12.608 9.092 11.171C9.43 10.569 10.192 10.355 10.794 10.693C11.396 11.031 11.61 11.792 11.273 12.395C10.675 13.46 10.327 14.717 10.327 16.069C10.327 17.421 10.675 18.677 11.273 19.743Z" fill="currentColor" />
                                                <circle cx="16.791" cy="16.069" r="3" fill="white" fillOpacity="0.6" />
                                            </g>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{item.name}</h2>
                                <p className="text-gray-600">{item.position || (item.type === 'worker' ? 'Worker' : item.type === 'equipment' ? 'Equipment' : 'Sensor')}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Current Location */}
                <div className="px-6 py-4">
                    <h3 className="text-md font-medium text-gray-500 mb-2">Current Location</h3>
                    <div className="flex bg-gray-50 rounded-lg p-4">
                        <div className="flex-1 border-r border-gray-200 text-center">
                            <span className="text-2xl font-bold">{item.location?.floor || '07'}</span>
                            <p className="text-sm text-gray-500">FLOOR</p>
                        </div>
                        <div className="flex-1 border-r border-gray-200 text-center">
                            <span className="text-2xl font-bold">{item.location?.apartment || '02'}</span>
                            <p className="text-sm text-gray-500">APT</p>
                        </div>
                        <div className="flex-1 text-center">
                            <span className="text-2xl font-bold">50</span>
                            <p className="text-sm text-gray-500">MINS</p>
                        </div>
                    </div>
                </div>

                {/* Visit History (only shown for workers) */}
                {item.type === 'worker' && (
                    <div className="px-6 pb-6">
                        <h3 className="text-md font-medium text-gray-700 mb-3">Visit History</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-4 text-sm text-gray-500 p-3 border-b border-gray-200">
                                <div>Time</div>
                                <div>Duration</div>
                                <div>Floor</div>
                                <div>Location</div>
                            </div>
                            {visitHistory.map((visit, index) => (
                                <div key={index} className={`grid grid-cols-4 p-3 text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                    <div className="font-medium">{visit.time}</div>
                                    <div>{visit.duration}</div>
                                    <div>{visit.floor}</div>
                                    <div>{visit.location}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Equipment or Sensor specific information */}
                {(item.type === 'equipment' || item.type === 'sensor') && (
                    <div className="px-6 pb-6">
                        <h3 className="text-md font-medium text-gray-700 mb-3">Device Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className="font-medium">Active</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Battery</span>
                                <span className="font-medium">72%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Last Maintained</span>
                                <span className="font-medium">12 Mar 2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Sensor Type</span>
                                <span className="font-medium">{item.type === 'sensor' ? 'Motion Detector' : 'Heavy Equipment'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pill navigation indicator at bottom */}
                <div className="flex justify-center pb-4">
                    <div className="h-1 w-20 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};