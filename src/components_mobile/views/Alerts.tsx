import React, { useState, useEffect } from 'react';
import { Phone, AlertTriangle, Archive, EyeOff } from 'lucide-react';
import { getMockAlerts, formatAlertTime, AlertData } from '@/utils/dataUtils';

type AlertFilterType = 'all' | 'warnings' | 'archive';

const AlertsPage: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [filter, setFilter] = useState<AlertFilterType>('warnings');

    useEffect(() => {
        // Load alerts from mock data
        setAlerts(getMockAlerts());
    }, []);

    const handleArchiveAlert = (alertId: string) => {
        setAlerts(prev =>
            prev.map(alert =>
                alert.id === alertId
                    ? { ...alert, isArchived: true }
                    : alert
            )
        );
    };

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'all') return true;
        if (filter === 'warnings') return !alert.isArchived;
        if (filter === 'archive') return alert.isArchived;
        return !alert.isArchived;
    });

    const getAlertTypeIcon = (type: AlertData['type']) => {
        return <AlertTriangle size={18} className="text-red-500" />;
    };

    const getAlertTypeText = (type: AlertData['type']) => {
        return 'UNAUTHORIZED ACCESS';
    };

    const getWorkerName = (workerId?: string) => {
        // In a real app, you would look up the worker by ID
        // For now, we'll return placeholder names
        const workers: Record<string, string> = {
            "2": "Augustus Brown",
            "17": "Constantin Betivu",
            "25": "Ernest Morgan"
        };

        return workers[workerId || ''] || 'Unknown Worker';
    };

    const getEquipmentName = (equipmentId?: string) => {
        // Placeholder equipment lookup
        const equipment: Record<string, string> = {
            "201": "Drill",
            "202": "Ladder",
            "203": "Generator"
        };

        return equipment[equipmentId || ''] || 'Unknown Equipment';
    };

    const countByType = {
        all: alerts.length,
        warnings: alerts.filter(a => !a.isArchived).length,
        archive: alerts.filter(a => a.isArchived).length
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl mb-6">Alerts Notification</h1>

                {/* Filter Tabs */}
                <div className="flex space-x-1 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-2 rounded-full font-medium ${filter === 'all'
                            ? 'bg-white text-black shadow border border-gray-200'
                            : 'bg-white/70 text-gray-500'
                            }`}
                    >
                        All <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-sm">{countByType.all}</span>
                    </button>

                    <button
                        onClick={() => setFilter('warnings')}
                        className={`px-6 py-3 rounded-full font-medium ${filter === 'warnings'
                            ? 'bg-white text-black shadow border border-gray-200'
                            : 'bg-white/70 text-gray-500'
                            }`}
                    >
                        Warnings <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-sm">{countByType.warnings}</span>
                    </button>

                    <button
                        onClick={() => setFilter('archive')}
                        className={`px-6 py-3 rounded-full font-medium ${filter === 'archive'
                            ? 'bg-white text-black shadow border border-gray-200'
                            : 'bg-white/70 text-gray-500'
                            }`}
                    >
                        Archive <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-sm">{countByType.archive}</span>
                    </button>
                </div>

                {/* Alerts List */}
                <div className="flex-1 overflow-auto pb-24 max-h-[75vh]" >
                    {filteredAlerts.length > 0 ? (
                        filteredAlerts.map(alert => (
                            <div key={alert.id} className="bg-white rounded-lg p-3 shadow-sm overflow-hidden mb-3">
                                <div className="flex items-start">
                                    <div className="mr-2">
                                        {getAlertTypeIcon(alert.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-red-500 font-medium">
                                            {getAlertTypeText(alert.type)}
                                        </div>
                                    </div>


                                    {!alert.isArchived && (
                                        <button
                                            onClick={() => handleArchiveAlert(alert.id)}
                                            className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <EyeOff size={20} color='blue'/>
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <div className="text-xl">
                                        Floor {alert.floor}
                                    </div>
                                    <div className="text-gray-500">
                                        {formatAlertTime(alert.timestamp)}
                                    </div>
                                </div>

                                {/* Worker Card */}
                                {alert.workerId && (
                                    <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center">
                                        <div className="bg-orange-100 rounded-full p-2 mr-3">
                                            <svg viewBox="0 0 40 40" className="h-5 w-5">
                                                <g transform="translate(0, -10)">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.974 34.761H33.763C34.816 34.761 35.154 33.341 34.212 32.868L31.565 31.535C31.167 27.61 28.405 19.761 20.536 19.761C10.7 19.761 8.613 28.825 8.613 30.761C7.708 30.761 6.974 31.495 6.974 32.4V32.761C6.974 33.865 7.869 34.761 8.974 34.761ZM18.608 25.436C18.596 25.441 18.589 25.445 18.586 25.446C17.964 25.74 17.222 25.476 16.925 24.856C16.627 24.233 16.89 23.487 17.512 23.188L18.052 24.316C17.512 23.188 17.513 23.188 17.514 23.188L17.515 23.187L17.518 23.186L17.526 23.182L17.548 23.172C17.566 23.164 17.588 23.154 17.616 23.142C17.671 23.118 17.745 23.087 17.839 23.051C18.025 22.98 18.285 22.89 18.607 22.805C19.246 22.634 20.147 22.475 21.186 22.527C23.333 22.637 25.916 23.651 27.909 26.894C28.271 27.482 28.087 28.252 27.499 28.613C26.911 28.975 26.141 28.791 25.779 28.203C24.239 25.696 22.425 25.094 21.059 25.024C20.343 24.988 19.708 25.098 19.251 25.22C19.024 25.281 18.847 25.342 18.731 25.386C18.674 25.408 18.632 25.426 18.608 25.436Z" fill="orange" />
                                                </g>
                                            </svg>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="font-medium">{getWorkerName(alert.workerId)}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Equipment Card */}
                                {alert.equipmentId && (
                                    <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center">
                                        <div className="bg-green-100 rounded-full p-2 mr-3">
                                            <svg viewBox="0 0 30 30" className="h-5 w-5">
                                                <g transform="translate(0, -1)">
                                                    <g transform="matrix(0.09262, 0, 0, 0.091869, -0.376461, 0.038726)">
                                                        <path d="M352.203,286.132l-78.933-78.933c-3.578-3.578-8.35-5.548-13.436-5.548c-2.151,0-4.238,0.373-6.21,1.05l-18.929-18.929 c-2.825-2.826-6.593-4.382-10.607-4.382c-4.014,0-7.781,1.556-10.606,4.381l-4.978,4.978l-8.904-8.904l38.965-39.17 c9.105,3.949,19.001,5.837,29.224,5.837c0.002,0,0.004,0,0.007,0c19.618,0,38.064-7.437,51.939-21.312 c18.59-18.588,25.842-45.811,18.926-71.207c-0.859-3.159-3.825-5.401-7.053-5.401c-1.389,0-3.453,0.435-5.39,2.372 c-0.265,0.262-26.512,26.322-35.186,34.996c-0.955,0.955-2.531,1.104-3.45,1.104c-0.659,0-1.022-0.069-1.022-0.069v0.002 l-0.593-0.068c-10.782-0.99-23.716-2.984-26.98-4.489c-1.556-3.289-3.427-16.533-4.427-27.489v-0.147l-0.234-0.308 c-0.058-0.485-0.31-2.958,1.863-5.131c9.028-9.029,33.847-34.072,34.083-34.311c2.1-2.099,2.9-4.739,2.232-7.245 c-0.801-3.004-3.355-4.686-5.469-5.257C280.772,0.859,274.292,0,267.788,0c-19.62,0-38.068,7.64-51.941,21.512 c-21.901,21.901-27.036,54.296-15.446,81.141l-38.996,38.995L94.682,74.927c-0.041-0.041-0.086-0.075-0.128-0.115 c0.63-2.567,0.907-5.233,0.791-7.947c-0.329-7.73-3.723-15.2-9.558-21.034L62.041,22.083c-0.519-0.519-3.318-3.109-7.465-3.109 c-1.926,0-4.803,0.583-7.58,3.359L20.971,48.359c-3.021,3.021-4.098,6.903-2.954,10.652c0.767,2.512,2.258,4.139,2.697,4.578 l23.658,23.658c6.179,6.179,14.084,9.582,22.259,9.582c0,0,0,0,0.001,0c2.287,0,4.539-0.281,6.721-0.818 c0.041,0.042,0.075,0.087,0.116,0.128l66.722,66.722l-31.692,31.692c-1.428,1.428-2.669,2.991-3.726,4.654 c-9.281-4.133-19.404-6.327-29.869-6.327c-19.623,0-38.071,7.642-51.946,21.517c-18.589,18.589-25.841,45.914-18.926,71.31 c0.859,3.158,3.825,5.451,7.052,5.451c0,0,0,0,0.001,0c1.389,0,3.453-0.41,5.39-2.347c0.265-0.262,26.513-26.309,35.187-34.983 c0.955-0.955,2.639-1.097,3.557-1.097c0.66,0,1.125,0.072,1.132,0.072h-0.001l0.487,0.069c10.779,0.988,23.813,2.982,27.078,4.489 c1.556,3.29,3.575,16.534,4.554,27.49l0.07,0.501c0.006,0.026,0.362,2.771-1.952,5.086c-9.029,9.029-33.888,34.072-34.124,34.311 c-2.1,2.099-2.92,4.74-2.252,7.245c0.802,3.004,3.346,4.685,5.459,5.256c6.264,1.694,12.738,2.553,19.243,2.553 c19.621,0,38.066-7.64,51.938-21.512c13.876-13.875,21.518-32.324,21.517-51.947c0-10.465-2.193-20.586-6.326-29.868 c1.664-1.057,3.227-2.298,4.654-3.726l31.693-31.693l8.904,8.904l-4.979,4.979c-2.826,2.825-4.382,6.592-4.382,10.606 c0,4.015,1.556,7.782,4.382,10.607l18.929,18.929c-0.677,1.972-1.05,4.059-1.05,6.209c0,5.086,1.971,9.857,5.549,13.435 l78.934,78.934c3.577,3.577,8.349,5.548,13.435,5.548c5.086,0,9.857-1.971,13.435-5.548l40.659-40.66 c3.578-3.578,5.549-8.349,5.549-13.435C357.752,294.482,355.782,289.71,352.203,286.132z" fill="green" />
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{getEquipmentName(alert.equipmentId)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                            No alerts found for the selected filter.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AlertsPage;