"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        naver: any;
    }
}

interface NaverMapProps {
    lat: number;
    lng: number;
}

export default function NaverMap({ lat, lng }: NaverMapProps) {
    const mapElement = useRef<HTMLDivElement>(null);

    // This function will be called when the script loads
    const initMap = () => {
        if (!mapElement.current || !window.naver?.maps) return;

        const location = new window.naver.maps.LatLng(lat, lng);
        const mapOptions = {
            center: location,
            zoom: 17,
        };

        const map = new window.naver.maps.Map(mapElement.current, mapOptions);

        new window.naver.maps.Marker({
            position: location,
            map: map,
        });
    };

    // Keep map updated if lat/lng change after load
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // Since the script is in layout <head>, naver maps should be available.
        // If not, we could poll, but it's synchronous so it should be there.
        if (window.naver?.maps) {
            initMap();
        } else {
            const timer = setInterval(() => {
                if (window.naver?.maps) {
                    initMap();
                    clearInterval(timer);
                }
            }, 100);
            return () => clearInterval(timer);
        }
    }, [lat, lng]);

    return (
        <div
            id="map"
            ref={mapElement}
            style={{ width: '100%', height: '500px' }}
            className="bg-gray-100 rounded-2xl" // map loading placeholder
        />
    );
}
