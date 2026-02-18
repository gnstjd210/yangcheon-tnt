"use client";

import { useState } from "react";
import { updateLocation } from "@/app/actions/misc_about";

interface Location {
    id: string;
    title: string;
    address: string;
    lat: number;
    lng: number;
    content: string | null;
}

export default function LocationManager({ initialLocation }: { initialLocation: Location | null }) {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(initialLocation?.title || "양천 TNT 스포츠 아카데미");
    const [address, setAddress] = useState(initialLocation?.address || "서울시 강서구 곰달래로 59길 60");
    const [lat, setLat] = useState(initialLocation?.lat || 37.5311);
    const [lng, setLng] = useState(initialLocation?.lng || 126.8486);
    const [content, setContent] = useState(initialLocation?.content || "대일고등학교 건너편 3층");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        if (initialLocation?.id) formData.append("id", initialLocation.id);
        formData.append("title", title);
        formData.append("address", address);
        formData.append("lat", lat.toString());
        formData.append("lng", lng.toString());
        formData.append("content", content);

        try {
            await updateLocation(formData);
            alert("저장되었습니다.");
        } catch (error) {
            console.error("Failed to save location", error);
            alert("Error saving location");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-navy-900">오시는 길 관리</h1>
                <p className="text-gray-500 mt-2">지도에 표시될 위치 정보와 주소를 관리합니다.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">장소명</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">주소 (도로명/지번)</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">위도 (Latitude)</label>
                            <input
                                type="number"
                                step="any"
                                value={lat}
                                onChange={(e) => setLat(parseFloat(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">경도 (Longitude)</label>
                            <input
                                type="number"
                                step="any"
                                value={lng}
                                onChange={(e) => setLng(parseFloat(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                required
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 -mt-2">
                        * 네이버 지도 등에서 해당 위치의 좌표를 확인하여 입력하세요.
                    </p>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">상세 설명</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 min-h-[100px]"
                            placeholder="찾아오시는 길에 대한 추가 설명"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 rounded-lg bg-navy-900 text-white font-bold hover:bg-sky-600 transition disabled:opacity-50"
                        >
                            {isLoading ? "저장 중..." : "설정 저장하기"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
