'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, AlignJustify, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import TrialClassModal from '@/components/home/TrialClassModal';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import NextImage from 'next/image';

// Detailed Sub-menu Structure
const MENU_STRUCTURE = [
    {
        label: 'TSA 소개',
        href: '/about/greeting',
        subItems: [
            { label: '인사말', href: '/about/greeting' },
            { label: '코치진', href: '/about/coach' },
            { label: '시설소개', href: '/about/facility' },
            { label: '오시는길', href: '/about/location' },
            { label: '월간 시간표', href: '/about/schedule' },
            { label: '셔틀안내', href: '/about/shuttle' }
        ]
    },
    {
        label: '유소년 아카데미',
        href: '/program/youth/intro',
        subItems: [
            { label: '입단신청', href: '/program/youth/join' },
            { label: '아카데미소개', href: '/program/youth/intro' },
            { label: '갤러리', href: '/program/youth/gallery' }
        ]
    },
    {
        label: '성인 트레이닝',
        href: '/program/adult/curriculum',
        subItems: [
            { label: '입단신청', href: '/program/adult/join' },
            { label: '커리큘럼', href: '/program/adult/curriculum' },
            { label: '갤러리', href: '/program/adult/gallery' }
        ]
    },
    {
        label: 'TNT W 등록',
        href: '/program/tntw/intro',
        subItems: [
            { label: '입단신청', href: '/program/tntw/join' },
            { label: 'TNT W 소개', href: '/program/tntw/intro' },
            { label: '갤러리', href: '/program/tntw/gallery' }
        ]
    },
    {
        label: '커뮤니티',
        href: '/community/reviews',
        subItems: [
            { label: '레슨후기', href: '/community/reviews' },
            { label: '자유게시판', href: '/community/freeboard' }
        ]
    },
    {
        label: '고객지원',
        href: '/support/notice',
        subItems: [
            { label: '공지사항', href: '/support/notice' },
            { label: 'FAQ', href: '/support/faq' },
            { label: '문의', href: '/support/contact' }
        ]
    },
];

const UTILITY_ITEMS = [
    { label: '로그인', href: '/login' },
    { label: '회원가입', href: '/join' },
    { label: '체험수업신청', href: '/trial' },
    { label: '상담신청', href: '/consult' },
];

const SEARCH_DATA = [
    { label: '유소년 입단신청', href: '/program/youth/join', keywords: ['입단', '유소년', '가입', '신청'] },
    { label: '성인 트레이닝 입단신청', href: '/program/adult/join', keywords: ['입단', '성인', '가입', '신청'] },
    { label: 'TNT W 입단신청', href: '/program/tntw/join', keywords: ['입단', '여자', '여성', 'tnt w', '가입', '축구', '풋살'] },
    { label: '레슨 후기', href: '/community/reviews', keywords: ['레슨', '후기', '리뷰', '반응'] },
    { label: '성인 클래스 커리큘럼', href: '/program/adult/curriculum', keywords: ['레슨', '커리큘럼', '교육', '훈련'] },
    { label: '월간 시간표', href: '/about/schedule', keywords: ['시간표', '일정', '스케줄', '수업'] },
    { label: '오시는길', href: '/about/location', keywords: ['오시는길', '위치', '지도', '주소', '찾아오는'] },
    { label: '시설소개', href: '/about/facility', keywords: ['시설', '구장', '환경', '운동장'] },
    { label: '코치진 소개', href: '/about/coach', keywords: ['코치', '감독', '스태프', '선생님'] },
    { label: '자주 묻는 질문', href: '/support/faq', keywords: ['질문', 'faq', '문의', '궁금'] },
    { label: '공지사항', href: '/support/notice', keywords: ['공지', '소식', '안내'] },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<typeof SEARCH_DATA>([]);

    // Refs for Outside Click
    const searchRef = useRef<HTMLDivElement>(null);
    const searchButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    useOutsideClick(searchRef, closeSearch, [searchButtonRef]);
    useOutsideClick(menuRef, () => setIsDropdownOpen(false), [menuButtonRef]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const filtered = SEARCH_DATA.filter(item =>
            item.label.includes(query) ||
            item.keywords.some(k => k.includes(query))
        );
        setSearchResults(filtered);
    };

    const handleSearchResultClick = () => {
        closeSearch();
    };

    return (
        <header
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled ? 'bg-white/95 backdrop-blur-md h-20' : 'bg-transparent h-28'
            )}
        >
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 h-full flex items-center justify-between relative">

                {/* LEFT: Logo & Main Menu (Fixed Left Alignment) */}
                <div className="flex items-center gap-12 lg:gap-16">

                    {/* Logo: TSA */}
                    <Link href="/" className="relative group shrink-0">
                        <div className={clsx(
                            "flex items-center justify-center transition-all duration-300",
                            isScrolled ? "scale-90" : "scale-100"
                        )}>
                            <div className="relative w-[60px] h-[60px] md:w-[70px] md:h-[70px]">
                                <NextImage
                                    src="/logo.png"
                                    alt="TSA Emblem"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Main Menu (Desktop Row) */}
                    <nav className="hidden xl:flex items-center gap-8">
                        {MENU_STRUCTURE.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group py-2"
                            >
                                <span className={clsx(
                                    "text-navy-900 font-bold tracking-tight group-hover:text-sky-500 transition-all duration-300 block",
                                    isScrolled ? "text-[16px]" : "text-[18px]"
                                )}>
                                    {item.label}
                                </span>
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* RIGHT: Utility Buttons & Icons */}
                <div className="flex items-center gap-3">
                    {UTILITY_ITEMS.map((item) => {
                        if (item.href === '/trial') {
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => setIsTrialModalOpen(true)}
                                    className={clsx(
                                        "hidden md:block rounded-md bg-white border border-gray-200 hover:border-sky-500 hover:text-sky-500 text-navy-900 font-bold transition-all duration-300 shadow-sm hover:shadow-md",
                                        isScrolled ? "text-[11px] px-3 py-1.5" : "text-[12px] px-4 py-2"
                                    )}
                                >
                                    {item.label}
                                </button>
                            );
                        }
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={clsx(
                                    "hidden md:block rounded-md bg-white border border-gray-200 hover:border-sky-500 hover:text-sky-500 text-navy-900 font-bold transition-all duration-300 shadow-sm hover:shadow-md",
                                    isScrolled ? "text-[11px] px-3 py-1.5" : "text-[12px] px-4 py-2"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}

                    <button
                        ref={searchButtonRef}
                        onClick={() => {
                            if (isSearchOpen) {
                                closeSearch();
                            } else {
                                setIsSearchOpen(true);
                            }
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className={clsx(
                            "flex items-center justify-center rounded-md bg-white border border-gray-200 hover:border-sky-500 hover:text-sky-500 text-navy-900 transition-all shadow-sm ml-2",
                            isScrolled ? "w-8 h-8" : "w-10 h-10"
                        )}
                    >
                        {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                    </button>

                    {/* Hamburger Dropdown Trigger */}
                    <button
                        ref={menuButtonRef}
                        className={clsx(
                            "flex items-center justify-center rounded-md transition-all shadow-md ml-1 z-50 relative",
                            isDropdownOpen ? "bg-sky-500 text-white" : "bg-navy-900 text-white hover:bg-sky-600",
                            isScrolled ? "w-8 h-8" : "w-10 h-10"
                        )}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {isDropdownOpen ? <X size={20} /> : <AlignJustify size={20} />}
                    </button>
                </div>

                {/* Search Bar Overlay */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 w-full md:w-[400px] px-6 md:px-0 z-40"
                            ref={searchRef}
                        >
                            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="검색어를 입력하세요 (예: 입단, 레슨)"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                                    />
                                </div>

                                {/* Autocomplete Results */}
                                {searchQuery && (
                                    <div className="mt-2 text-left max-h-60 overflow-y-auto">
                                        {searchResults.length > 0 ? (
                                            <ul>
                                                {searchResults.map((result, idx) => (
                                                    <li key={idx}>
                                                        <Link
                                                            href={result.href}
                                                            onClick={handleSearchResultClick}
                                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors font-medium flex items-center justify-between group"
                                                        >
                                                            <span>{result.label}</span>
                                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="px-4 py-6 text-center text-xs text-gray-400">
                                                검색 결과가 없습니다.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dark Overlay for Menu */}
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 z-30"
                            onClick={() => setIsDropdownOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Detailed Mega Menu Dropdown */}
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 left-0 w-full bg-white shadow-2xl border-t border-gray-100 overflow-hidden z-40"
                        >
                            <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-left">
                                    {MENU_STRUCTURE.map((section) => (
                                        <div key={section.label} className="flex flex-col gap-4 group border-r border-gray-100 last:border-r-0 px-8 first:pl-0">
                                            <Link
                                                href={section.href}
                                                className="text-navy-900 font-black text-lg pb-2 border-b-2 border-transparent group-hover:border-sky-500 group-hover:text-sky-500 transition-all inline-block w-fit"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                {section.label}
                                            </Link>
                                            <div className="flex flex-col gap-2">
                                                {section.subItems.map((sub) => (
                                                    <Link
                                                        key={sub.label}
                                                        href={sub.href}
                                                        className="text-gray-500 hover:text-navy-900 hover:translate-x-1 transition-all text-sm font-medium flex items-center gap-1"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    >
                                                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-sky-400" />
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <TrialClassModal
                isOpen={isTrialModalOpen}
                onClose={() => setIsTrialModalOpen(false)}
            />
        </header>
    );
}
