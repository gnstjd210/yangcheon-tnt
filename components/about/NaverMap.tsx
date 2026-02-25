'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        naver: any;
    }
}

export default function NaverMap({ lat, lng }: { lat: number; lng: number }) {
    const mapRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapInstance = useRef<any>(null);

    const initMap = () => {
        // 1. 네이버 객체가 로드되었는지 확인 (포럼 권장사항)
        if (typeof window === 'undefined' || !window.naver || !window.naver.maps) return;

        if (mapRef.current && !mapInstance.current) {
            const location = new window.naver.maps.LatLng(lat, lng);

            const mapOptions = {
                center: location,
                zoom: 16,
                minZoom: 10,
            };

            // 2. 지도 생성
            mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);

            // 3. 마커 추가
            new window.naver.maps.Marker({
                position: location,
                map: mapInstance.current,
            });
        }
    };

    return (
        <>
            {/* 4. 스크립트 호출 - 포럼에서 강조한 ncpClientId 파라미터 사용 */}
            <Script
                strategy="afterInteractive"
                src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=46ybnu6qg3"
                onLoad={initMap}
            />
            <div
                ref={mapRef}
                id="map"
                style={{ width: '100%', height: '500px' }} // 높이 500px 강제 지정
                className="rounded-2xl shadow-inner bg-gray-100"
            />
        </>
    );
}
