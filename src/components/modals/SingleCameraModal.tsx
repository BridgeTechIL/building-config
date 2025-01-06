import React from 'react';
import { X } from 'lucide-react';

interface SingleCameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    videoUrl: string;
}

const SingleCameraModal = ({ isOpen, onClose, title, videoUrl }: SingleCameraModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-[90vw]">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-500">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative w-full flex justify-center">
                        <video
                            controls
                            autoPlay
                            className="w-full max-h-[394px] bg-gray-100 rounded-lg"
                            playsInline
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleCameraModal;