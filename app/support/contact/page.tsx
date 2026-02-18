"use client";

import { Phone, Mail, Instagram, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="space-y-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-navy-900 mb-4">
                    문의하기
                </h2>
                <p className="text-gray-500 text-lg">
                    궁금한 점이 있으시면 언제든지 문의해주세요.
                </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        {/* Phone */}
                        <div className="flex items-start gap-4 hover:bg-gray-50 p-4 rounded-2xl transition">
                            <div className="bg-rose-100 text-rose-600 p-3 rounded-xl shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-navy-900 mb-1">전화 문의</h3>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <a href="tel:010-2429-9591" className="text-gray-600 font-medium text-lg hover:text-rose-600 transition">010-2429-9591</a>
                                        <span className="text-gray-300">/</span>
                                        <a href="tel:010-2332-2341" className="text-gray-600 font-medium text-lg hover:text-rose-600 transition">010-2332-2341</a>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mt-2">클릭 시 전화 연결됩니다.</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4 hover:bg-gray-50 p-4 rounded-2xl transition">
                            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-navy-900 mb-1">이메일 문의</h3>
                                <a href="mailto:gnstjd321@naver.com" className="text-gray-600 font-medium text-lg hover:text-indigo-600 transition">gnstjd321@naver.com</a>
                                <p className="text-gray-400 text-sm mt-2">24시간 접수 가능</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Instagram */}
                        <div className="flex items-start gap-4 hover:bg-gray-50 p-4 rounded-2xl transition">
                            <div className="bg-sky-100 text-sky-600 p-3 rounded-xl shrink-0">
                                <Instagram size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-navy-900 mb-2">인스타그램</h3>
                                <div className="flex flex-col">
                                    <a
                                        href="https://www.instagram.com/tnt_sports_academy?igsh=MWhvYWI3ZDE0NHRoeg%3D%3D&utm_source=qr"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 font-medium text-lg hover:text-sky-600 underline decoration-sky-200 underline-offset-4 mb-2"
                                    >
                                        tnt_sports_academy
                                    </a>
                                    <p className="text-gray-400 text-sm">DM으로도 빠른 상담이 가능합니다.</p>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="flex items-start gap-4 hover:bg-gray-50 p-4 rounded-2xl transition">
                            <div className="bg-green-100 text-green-600 p-3 rounded-xl shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-navy-900 mb-1">운영 시간</h3>
                                <div className="text-gray-600">
                                    <p><span className="font-bold w-12 inline-block">평일</span> 10:00 - 22:00</p>
                                    <p><span className="font-bold w-12 inline-block">주말</span> 10:00 - 18:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
