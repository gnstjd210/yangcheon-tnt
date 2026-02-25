"use client";

import dynamic from "next/dynamic";

const NaverMap = dynamic(() => import("@/components/about/NaverMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full min-h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">지도 로딩 중...</div>
});

interface NaverMapWrapperProps {
    lat: number;
    lng: number;
}

export default function NaverMapWrapper({ lat, lng }: NaverMapWrapperProps) {
    return <NaverMap lat={lat} lng={lng} />;
}
