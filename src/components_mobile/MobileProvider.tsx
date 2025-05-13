import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isMobileDevice } from '@/utils/deviceDetector';

// Create a context for mobile state
interface MobileContextType {
    isMobile: boolean;
    forceDesktopView: boolean;
    toggleDesktopView: () => void;
}

const MobileContext = createContext<MobileContextType>({
    isMobile: false,
    forceDesktopView: false,
    toggleDesktopView: () => { }
});

// Custom hook to use the mobile context
export const useMobile = () => useContext(MobileContext);

interface MobileProviderProps {
    children: ReactNode;
}


export default function MobileProvider({ children }: MobileProviderProps) {
    // Initial state based on server-side rendering safe check
    const [isMobile, setIsMobile] = useState(false);
    const [forceDesktopView, setForceDesktopView] = useState(false);

    // Effect to update state based on client-side detection
    useEffect(() => {
        // Check if it's a mobile device
        const mobileDetected = isMobileDevice();
        console.log('MobileProvider initial detection:', mobileDetected);
        setIsMobile(mobileDetected);

        // Add resize listener to update mobile state if window is resized
        const handleResize = () => {
            const newMobileDetected = isMobileDevice();
            console.log('Window resized, mobile detection:', newMobileDetected);
            setIsMobile(newMobileDetected);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Log whenever the values change
    useEffect(() => {
        console.log('MobileProvider state updated:', { isMobile, forceDesktopView });
    }, [isMobile, forceDesktopView]);

    // Function to toggle desktop view on mobile devices
    const toggleDesktopView = () => {
        setForceDesktopView(prevState => !prevState);
    };

    // Context value
    const value = {
        isMobile,
        forceDesktopView,
        toggleDesktopView
    };

    return (
        <MobileContext.Provider value={value}>
            {children}
        </MobileContext.Provider>
    );
}