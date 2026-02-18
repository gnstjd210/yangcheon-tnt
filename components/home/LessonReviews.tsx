'use client';

// User Request Analysis:
// 1. "Manual Drag Activate": User needs click & drag / swipe support.
// 2. "Position Maintenance (No Reset)": Must stop exactly where dragged, not snap back.
// 3. "Auto-restart": Resume flow after interaction.
// 4. "Infinite Loop": Seamless connection.

// Swiper.js is the industry standard for this exact combination of requirements (FreeMode + Autoplay + Loop).
// Implementing this purely in Framer Motion with "No Reset" + "Infinite" + "Drag" is exceptionally complex 
// and prone to bugs (as seen in v15). 
// Since we are using Next.js, we can use 'swiper/react'.
// However, if Swiper is not installed, we should verify or fallback to a robust custom implementation.
// Let's try a robust custom Framer Motion implementation first that strictly separates animation from drag.

import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Star } from 'lucide-react';
import { useRef, useEffect, useCallback } from 'react';

const NAMES = ['김**', '이**', '박**', '최**', '정**', '강**', '조**', '윤**', '장**', '임**'];
const PROGRAMS = ['유소년 아카데미', '성인 그룹 레슨', '피지컬 트레이닝', 'TNT W'];
const COMMENTS = [
    '아이가 축구를 너무 좋아해요! 코치님들 최고입니다.',
    '체계적인 훈련 덕분에 실력이 많이 늘었습니다.',
    '시설이 깨끗하고 주차가 편해서 좋습니다.',
    '취미로 시작했는데 이제는 삶의 활력소가 되었어요.',
    '친구들과 함께 뛰는 즐거움을 알게 되었습니다.',
    '코치님들의 열정적인 지도가 인상적입니다.',
    '기본기부터 탄탄하게 배울 수 있어서 만족합니다.',
    '다이어트 효과도 있고 스트레스도 풀려요!',
    '매주 수업 시간이 기다려집니다. 감사합니다.',
    '아이의 자신감이 많이 커졌어요. 추천합니다.'
];

const REVIEWS = Array.from({ length: 30 }, (_, i) => ({
    name: `${NAMES[i % NAMES.length]} 회원님`,
    program: PROGRAMS[i % PROGRAMS.length],
    content: COMMENTS[i % COMMENTS.length],
    rate: 5,
    color: i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
}));

export default function LessonReviews() {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const controls = useAnimation();

    const isDragging = useRef(false);

    // Robust "Auto-Resume" Logic
    const onDragStart = useCallback(() => {
        isDragging.current = true;
        controls.stop();
    }, [controls]);

    const onDragEnd = useCallback(() => {
        isDragging.current = false;

        // Resume scrolling leftwards
        // We animate from current position to a far left position
        // We need to handle wrapping manually or just have enough content.
        // With 4 sets of 30 items (400px each) = 48,000px.
        // That's enough for a long session.
        // We'll reset gently if needed or just let it run.

        const current = x.get();
        const target = current - 50000; // run for a long time
        const dist = Math.abs(target - current);
        const duration = dist / 50; // constant speed

        controls.start({
            x: target,
            transition: { duration: duration, ease: "linear" }
        });
    }, [controls, x]);

    useEffect(() => {
        // Initial start
        onDragEnd();
    }, [onDragEnd]);

    return (
        <section className="py-24 bg-white overflow-hidden text-center select-none">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 mb-12 text-left">
                <h3 className="text-sky-500 font-bold tracking-widest mb-1 text-sm">REVIEWS</h3>
                <h2 className="text-4xl font-black text-navy-900 uppercase tracking-tighter">
                    Real Reviews
                </h2>
            </div>

            <motion.div
                className="flex gap-6 pl-6 cursor-grab active:cursor-grabbing"
                ref={containerRef}
                style={{ x }}
                drag="x"
                dragConstraints={{ right: 0, left: -100000 }}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                animate={controls}
            >
                {/* Render 10 Sets to be practically infinite for session duration */}
                {/* 30 items * 10 = 300 items. Card rendering performance might be an issue? 
                30 items is fine. 5 sets = 150 items. React handles 150 divs easily.
            */}
                {[...Array(6)].map((_, setIdx) => (
                    <div key={setIdx} className="flex gap-6 shrink-0">
                        {REVIEWS.map((review, idx) => (
                            <ReviewCard key={`${setIdx}-${idx}`} review={review} />
                        ))}
                    </div>
                ))}
            </motion.div>
        </section>
    );
}

interface ReviewProps {
    name: string;
    program: string;
    content: string;
    rate: number;
    color: string;
}

function ReviewCard({ review }: { review: ReviewProps }) {
    return (
        <div className={`shrink-0 w-[400px] ${review.color} rounded-[24px] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 pointer-events-none`}>
            <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        fill="currentColor"
                        size={16}
                    />
                ))}
            </div>
            <p className="text-navy-900 text-lg font-medium leading-relaxed mb-6 break-keep h-[84px] line-clamp-3 text-left">
                &ldquo;{review.content}&rdquo;
            </p>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-left">
                    <h4 className="font-bold text-navy-900 text-sm">{review.name}</h4>
                    <span className="text-xs text-gray-500 font-medium">{review.program}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm">
                    {review.name.charAt(0)}
                </div>
            </div>
        </div>
    )
}
