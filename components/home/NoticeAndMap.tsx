'use client';

import { MapPin, ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';

const NOTICES = [
    { id: 1, type: '공지', title: '3월 신규 회원 모집 안내', date: '2026.02.14' },
    { id: 2, type: '소식', title: '주말 유소년 리그전 경기 결과', date: '2026.02.10' },
    { id: 3, type: '안내', title: '설 연휴 휴관 안내', date: '2026.02.01' },
];

export default function NoticeAndMap() {
    return (
        <section className="py-12 bg-white border-b border-gray-100">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                {/* LEFT: NOTICE BOARD */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-3xl font-black text-navy-900 tracking-tight">공지사항</h3>
                        <Link href="/support/notice" className="group flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-sky-500 transition-colors">
                            더보기 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="bg-gray-50 rounded-[24px] p-8 border border-gray-100 shadow-sm flex flex-col gap-4 h-full min-h-[300px]">
                        {NOTICES.map((notice) => (
                            <Link
                                key={notice.id}
                                href={`/support/notice/${notice.id}`}
                                className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100/50 hover:border-sky-100 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <span className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-bold ${notice.type === '공지' ? 'bg-navy-900 text-white' : 'bg-sky-100 text-sky-600'}`}>
                                        {notice.type}
                                    </span>
                                    <span className="text-navy-900 font-bold truncate group-hover:text-sky-600 transition-colors">
                                        {notice.title}
                                    </span>
                                </div>
                                <span className="shrink-0 text-xs text-gray-400 font-medium md:flex items-center gap-1 hidden">
                                    <Calendar size={12} />
                                    {notice.date}
                                </span>
                            </Link>
                        ))}

                        {/* Empty State / More placeholder if needed */}
                        <div className="flex-1 flex items-center justify-center text-gray-300 text-xs mt-4">
                            양천 TNT 스포츠 아카데미의 새로운 소식을 확인하세요.
                        </div>
                    </div>
                </div>

                {/* RIGHT: MAP / LOCATION */}
                <div className="flex flex-col">
                    <h3 className="text-3xl font-black text-navy-900 tracking-tight mb-8">오시는 길</h3>

                    <div className="relative w-full h-[300px] lg:h-full min-h-[300px] rounded-[24px] overflow-hidden shadow-sm group border border-gray-100">
                        {/* Map Image - Using the generated artifact path or absolute path if copied */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('/Users/hunsung/.gemini/antigravity/brain/d41bd4de-5918-4d41-a3c5-3b978687b8b3/map_illustration_cute_1771077645063.png')" }}
                        />

                        {/* Address Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-white/95 backdrop-blur-sm border-t border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-navy-900 text-lg">양천 TNT 스포츠 아카데미</h4>
                                    <p className="text-gray-500 text-sm mt-1">서울시 강서구 곰달래로 59길 60, 2~3층</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
