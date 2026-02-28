"use client";

import { useState, useEffect } from "react";
import { getProgramImage, upsertProgramImage } from "@/app/actions/program";
import ImageUpload from "@/components/admin/ImageUpload";
import { Camera, Save, Loader2, Info } from "lucide-react";

const PROGRAMS = [
    {
        id: "youth",
        title: "아카데미 소개 (Youth)",
        path: "/program/youth/intro",
        ratio: 21 / 9,
        ratioText: "21:9",
        desc: "유소년 아카데미 메인 배너 이미지입니다. (와이드 비율)"
    },
    {
        id: "adult",
        title: "성인 트레이닝 커리큘럼",
        path: "/program/adult/curriculum",
        ratio: 4 / 3,
        ratioText: "4:3",
        desc: "성인 커리큘럼 메인 인포그래픽/설명 이미지입니다."
    },
    {
        id: "tntw",
        title: "TNT W 브랜드 소개",
        path: "/program/tntw/intro",
        ratio: 16 / 9,
        ratioText: "16:9",
        desc: "TNT W 여성팀 소개 메인 뷰 이미지입니다. (시네마틱 비율)"
    }
];

export default function ProgramImageManager() {
    const [images, setImages] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            const fetchedImages: Record<string, string> = {};
            for (const prog of PROGRAMS) {
                const url = await getProgramImage(prog.path);
                if (url) {
                    fetchedImages[prog.path] = url;
                }
            }
            setImages(fetchedImages);
            setIsLoading(false);
        };
        fetchImages();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            for (const prog of PROGRAMS) {
                const currentUrl = images[prog.path] || "";
                await upsertProgramImage(prog.path, currentUrl);
            }
            alert("저장되었습니다.");
        } catch (error) {
            console.error(error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-navy-900 flex items-center gap-3">
                        <Camera size={32} className="text-sky-500" />
                        프로그램 이미지 관리
                    </h1>
                    <p className="text-gray-500 mt-2">각 프로그램 페이지의 메인 이미지를 독립적인 비율로 관리합니다.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-navy-800 transition shadow-lg disabled:opacity-50"
                >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {isSaving ? "저장 중..." : "변경사항 저장"}
                </button>
            </div>

            <div className="space-y-12">
                {PROGRAMS.map((prog) => (
                    <div key={prog.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-sky-500 rounded-full inline-block"></span>
                                    {prog.title}
                                </h2>
                                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                                    <Info size={14} />
                                    {prog.desc} (적용 경로: <code className="bg-gray-100 px-1 rounded text-red-500">{prog.path}</code>)
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                <span className="text-xs font-bold text-gray-500">필수 비율:</span>
                                <span className="text-sm font-black text-navy-900">{prog.ratioText}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex justify-center">
                            {/* The container size adjusts based on aspect ratio to look reasonable in admin */}
                            <div
                                className="relative bg-gray-200 rounded-[24px] overflow-hidden shadow-md"
                                style={{
                                    width: '100%',
                                    maxWidth: prog.ratio > 1.5 ? '800px' : '500px',
                                    aspectRatio: prog.ratio
                                }}
                            >
                                <ImageUpload
                                    value={images[prog.path] || ""}
                                    onChange={(url) => setImages(prev => ({ ...prev, [prog.path]: url }))}
                                    onRemove={() => setImages(prev => ({ ...prev, [prog.path]: "" }))}
                                    aspectRatio={prog.ratio}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
