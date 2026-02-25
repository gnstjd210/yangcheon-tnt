'use client';

import { useState, useEffect } from 'react';
import {
    getMainPageData,
    updateHeroImages,
    updateQuickMenu,
    updatePrograms,
} from '@/app/actions/mainPage';
import type {
    HeroImage,
    QuickMenu,
    ProgramPreview
} from '@/lib/mainPageConstants';
import { Save, Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function MainPageAdmin() {
    const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
    const [quickMenu, setQuickMenu] = useState<QuickMenu[]>([]);
    const [programs, setPrograms] = useState<ProgramPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const res = await getMainPageData();
            if (res.success && res.data) {
                setHeroImages(res.data.heroImages);
                setQuickMenu(res.data.quickMenu);
                setPrograms(res.data.programs);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                if (section === 'hero') {
                    const newHero = [...heroImages];
                    newHero[index].image = data.url;
                    setHeroImages(newHero);
                } else if (section === 'quick') {
                    const newQuick = [...quickMenu];
                    newQuick[index].image = data.url;
                    setQuickMenu(newQuick);
                } else if (section === 'program') {
                    const newProg = [...programs];
                    newProg[index].img = data.url;
                    setPrograms(newProg);
                }
            } else {
                alert('이미지 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        }
    };

    const handleSaveHero = async () => {
        setIsSaving(true);
        const res = await updateHeroImages(heroImages);
        setIsSaving(false);
        if (res.success) alert('히어로 배너가 저장되었습니다.');
        else alert('저장에 실패했습니다.');
    };

    const handleSaveQuick = async () => {
        setIsSaving(true);
        const res = await updateQuickMenu(quickMenu);
        setIsSaving(false);
        if (res.success) alert('퀵 메뉴 카테고리가 저장되었습니다.');
        else alert('저장에 실패했습니다.');
    };

    const handleSaveProgram = async () => {
        setIsSaving(true);
        const res = await updatePrograms(programs);
        setIsSaving(false);
        if (res.success) alert('프로그램 시스템이 저장되었습니다.');
        else alert('저장에 실패했습니다.');
    };

    if (isLoading) return <div>데이터를 불러오는 중입니다...</div>;

    return (
        <div className="space-y-12 pb-24">
            <h1 className="text-3xl font-black text-navy-900 mb-8">메인 페이지 관리</h1>

            {/* Section 1: Hero Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ImageIcon className="text-sky-500" />
                            메인 히어로 배너 관리 (최대 3개 권장)
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 pl-8">(권장: 21:9 비율, 1920x820px, 파일당 500KB 미만)</p>
                    </div>
                    <button
                        onClick={handleSaveHero}
                        disabled={isSaving}
                        className="px-4 py-2 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                    >
                        <Save size={18} />
                        {isSaving ? '저장 중...' : '변경사항 저장'}
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {heroImages.map((hero, idx) => (
                        <div key={idx} className="flex gap-6 p-4 border rounded-xl bg-gray-50 flex-col lg:flex-row">
                            <div className="relative w-full lg:w-1/3 aspect-video bg-gray-200 rounded-lg overflow-hidden group">
                                {hero.image && (
                                    <Image src={hero.image} alt={`Hero ${idx}`} fill className="object-cover" />
                                )}
                                <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                                    <Upload className="mb-2" />
                                    <span>이미지 변경</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero', idx)} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">제목 (개행은 \\n 활용)</label>
                                    <textarea
                                        value={hero.title}
                                        onChange={(e) => {
                                            const newHero = [...heroImages];
                                            newHero[idx].title = e.target.value;
                                            setHeroImages(newHero);
                                        }}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">부제목</label>
                                    <input
                                        type="text"
                                        value={hero.subtitle}
                                        onChange={(e) => {
                                            const newHero = [...heroImages];
                                            newHero[idx].subtitle = e.target.value;
                                            setHeroImages(newHero);
                                        }}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => setHeroImages(heroImages.filter((_, i) => i !== idx))}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => setHeroImages([...heroImages, { image: '', title: 'NEW TITLE', subtitle: 'New Subtitle' }])}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-bold"
                    >
                        <Plus />
                        배너 슬라이드 추가
                    </button>
                </div>
            </div>

            {/* Section 2: Quick Menu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ImageIcon className="text-sky-500" />
                            우측 4개 퀵 카테고리 관리
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 pl-8">(권장: 4:3 또는 1:1 비율, 600x450px, 파일당 500KB 미만)</p>
                    </div>
                    <button
                        onClick={handleSaveQuick}
                        disabled={isSaving}
                        className="px-4 py-2 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                    >
                        <Save size={18} />
                        저장
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quickMenu.map((item, idx) => (
                        <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-4">
                            <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden group">
                                {item.image && (
                                    <Image src={item.image} alt={item.label} fill className="object-cover" />
                                )}
                                <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                                    <Upload className="mb-1" size={20} />
                                    <span className="text-sm">배경 이미지 변경</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'quick', idx)} />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">라벨</label>
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => {
                                            const newArr = [...quickMenu];
                                            newArr[idx].label = e.target.value;
                                            setQuickMenu(newArr);
                                        }}
                                        className="w-full p-2 border rounded focus:ring-1 focus:ring-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">영문 부제</label>
                                    <input
                                        type="text"
                                        value={item.desc}
                                        onChange={(e) => {
                                            const newArr = [...quickMenu];
                                            newArr[idx].desc = e.target.value;
                                            setQuickMenu(newArr);
                                        }}
                                        className="w-full p-2 border rounded focus:ring-1 focus:ring-sky-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">연결 링크 URL</label>
                                <input
                                    type="text"
                                    value={item.href}
                                    onChange={(e) => {
                                        const newArr = [...quickMenu];
                                        newArr[idx].href = e.target.value;
                                        setQuickMenu(newArr);
                                    }}
                                    className="w-full p-2 border rounded focus:ring-1 focus:ring-sky-500 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 3: TNT Training System */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ImageIcon className="text-sky-500" />
                            TNT Training System (4가지) 관리
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 pl-8">(권장: 1:1 비율, 400x400px, 파일당 500KB 미만)</p>
                    </div>
                    <button
                        onClick={handleSaveProgram}
                        disabled={isSaving}
                        className="px-4 py-2 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                    >
                        <Save size={18} />
                        저장
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {programs.map((item, idx) => (
                        <div key={idx} className="p-4 border rounded-xl bg-gray-50 space-y-4">
                            <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden group">
                                {item.img && (
                                    <Image src={item.img} alt={item.title} fill className="object-cover" />
                                )}
                                <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                                    <Upload className="mb-1" size={20} />
                                    <span className="text-sm">카드 이미지 변경</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'program', idx)} />
                                </label>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">프로그램명</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => {
                                            const newArr = [...programs];
                                            newArr[idx].title = e.target.value;
                                            setPrograms(newArr);
                                        }}
                                        className="w-full p-2 border rounded focus:ring-1 focus:ring-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">설명(영문)</label>
                                    <input
                                        type="text"
                                        value={item.desc}
                                        onChange={(e) => {
                                            const newArr = [...programs];
                                            newArr[idx].desc = e.target.value;
                                            setPrograms(newArr);
                                        }}
                                        className="w-full p-2 border rounded focus:ring-1 focus:ring-sky-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">연결 링크</label>
                                    <input
                                        type="text"
                                        value={item.href}
                                        onChange={(e) => {
                                            const newArr = [...programs];
                                            newArr[idx].href = e.target.value;
                                            setPrograms(newArr);
                                        }}
                                        className="w-full p-2 border rounded focus:ring-1 focus:ring-sky-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
