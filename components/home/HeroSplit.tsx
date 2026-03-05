'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { HeroImage, QuickMenu } from '@/lib/mainPageConstants';
import { DEFAULT_HERO_IMAGES, DEFAULT_QUICK_MENU } from '@/lib/mainPageConstants';

import TrialClassModal from '@/components/home/TrialClassModal';
import ReRegistrationModal from '@/components/payment/ReRegistrationModal';

interface HeroSplitProps {
    slides?: HeroImage[];
    quickMenu?: QuickMenu[];
}

export default function HeroSplit({ slides = DEFAULT_HERO_IMAGES, quickMenu = DEFAULT_QUICK_MENU }: HeroSplitProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="relative min-h-[calc(100vh-128px)] w-full max-w-[1920px] mx-auto px-6 md:px-12 pt-36 pb-6 flex flex-col lg:flex-row gap-6">
            {/* LEFT: SLIDER (70%) */}
            <div className="relative w-full lg:w-[70%] h-[600px] lg:h-[650px] rounded-[30px] overflow-hidden shadow-2xl group bg-navy-900 border border-gray-800">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Manual Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft size={32} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={32} />
                </button>

                <div className="absolute bottom-12 left-12 z-20">
                    <motion.h2
                        key={currentSlide + 'title'}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-white text-5xl lg:text-7xl font-black leading-[0.9] whitespace-pre-line tracking-tighter drop-shadow-lg"
                    >
                        {slides[currentSlide].title}
                    </motion.h2>
                    <motion.p
                        key={currentSlide + 'sub'}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-sky-400 text-xl font-bold mt-4 tracking-widest uppercase"
                    >
                        {slides[currentSlide].subtitle}
                    </motion.p>
                </div>

                <div className="absolute bottom-12 right-12 z-20 flex gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-12 bg-sky-500' : 'w-3 bg-white/30'}`}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT: QUICK MENU (30%) - Stronger Brightness Hover */}
            <div className="w-full lg:w-[30%] h-[600px] lg:h-[650px] flex flex-col gap-4">
                {quickMenu.map((item, idx) => {
                    if (item.href === '/trial') {
                        return (
                            <button
                                key={idx}
                                onClick={() => setIsTrialModalOpen(true)}
                                className="group relative flex-1 flex items-center justify-between px-8 bg-gray-900 rounded-[24px] shadow-lg border border-gray-800 overflow-hidden w-full text-left"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-100 group-hover:brightness-[1.1] transition-all duration-500 ease-out"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                />
                                <div className="absolute inset-0 transition-transform duration-300 group-hover:-translate-x-2 flex items-center justify-between px-8 w-full h-full z-10">
                                    <div className="flex flex-col drop-shadow-md">
                                        <span className="text-gray-300 group-hover:text-white text-[10px] font-bold tracking-widest uppercase mb-1 transition-colors">
                                            {item.desc}
                                        </span>
                                        <span className="text-white text-2xl font-black tracking-tight transition-colors">
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-sky-500 flex items-center justify-center transition-all">
                                        <ChevronRight className="text-white w-6 h-6" />
                                    </div>
                                </div>
                            </button>
                        );
                    }
                    if (item.href === '/payment' || item.label === '재수강결제') {
                        return (
                            <button
                                key={idx}
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="group relative flex-1 flex items-center justify-between px-8 bg-gray-900 rounded-[24px] shadow-lg border border-gray-800 overflow-hidden w-full text-left"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-100 group-hover:brightness-[1.1] transition-all duration-500 ease-out"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                />
                                <div className="absolute inset-0 transition-transform duration-300 group-hover:-translate-x-2 flex items-center justify-between px-8 w-full h-full z-10">
                                    <div className="flex flex-col drop-shadow-md">
                                        <span className="text-gray-300 group-hover:text-white text-[10px] font-bold tracking-widest uppercase mb-1 transition-colors">
                                            {item.desc}
                                        </span>
                                        <span className="text-white text-2xl font-black tracking-tight transition-colors">
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-yellow-400 flex items-center justify-center transition-all">
                                        <ChevronRight className="text-white w-6 h-6" />
                                    </div>
                                </div>
                            </button>
                        );
                    }
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className="group relative flex-1 flex items-center justify-between px-8 bg-gray-900 rounded-[24px] shadow-lg border border-gray-800 overflow-hidden"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-100 group-hover:brightness-[1.1] transition-all duration-500 ease-out"
                                style={{ backgroundImage: `url(${item.image})` }}
                            />
                            <div className="absolute inset-0 transition-transform duration-300 group-hover:-translate-x-2 flex items-center justify-between px-8 w-full h-full z-10">
                                <div className="flex flex-col drop-shadow-md">
                                    <span className="text-gray-300 group-hover:text-white text-[10px] font-bold tracking-widest uppercase mb-1 transition-colors">
                                        {item.desc}
                                    </span>
                                    <span className="text-white text-2xl font-black tracking-tight transition-colors">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-sky-500 flex items-center justify-center transition-all">
                                    <ChevronRight className="text-white w-6 h-6" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            <TrialClassModal
                isOpen={isTrialModalOpen}
                onClose={() => setIsTrialModalOpen(false)}
            />

            <ReRegistrationModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
            />
        </section>
    );
}
