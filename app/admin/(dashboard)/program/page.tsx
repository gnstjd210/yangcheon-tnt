"use client";

import { useState, useEffect } from "react";
import { getProgramData, upsertProgramData } from "@/app/actions/program";
import ImageUpload from "@/components/admin/ImageUpload";
import { Camera, Save, Loader2, Info } from "lucide-react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">에디터 로딩중...</div>
});

const PROGRAMS = [
    {
        id: "youth",
        title: "아카데미 소개 (Youth)",
        path: "/program/youth/intro",
        ratio: 4 / 3,
        ratioText: "4:3",
        desc: "유소년 아카데미 본문 이미지 1개 및 텍스트를 관리합니다."
    },
    {
        id: "adult",
        title: "성인 트레이닝 커리큘럼",
        path: "/program/adult/curriculum",
        ratio: 1, // 1:1 for the main circular hero image
        ratioText: "1:1 (본문 메인), 4:3 (하단 클래스 3종)",
        desc: "성인 커리큘럼 본문 원형 이미지 1개와 하단 3개의 클래스 사진, 및 텍스트를 관리합니다."
    },
    {
        id: "tntw",
        title: "TNT W 브랜드 소개",
        path: "/program/tntw/intro",
        ratio: 4 / 3,
        ratioText: "4:3",
        desc: "TNT W 본문 이미지 1개 및 텍스트를 관리합니다."
    },
    {
        id: "physical",
        title: "피지컬 트레이닝 프로그램 소개",
        path: "/program/physical/intro",
        ratio: 4 / 3,
        ratioText: "4:3",
        desc: "피지컬 트레이닝 본문 메인 이미지 1개 및 텍스트를 관리합니다."
    }
];

type ProgramDataState = {
    imageUrl: string;
    image2Url: string;
    image3Url: string;
    image4Url: string;
    title: string;
    subtitle: string;
    description: string;
};

export default function ProgramDataManager() {
    const [dataState, setDataState] = useState<Record<string, ProgramDataState>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData: Record<string, ProgramDataState> = {};
            for (const prog of PROGRAMS) {
                const data = await getProgramData(prog.path);
                fetchedData[prog.path] = {
                    imageUrl: data?.imageUrl || "",
                    image2Url: data?.image2Url || "",
                    image3Url: data?.image3Url || "",
                    image4Url: data?.image4Url || "",
                    title: data?.title || "",
                    subtitle: data?.subtitle || "",
                    description: data?.description || ""
                };
            }
            setDataState(fetchedData);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleChange = (path: string, field: keyof ProgramDataState, value: string) => {
        setDataState(prev => ({
            ...prev,
            [path]: {
                ...prev[path],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            for (const prog of PROGRAMS) {
                await upsertProgramData(prog.path, dataState[prog.path]);
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
                        프로그램 통합 관리
                    </h1>
                    <p className="text-gray-500 mt-2">각 프로그램 페이지의 메인 이미지와 텍스트(제목, 상세 설명)를 관리합니다.</p>
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

                        <div className="flex flex-col xl:flex-row gap-8">
                            {/* Left: Image Cropper */}
                            <div className="w-full xl:w-1/2">
                                <label className="block text-sm font-bold text-navy-900 mb-2">
                                    {prog.id === 'adult' ? '메인 이미지 (1:1)' : '메인 이미지'}
                                </label>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center items-center min-h-[300px] h-auto">
                                    <div
                                        className={`relative bg-gray-200 shadow-md w-full max-w-[400px] ${prog.id === 'adult' ? 'rounded-full aspect-square' : 'rounded-[24px] overflow-hidden'}`}
                                        style={prog.id !== 'adult' ? { aspectRatio: prog.ratio } : undefined}
                                    >
                                        <ImageUpload
                                            value={dataState[prog.path]?.imageUrl || ""}
                                            onChange={(url) => handleChange(prog.path, "imageUrl", url)}
                                            onRemove={() => handleChange(prog.path, "imageUrl", "")}
                                            aspectRatio={prog.ratio}
                                            isCircle={prog.id === 'adult'}
                                        />
                                    </div>
                                </div>

                                {prog.id === 'adult' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        <div>
                                            <label className="block text-xs font-bold text-navy-900 mb-2">하단 이미지 1 (남성)</label>
                                            <div className="relative bg-gray-200 rounded-xl overflow-hidden shadow-sm aspect-[4/3] w-full">
                                                <ImageUpload
                                                    value={dataState[prog.path]?.image2Url || ""}
                                                    onChange={(url) => handleChange(prog.path, "image2Url", url)}
                                                    onRemove={() => handleChange(prog.path, "image2Url", "")}
                                                    aspectRatio={4 / 3}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-navy-900 mb-2">하단 이미지 2 (여성)</label>
                                            <div className="relative bg-gray-200 rounded-xl overflow-hidden shadow-sm aspect-[4/3] w-full">
                                                <ImageUpload
                                                    value={dataState[prog.path]?.image3Url || ""}
                                                    onChange={(url) => handleChange(prog.path, "image3Url", url)}
                                                    onRemove={() => handleChange(prog.path, "image3Url", "")}
                                                    aspectRatio={4 / 3}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-navy-900 mb-2">하단 이미지 3 (혼성)</label>
                                            <div className="relative bg-gray-200 rounded-xl overflow-hidden shadow-sm aspect-[4/3] w-full">
                                                <ImageUpload
                                                    value={dataState[prog.path]?.image4Url || ""}
                                                    onChange={(url) => handleChange(prog.path, "image4Url", url)}
                                                    onRemove={() => handleChange(prog.path, "image4Url", "")}
                                                    aspectRatio={4 / 3}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right: Text Fields */}
                            <div className="w-full xl:w-1/2 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-navy-900 mb-2">본문 메인 제목 (Navy 적용)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="예: 실전 압박 상황에서도"
                                        value={dataState[prog.path]?.title || ""}
                                        onChange={(e) => handleChange(prog.path, "title", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-navy-900 mb-2">본문 포인트 제목 (Sky Blue 적용)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="예: 흔들리지 않는 개인 기량"
                                        value={dataState[prog.path]?.subtitle || ""}
                                        onChange={(e) => handleChange(prog.path, "subtitle", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-navy-900 mb-2">본문 상세 설명</label>
                                    <RichTextEditor
                                        value={dataState[prog.path]?.description || ""}
                                        onChange={(value) => handleChange(prog.path, "description", value)}
                                        placeholder="본문에 들어갈 상세 내용을 입력하세요."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
