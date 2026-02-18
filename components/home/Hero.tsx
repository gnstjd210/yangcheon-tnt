'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TrialClassModal from './TrialClassModal';

export default function Hero() {
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-navy-900">
            {/* Background Image Placeholder */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2560&auto=format&fit=crop")' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-navy-900/20 to-navy-900/90" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-red-600/20 text-red-400 font-bold text-sm mb-6 border border-red-600/30">
                        YANGCHEON TNT SPORTS ACADEMY
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                        THE BEST PLACE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                            FOR YOUR DREAM
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        체계적인 훈련 시스템과 프로페셔널한 코칭 스태프.<br className="hidden md:block" />
                        양천 TNT에서 당신의 축구 잠재력을 깨우세요.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/join"
                            className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                        >
                            입단 신청하기 <ArrowRight size={20} />
                        </Link>
                        <button
                            onClick={() => setIsTrialModalOpen(true)}
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                        >
                            체험 수업 신청
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-3 bg-white/50 rounded-full" />
                </div>
            </motion.div>

            {/* Trial Class Modal */}
            <TrialClassModal
                isOpen={isTrialModalOpen}
                onClose={() => setIsTrialModalOpen(false)}
            />
        </section>
    );
}
