"use client";

import { NavermapsProvider, Container as MapDiv, NaverMap as NaverMapElement, Marker } from 'react-naver-maps';

interface NaverMapProps {
    lat: number;
    lng: number;
}

export default function NaverMap({ lat, lng }: NaverMapProps) {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID || '46ybnu6qg3';

    return (
        <NavermapsProvider ncpClientId={clientId}>
            <MapDiv
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '400px'
                }}
            >
                <NaverMapElement
                    defaultCenter={{ lat: lat, lng: lng }}
                    defaultZoom={17}
                >
                    <Marker position={{ lat: lat, lng: lng }} />
                </NaverMapElement>
            </MapDiv>
        </NavermapsProvider>
    );
}
