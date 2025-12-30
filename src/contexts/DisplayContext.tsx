import React, { createContext, useContext, useEffect, useState } from 'react';

type ZoomLevel = 90 | 100 | 110 | 125 | 150;

interface DisplayContextType {
    zoomLevel: number;
    setZoomLevel: (level: number) => void;
    increaseZoom: () => void;
    decreaseZoom: () => void;
    resetZoom: () => void;
}

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

const ZOOM_LEVELS: ZoomLevel[] = [90, 100, 110, 125, 150];

export function DisplayProvider({ children }: { children: React.ReactNode }) {
    const [zoomLevel, setZoomLevelState] = useState<number>(() => {
        const saved = localStorage.getItem('delphi-zoom-level');
        const parsed = saved ? parseInt(saved, 10) : 100;
        // Validate parsed value is within acceptable range, otherwise reset
        return [90, 100, 110, 125, 150].includes(parsed) ? parsed : 100;
    });

    useEffect(() => {
        document.documentElement.style.fontSize = `${(zoomLevel / 100) * 16}px`;
        localStorage.setItem('delphi-zoom-level', zoomLevel.toString());
    }, [zoomLevel]);

    const setZoomLevel = (level: number) => {
        // Clamp to supported levels or nearest
        setZoomLevelState(level);
    };

    const increaseZoom = () => {
        const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel as ZoomLevel);
        if (currentIndex < ZOOM_LEVELS.length - 1) {
            setZoomLevel(ZOOM_LEVELS[currentIndex + 1]);
        } else if (currentIndex === -1) {
            // If weird value, reset to 100 or find nearest
            setZoomLevel(110);
        }
    };

    const decreaseZoom = () => {
        const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel as ZoomLevel);
        if (currentIndex > 0) {
            setZoomLevel(ZOOM_LEVELS[currentIndex - 1]);
        } else if (currentIndex === -1) {
            setZoomLevel(90);
        }
    };

    const resetZoom = () => setZoomLevel(100);

    return (
        <DisplayContext.Provider value={{ zoomLevel, setZoomLevel, increaseZoom, decreaseZoom, resetZoom }}>
            {children}
        </DisplayContext.Provider>
    );
}

export function useDisplay() {
    const context = useContext(DisplayContext);
    if (context === undefined) {
        throw new Error('useDisplay must be used within a DisplayProvider');
    }
    return context;
}
