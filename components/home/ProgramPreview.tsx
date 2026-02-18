'use client';

import Link from 'next/link';

const PROGRAMS = [
    {
        title: '유소년 아카데미',
        desc: 'YOUTH ACADEMY',
        img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2670&auto=format&fit=crop',
        href: '/program/youth',
    },
    {
        title: '성인 그룹 레슨',
        desc: 'ADULT GROUP LESSON',
        img: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=2500&auto=format&fit=crop',
        href: '/program/adult',
    },
    {
        title: '피지컬 트레이닝',
        desc: 'PHYSICAL TRAINING',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop',
        href: '/program/physical',
    },
    {
        title: 'TNT W 등록',
        desc: 'TNTW REGISTRATION',
        img: 'https://images.unsplash.com/photo-1628891890377-571b78f237d7?q=80&w=2671&auto=format&fit=crop',
        href: '/program/tntw',
    }
];

export default function ProgramPreview() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-sky-500 font-bold tracking-widest text-sm block mb-2">OUR PROGRAMS</span>
                        <h2 className="text-4xl md:text-5xl font-black text-navy-900 leading-tight">
                            TNT Training System
                        </h2>
                    </div>
                    <p className="text-gray-500 max-w-sm pb-2 font-medium">
                        체계적인 커리큘럼과 전문 코치진이 함께하는<br />
                        양천 TNT만의 독보적인 훈련 시스템을 경험하세요.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PROGRAMS.map((program, idx) => (
                        <Link
                            key={idx}
                            href={program.href}
                            className="group relative h-[400px] w-full overflow-hidden block rounded-[24px] shadow-sm hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Image Background with Scale Animation */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                style={{ backgroundImage: `url(${program.img})` }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent opacity-80" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 w-full z-10 text-left">
                                <span className="text-sky-400 text-[10px] font-bold tracking-widest uppercase block mb-2">
                                    0{idx + 1} PROGRAM
                                </span>
                                <h3 className="text-white text-2xl font-bold leading-tight group-hover:text-sky-400 transition-colors">
                                    {program.title}
                                </h3>
                                <p className="text-gray-300/80 text-xs mt-2 font-medium tracking-wider">
                                    {program.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
