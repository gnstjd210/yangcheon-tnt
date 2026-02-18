'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_MENU = [
    { label: '아카데미 소개', href: '/about' },
    { label: '유소년 아카데미', href: '/program/youth' },
    { label: '성인 그룹 레슨', href: '/program/adult' },
    { label: '피지컬 트레이닝', href: '/program/physical' },
    { label: 'TNT W', href: '/program/tntw' },
    { label: '커뮤니티', href: '/community' },
];

export default function Footer() {
    return (
        <footer className="bg-navy-900 text-white pt-16 pb-12 border-t border-gray-800">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row justify-between gap-12 text-sm text-gray-400">

                {/* LEFT: Business Info & Legal */}
                <div className="flex-1 space-y-8">
                    {/* Legal Links */}
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-300">
                        <Link href="#" className="hover:text-white transition-colors">개인정보처리방침</Link>
                        <div className="w-[1px] h-3 bg-gray-600 my-auto" />
                        <Link href="#" className="hover:text-white transition-colors">이용약관</Link>
                        <div className="w-[1px] h-3 bg-gray-600 my-auto" />
                        <Link href="#" className="hover:text-white transition-colors">이메일무단수집거부</Link>
                    </div>

                    {/* Business Info Block */}
                    <div className="space-y-3 leading-relaxed font-light">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <span className="font-bold text-white">티앤티스포츠아카데미</span>
                            <span className="hidden sm:inline text-gray-700">|</span>
                            <span>사업자등록번호: 873-93-01637</span>
                            <span className="hidden sm:inline text-gray-700">|</span>
                            <span>대표자: 김훈성</span>
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-sky-500" />
                            <span>서울시 강서구 곰달래로 59길 60 2,3층 양천TNT스포츠아카데미</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Mail size={16} className="shrink-0 text-sky-500" />
                            <a href="mailto:tnt.sports.academy1@gmail.com" className="hover:text-white transition-colors">tnt.sports.academy1@gmail.com</a>
                            <span className="text-gray-700">/</span>
                            <a href="mailto:gnstjd321@naver.com" className="hover:text-white transition-colors">gnstjd321@naver.com</a>
                        </div>

                        <div className="flex items-center gap-2">
                            <Phone size={16} className="shrink-0 text-sky-500" />
                            <span>010-2429-9591</span>
                            <span className="text-gray-700">/</span>
                            <span>010-2332-2341</span>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs text-gray-600 font-mono pt-4">
                        © 2026 YANGCHEON TNT SPORTS ACADEMY. ALL RIGHTS RESERVED.
                    </div>
                </div>

                {/* RIGHT: Menu & Text Logo */}
                <div className="flex flex-col items-end gap-8">
                    {/* Small Vertical Menu */}
                    <div className="flex gap-4 sm:gap-6 text-xs font-bold text-gray-500">
                        {FOOTER_MENU.map((item) => (
                            <Link key={item.label} href={item.href} className="hover:text-sky-500 transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* TSA Text Logo (Ascend Style) */}
                    <div className="flex flex-col items-end">
                        <h2 className="text-4xl font-black text-white tracking-widest italic" style={{ fontFamily: 'Georgia, serif' }}>
                            TSA
                        </h2>
                        <span className="text-sky-600 font-bold text-[10px] tracking-[0.3em]">
                            SINCE 2016
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
