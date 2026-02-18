"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function AdultIntroPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Ascend Style Clone */}
            <div className="relative py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                        {/* Left: Round Image */}
                        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden border-[8px] border-gray-100 shadow-2xl"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop"
                                    alt="Adult Training"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Right: Text Content */}
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h4 className="text-navy-900 font-extrabold tracking-widest text-sm mb-4">ADULT TRAINING</h4>
                                <h1 className="text-4xl md:text-6xl font-black text-navy-900 mb-8 leading-tight">
                                    기본기가<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">실력이다.</span>
                                </h1>
                                <div className="space-y-6 text-gray-600 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                                    <p className="text-xl text-navy-900 font-bold border-l-4 border-sky-500 pl-4">
                                        &quot;실전 압박 상황에서도 흔들리지 않는<br />개인 기량과 전술 이해도를 완성합니다.&quot;
                                    </p>
                                    <p>
                                        단순한 반복 훈련이 아닙니다.<br />
                                        실제 경기에서 마주하는 다양한 상황을 시뮬레이션하고,<br />
                                        그 안에서 최적의 판단을 내리는 훈련을 반복합니다.
                                    </p>
                                    <p>
                                        체계적인 커리큘럼을 통해<br />
                                        부상 없이 안전하게, 그리고 즐겁게<br />
                                        진정한 축구 실력을 향상시키세요.
                                    </p>
                                </div>

                                <div className="mt-10">
                                    <Link
                                        href="/program/adult/join"
                                        className="inline-flex items-center gap-3 bg-navy-900 text-white px-10 py-5 rounded-full font-bold hover:bg-navy-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        입단 신청하기
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -z-10 rounded-l-[100px] hidden md:block" />
            </div>

            {/* Training Process Section - Ascend Style Bar */}
            <div className="bg-navy-900 py-24 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4">TRAINING PROCESS</h2>
                        <p className="text-gray-400">양천 TNT만의 체계적인 훈련 프로세스</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-700 -z-10" />

                        {/* Step 01 */}
                        <div className="relative group">
                            <div className="w-24 h-24 mx-auto bg-navy-800 rounded-full border-4 border-sky-500 flex items-center justify-center mb-6 z-10 relative shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-3xl font-black text-sky-500">01</span>
                            </div>
                            <div className="text-center px-4">
                                <h3 className="text-xl font-bold mb-3">핵심 기술</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    개인 전술 및 정밀 볼 컨트롤 훈련.<br />
                                    드리블, 패스, 퍼스트 터치의<br />완벽한 기본기 확립
                                </p>
                            </div>
                        </div>

                        {/* Step 02 */}
                        <div className="relative group">
                            <div className="w-24 h-24 mx-auto bg-navy-800 rounded-full border-4 border-sky-500 flex items-center justify-center mb-6 z-10 relative shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-3xl font-black text-sky-500">02</span>
                            </div>
                            <div className="text-center px-4">
                                <h3 className="text-xl font-bold mb-3">팀 전술</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    포지셔닝 및 공간 창출 실전 트레이닝.<br />
                                    부분 전술 훈련을 통한<br />팀플레이 이해도 향상
                                </p>
                            </div>
                        </div>

                        {/* Step 03 */}
                        <div className="relative group">
                            <div className="w-24 h-24 mx-auto bg-navy-800 rounded-full border-4 border-sky-500 flex items-center justify-center mb-6 z-10 relative shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-3xl font-black text-sky-500">03</span>
                            </div>
                            <div className="text-center px-4">
                                <h3 className="text-xl font-bold mb-3">실전 피드백</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    자체 경기 및 코칭진의 영상 분석.<br />
                                    실시간 피드백을 통한<br />즉각적인 문제점 개선
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Program Cards Section */}
            <div className="max-w-7xl mx-auto py-24 px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-navy-900 mb-4">TRAINING CLASS</h2>
                    <p className="text-gray-500">대상에 맞는 최적의 훈련 프로그램을 제공합니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Male */}
                    <div className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-[500px]">
                        <div className="p-8 flex-1">
                            <div className="w-12 h-1 bg-sky-500 mb-6" />
                            <h3 className="text-2xl font-black text-navy-900 mb-2">남성 그룹레슨</h3>
                            <p className="text-gray-600 text-sm mb-6">기본기부터 전술 훈련까지,<br />실전 경기에 강한 축구를 배웁니다.</p>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li className="flex items-center gap-2"><Check size={16} className="text-sky-500" /> <b>주 1회 / 주 2회</b> 선택 가능</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-sky-500" /> 포지션별 <b>전문 전술</b> 훈련</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-sky-500" /> <b>High-Intensity</b> 피지컬 세션</li>
                            </ul>
                        </div>
                        <div className="relative h-[240px] overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop"
                                alt="Male Class"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
                        </div>
                    </div>

                    {/* Card 2: Female */}
                    <div className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-[500px]">
                        <div className="p-8 flex-1">
                            <div className="w-12 h-1 bg-orange-500 mb-6" />
                            <h3 className="text-2xl font-black text-navy-900 mb-2">여성 그룹레슨</h3>
                            <p className="text-gray-600 text-sm mb-6">처음이어도 괜찮습니다.<br />즐겁게 운동하며 실력을 키웁니다.</p>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li className="flex items-center gap-2"><Check size={16} className="text-orange-500" /> <b>왕초보</b> 환영 (볼 감각 훈련)</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-orange-500" /> <b>기초 체력</b> 및 코디네이션</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-orange-500" /> <b>여자축구</b> 전문 코칭 스태프</li>
                            </ul>
                        </div>
                        <div className="relative h-[240px] overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1551966775-84c4f09d8e35?q=80&w=800&auto=format&fit=crop"
                                alt="Female Class"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
                        </div>
                    </div>

                    {/* Card 3: Mixed */}
                    <div className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-[500px]">
                        <div className="p-8 flex-1">
                            <div className="w-12 h-1 bg-purple-500 mb-6" />
                            <h3 className="text-2xl font-black text-navy-900 mb-2">혼성 그룹레슨</h3>
                            <p className="text-gray-600 text-sm mb-6">남녀노소 누구나,<br />함께 땀 흘리며 성장합니다.</p>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li className="flex items-center gap-2"><Check size={16} className="text-purple-500" /> <b>미니게임</b> 위주의 실전 훈련</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-purple-500" /> 즐거운 <b>커뮤니티</b> 분위기</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-purple-500" /> <b>팀워크</b> & 패스 플레이 중심</li>
                            </ul>
                        </div>
                        <div className="relative h-[240px] overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop"
                                alt="Mixed Class"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
