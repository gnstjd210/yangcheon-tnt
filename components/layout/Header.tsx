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
        label: '피지컬 트레이닝',
        href: '/program/physical/intro',
        subItems: [
            { label: '프로그램 소개', href: '/program/physical/intro' },
            { label: '시설 안내', href: '/program/physical/facility' },
            { label: '상담 절차', href: '/program/physical/process' }
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
    { label: '상담신청', href: '/support/contact' },
];

const SEARCH_DATA = [
    { label: '유소년 입단신청', href: '/program/youth/join', keywords: ['입단', '유소년', '가입', '신청'] },
    { label: '피지컬 트레이닝 프로그램', href: '/program/physical/intro', keywords: ['피지컬', '자세교정', '통증케어', '기능개선', '재활'] },
    { label: '피지컬 트레이닝 시설안내', href: '/program/physical/facility', keywords: ['피지컬', '시설', '센터'] },
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

import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHoverMenuOpen, setIsHoverMenuOpen] = useState(false);
    const [isDesktopMegaMenuOpen, setIsDesktopMegaMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<number | null>(null);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<typeof SEARCH_DATA>([]);

    // Refs for Outside Click
    const searchRef = useRef<HTMLDivElement>(null);
    const searchButtonRef = useRef<HTMLButtonElement>(null);
    const desktopMegaButtonRef = useRef<HTMLButtonElement>(null);
    const desktopMegaMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    useOutsideClick(searchRef, closeSearch, [searchButtonRef]);
    useOutsideClick(desktopMegaMenuRef, () => setIsDesktopMegaMenuOpen(false), [desktopMegaButtonRef]);
    useOutsideClick(mobileMenuRef, () => setIsMobileMenuOpen(false), [hamburgerRef]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsMobileMenuOpen(false);
            setIsHoverMenuOpen(false);
            setIsDesktopMegaMenuOpen(false);
            closeSearch();
        }, 0);
        return () => clearTimeout(timeout);
    }, [pathname]);

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

    if (pathname?.startsWith('/admin')) return null;

    // Determine context coloring
    const isDarkThemeActive = isScrolled || isHoverMenuOpen || isMobileMenuOpen || isDesktopMegaMenuOpen;
    let headerBgClass = 'bg-transparent border-b border-transparent';
    let headerShadowClass = '';

    if (isHoverMenuOpen) {
        headerBgClass = 'bg-navy-900';
        headerShadowClass = ''; // No shadow when open to merge seamlessly with mega menu
    } else if (isScrolled || isMobileMenuOpen || isDesktopMegaMenuOpen) {
        headerBgClass = 'bg-navy-900/95 backdrop-blur-md border-b border-white/10';
        headerShadowClass = 'shadow-lg';
    }

    const headerHeightClass = isScrolled ? 'h-[70px]' : 'h-[90px]';
    const textColorClass = isDarkThemeActive ? 'text-white' : 'text-navy-900';
    const logoSrc = '/logo.png';

    return (
        <>
            <header
                onMouseEnter={() => { setIsHoverMenuOpen(true); }}
                onMouseLeave={() => { setIsHoverMenuOpen(false); }}
                className={clsx(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    headerBgClass,
                    headerShadowClass,
                    headerHeightClass
                )}
            >
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 h-full flex items-center justify-between relative">

                    {/* LEFT: Logo */}
                    <Link href="/" className="relative group shrink-0 h-full flex items-center">
                        <div className={clsx(
                            "flex items-center justify-center transition-all duration-300",
                            isScrolled ? "scale-90" : "scale-100"
                        )}>
                            <div className="relative w-[70px] h-[70px] md:w-[90px] md:h-[90px]">
                                <NextImage
                                    src={logoSrc}
                                    alt="TSA Emblem"
                                    fill
                                    className="object-contain drop-shadow-lg"
                                    priority
                                />
                            </div>
                        </div>
                    </Link>

                    {/* CENTER: Main Menu */}
                    <nav className="hidden xl:grid grid-cols-7 flex-1 max-w-[1200px] mx-6 2xl:mx-10 h-full items-center justify-items-center z-30">
                        {MENU_STRUCTURE.map((item) => (
                            <div key={item.href} className="relative group h-full flex items-center justify-center w-full border-b-2 border-transparent">
                                {/* The Anchor Container */}
                                <div className="relative flex flex-col items-center justify-center h-full w-full">
                                    <Link
                                        href={item.href}
                                        className={clsx(
                                            "font-bold tracking-tight transition-all duration-300 block text-center whitespace-nowrap",
                                            isScrolled ? "text-[15px]" : "text-[16px]",
                                            textColorClass,
                                            "hover:text-sky-400"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                    <span className="absolute bottom-[35%] left-1/2 -translate-x-1/2 h-[3px] bg-sky-500 transition-all duration-300 w-0 opacity-0 group-hover:w-[40%] group-hover:opacity-100"></span>

                                    {/* INDIVIDUAL DROPDOWN MENU (Hover Default) */}
                                    <div className={clsx(
                                        "absolute top-[80%] left-1/2 -translate-x-1/2 pt-0 transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto",
                                        isHoverMenuOpen ? "block" : "hidden"
                                    )}>
                                        <div className="bg-navy-900 shadow-xl border border-white/10 border-t-0 rounded-b-xl overflow-hidden min-w-[140px] w-max flex flex-col items-center py-4 px-2">
                                            {item.subItems.map((sub) => (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className="text-gray-400 hover:text-white transition-all text-[14px] font-medium block w-full px-6 py-2.5 text-center hover:bg-white/5 whitespace-nowrap rounded-lg"
                                                    onClick={() => setIsHoverMenuOpen(false)}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* RIGHT: Utility Buttons & Icons */}
                    <div className="flex items-center shrink-0 gap-2 xl:gap-3 justify-end">
                        {UTILITY_ITEMS.map((item) => {
                            if (item.href === '/trial') {
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => setIsTrialModalOpen(true)}
                                        className={clsx(
                                            "hidden 2xl:block rounded-md font-bold transition-all duration-300 shadow-sm border",
                                            isHoverMenuOpen ? "bg-white text-navy-900 border-transparent hover:bg-gray-100" : "bg-navy-900 border-transparent text-white hover:bg-white hover:text-slate-900 hover:border-slate-900",
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
                                        "hidden 2xl:block rounded-md font-bold transition-all duration-300 shadow-sm border",
                                        isHoverMenuOpen ? "bg-white text-navy-900 border-transparent hover:bg-gray-100" : "bg-navy-900 border-transparent text-white hover:bg-white hover:text-slate-900 hover:border-slate-900",
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
                                "flex items-center justify-center rounded-md transition-all duration-300 shadow-sm ml-2 border group",
                                isHoverMenuOpen ? "bg-white text-navy-900 border-transparent hover:bg-gray-100" : "bg-navy-900 border-transparent text-white hover:bg-white hover:text-slate-900 hover:border-slate-900",
                                isScrolled ? "w-8 h-8" : "w-10 h-10"
                            )}
                        >
                            {isSearchOpen ? <X size={18} className="transition-colors duration-300" /> : <Search size={18} className="transition-colors duration-300" />}
                        </button>

                        {/* Desktop Mega Menu Trigger */}
                        <button
                            ref={desktopMegaButtonRef}
                            onClick={() => {
                                if (isDesktopMegaMenuOpen) setIsDesktopMegaMenuOpen(false);
                                else {
                                    setIsDesktopMegaMenuOpen(true);
                                    setIsSearchOpen(false);
                                    setIsHoverMenuOpen(false);
                                }
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className={clsx(
                                "hidden xl:flex items-center justify-center rounded-md transition-all duration-300 shadow-sm ml-2 border group",
                                isHoverMenuOpen || isDesktopMegaMenuOpen ? "bg-white text-navy-900 border-transparent hover:bg-gray-100" : "bg-navy-900 border-transparent text-white hover:bg-white hover:text-slate-900 hover:border-slate-900",
                                isScrolled ? "w-8 h-8" : "w-10 h-10"
                            )}
                        >
                            {isDesktopMegaMenuOpen ? <X size={20} className="transition-colors duration-300" /> : <AlignJustify size={20} className="transition-colors duration-300" />}
                        </button>

                        {/* Mobile Hamburger Drawer Trigger */}
                        <button
                            ref={hamburgerRef}
                            className={clsx(
                                "xl:hidden flex items-center justify-center rounded-md transition-all duration-300 shadow-md ml-1 z-50 relative border",
                                isMobileMenuOpen
                                    ? "bg-red-600 border-red-500 text-white"
                                    : "bg-navy-900 border-transparent text-white hover:bg-white hover:text-navy-900 hover:border-navy-900",
                                isScrolled ? "w-8 h-8" : "w-10 h-10"
                            )}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <AlignJustify size={20} />}
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
                                className="absolute top-full right-0 mt-2 w-full sm:w-[350px] md:w-[400px] px-6 md:px-0 z-40"
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

                    {/* =========================================
                    DESKTOP: Full Mega Menu (Triggered by Hamburger)
                    ========================================= */}
                    <AnimatePresence>
                        {isDesktopMegaMenuOpen && (
                            <motion.div
                                ref={desktopMegaMenuRef}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="absolute top-full left-0 right-0 w-full bg-navy-900 shadow-[0_30px_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-30 hidden xl:block border-t border-white/10"
                            >
                                <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex items-start justify-between py-10 relative">

                                    {/* LEFT CLONE (Invisible) */}
                                    <div className="relative shrink-0 flex items-center opacity-0 pointer-events-none select-none">
                                        <div className={clsx("flex items-center justify-center transition-all duration-300", isScrolled ? "scale-90" : "scale-100")}>
                                            <div className="relative w-[70px] h-[70px] md:w-[90px] md:h-[90px]"></div>
                                        </div>
                                    </div>

                                    {/* CENTER: 7-Column Grid aligned exactly to Header */}
                                    <div className="hidden xl:grid grid-cols-7 flex-1 max-w-[1200px] mx-6 2xl:mx-10 justify-items-center z-30 w-full">
                                        {MENU_STRUCTURE.map((item) => (
                                            <div key={item.label} className="w-full flex flex-col items-center">
                                                <div className="flex flex-col space-y-4 text-center mt-2">
                                                    {item.subItems.map((sub) => (
                                                        <Link
                                                            key={sub.label}
                                                            href={sub.href}
                                                            className="text-gray-400 hover:text-white transition-all text-[15px] font-medium block hover:-translate-y-0.5 whitespace-nowrap"
                                                            onClick={() => setIsDesktopMegaMenuOpen(false)}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* RIGHT CLONE (Invisible) */}
                                    <div className="flex items-center shrink-0 gap-2 xl:gap-3 justify-end opacity-0 pointer-events-none select-none" aria-hidden="true">
                                        {UTILITY_ITEMS.map((item) => (
                                            <div key={item.label} className={clsx("hidden 2xl:block rounded-md border font-bold shadow-sm", isScrolled ? "text-[11px] px-3 py-1.5" : "text-[12px] px-4 py-2")}>
                                                {item.label}
                                            </div>
                                        ))}
                                        {/* Matches search button */}
                                        <div className={clsx("ml-2 border shadow-sm", isScrolled ? "w-8 h-8" : "w-10 h-10")}></div>
                                        {/* Matches menu trigger */}
                                        <div className={clsx("hidden xl:flex ml-2 border", isScrolled ? "w-8 h-8" : "w-10 h-10")}></div>
                                    </div>

                                </div>
                            </motion.div>
                        )
                        }
                    </AnimatePresence >

                    {/* =========================================
                    MOBILE/TABLET: Hamburger Drawer
                    ========================================= */}
                    <AnimatePresence>
                        {
                            isMobileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed inset-0 bg-black/60 z-30 xl:hidden top-0"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            )
                        }
                    </AnimatePresence >

                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                ref={mobileMenuRef}
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                                className="fixed inset-y-0 right-0 w-[300px] sm:w-[350px] bg-navy-900/95 backdrop-blur-2xl border-l border-white/10 z-40 shadow-2xl flex flex-col xl:hidden"
                                style={{ top: 0, height: '100vh' }}
                            >
                                <div className="h-20 px-6 border-b border-white/10 flex items-center justify-between shrink-0">
                                    <span className="text-white/50 text-xs tracking-widest font-bold">MENU</span>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Top Quick Buttons */}
                                <div className="p-6 pb-2 shrink-0 space-y-3">
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); setIsTrialModalOpen(true); }}
                                        className="w-full bg-white text-navy-900 font-bold py-3.5 rounded-xl transition shadow-lg text-[15px]"
                                    >
                                        체험수업 신청
                                    </button>
                                    <Link
                                        href="/support/contact"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full bg-navy-800 border border-white/20 text-white text-center font-bold py-3.5 rounded-xl transition text-[15px] hover:bg-white/10"
                                    >
                                        상담 신청
                                    </Link>
                                    <div className="flex gap-2 pt-2">
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 text-sm text-gray-300 hover:text-white bg-white/5 rounded-lg font-medium">로그인</Link>
                                        <Link href="/join" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 text-sm text-gray-300 hover:text-white bg-white/5 rounded-lg font-medium">회원가입</Link>
                                    </div>
                                </div>

                                {/* Mobile Search */}
                                <div className="px-6 py-4 shrink-0">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="검색어 입력..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 transition-colors"
                                        />
                                        {/* Autocomplete Results for Mobile */}
                                        {searchQuery && searchResults.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-navy-800 rounded-xl border border-white/10 shadow-xl overflow-hidden z-50">
                                                <ul className="max-h-48 overflow-y-auto">
                                                    {searchResults.map((result, idx) => (
                                                        <li key={idx} className="border-b border-white/5 last:border-0">
                                                            <Link
                                                                href={result.href}
                                                                onClick={() => { handleSearchResultClick(); setIsMobileMenuOpen(false); }}
                                                                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                            >
                                                                {result.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Accordion Menu */}
                                <div className="flex-1 overflow-y-auto w-full px-6 py-2 pb-8 scrollbar-hide">
                                    {MENU_STRUCTURE.map((section, index) => {
                                        const isExpanded = expandedMenu === index;
                                        return (
                                            <div key={section.label} className="border-b border-white/10 last:border-0">
                                                <button
                                                    onClick={() => setExpandedMenu(isExpanded ? null : index)}
                                                    className="w-full flex items-center justify-between py-4 text-left"
                                                >
                                                    <span className={clsx(
                                                        "font-bold text-lg tracking-tight transition-colors",
                                                        isExpanded ? "text-sky-400" : "text-white"
                                                    )}>
                                                        {section.label}
                                                    </span>
                                                    <ChevronRight
                                                        size={20}
                                                        className={clsx(
                                                            "transition-transform duration-300",
                                                            isExpanded ? "rotate-90 text-sky-400" : "text-gray-500"
                                                        )}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="flex flex-col space-y-1 pb-4 pl-2">
                                                                {section.subItems.map(sub => (
                                                                    <Link
                                                                        key={sub.label}
                                                                        href={sub.href}
                                                                        className="text-gray-400 hover:text-white text-[15px] py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                    >
                                                                        <div className="w-1 h-1 rounded-full bg-sky-500/50" />
                                                                        {sub.label}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Mobile Footer */}
                                <div className="p-6 border-t border-white/10 bg-navy-900/50 shrink-0 text-center">
                                    <p className="text-gray-400 text-sm font-medium mb-1">상담/문의</p>
                                    <p className="text-white text-xl font-black tracking-wider mb-4">02 - 1234 - 5678</p>
                                    <div className="flex justify-center gap-4">
                                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                            <span className="text-xs font-bold">IG</span>
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                            <span className="text-xs font-bold">BL</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div >
            </header >

            {/* Modal rendered outside of header containing block to prevent layout shift & clipping */}
            < TrialClassModal
                isOpen={isTrialModalOpen}
                onClose={() => setIsTrialModalOpen(false)}
            />
        </>
    );
}
