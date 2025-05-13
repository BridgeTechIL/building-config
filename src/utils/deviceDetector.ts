// src/utils/deviceDetector.ts
export const isMobileDevice = (): boolean => {
    console.log('***** Device detection started');
    if (typeof window === 'undefined') return false;

    // Check for mobile user agent
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Regular expression for mobile devices
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    // Check screen width as a fallback (anything less than 768px is considered mobile)
    const isMobileByUserAgent = mobileRegex.test(userAgent);
    const isMobileByWidth = window.innerWidth < 768;
    const result = isMobileByUserAgent || isMobileByWidth;

    console.log('Device detection:', {
        userAgent,
        width: window.innerWidth,
        isMobileByUserAgent,
        isMobileByWidth,
        isMobile: result
    });

    return result;
};