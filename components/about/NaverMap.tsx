"use client";

import { NavermapsProvider, Container as MapDiv, NaverMap as NaverMapElement, Marker } from 'react-naver-maps';

interface NaverMapProps {
    lat: number;
    lng: number;
}

export default function NaverMap({ lat, lng }: NaverMapProps) {
    return (
        <NavermapsProvider ncpClientId="46ybnu6qg3">
            <MapDiv
                style={{
                    width: '100%',
                    height: '500px'
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
