'use client';

import Link from 'next/link';
import { Calendar, CreditCard, HeartPulse } from 'lucide-react';

const LINKS = [
    {
        title: '아카데미 입단 절차',
        desc: '입단 상담부터 등록까지의 과정을 안내합니다.',
        icon: Calendar,
        href: '/process',
        color: 'bg-navy-800',
        textColor: 'text-white'
    },
    {
        title: '교육비 및 스케줄 안내',
        desc: '연령별 프로그램 비용과 훈련 시간을 확인하세요.',
        icon: CreditCard,
        href: '/schedule',
        color: 'bg-white',
        textColor: 'text-navy-900'
    },
    {
        title: 'ELITE PHYSIO & LYVON',
        desc: '선수 전문 재활 및 리커버리 센터 (Family Site)',
        icon: HeartPulse,
        href: '/physio',
        color: 'bg-red-600',
        textColor: 'text-white'
    },
];

export default function QuickLinks() {
    return (
        <section className="relative -mt-20 z-20 container mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LINKS.map((link, idx) => (
                    <Link
                        key={idx}
                        href={link.href}
                        className={`group p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-2 duration-300 flex flex-col justify-between h-48 ${link.color} ${link.textColor}`}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">{link.title}</h3>
                                <link.icon className={`w-8 h-8 opacity-80 group-hover:scale-110 transition-transform duration-300`} />
                            </div>
                            <p className={`text-sm opacity-80 font-medium`}>{link.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 font-bold text-sm mt-4">
                            자세히 보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
