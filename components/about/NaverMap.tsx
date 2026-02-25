"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

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
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID || '46ybnu6qg3';

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
    useEffect(() => {
        if (window.naver?.maps) {
            initMap();
        }
    }, [lat, lng]);

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`}
                onReady={initMap}
                onLoad={initMap}
            />
            {/* 고정 높이 500px 설정 */}
            <div
                id="map"
                ref={mapElement}
                style={{ width: '100%', height: '500px' }}
                className="bg-gray-100 rounded-2xl" // map loading placeholder
            />
        </>
    );
}
