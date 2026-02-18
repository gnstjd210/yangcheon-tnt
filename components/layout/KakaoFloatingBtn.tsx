"use client";

import Image from "next/image";

export default function KakaoFloatingBtn() {
    return (
        <a
            href="https://pf.kakao.com/_xxxx" // Replace with actual Kakao Channel Link
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 md:bottom-10 md:right-10 cursor-pointer overflow-hidden border-2 border-white"
            aria-label="카카오톡 상담하기"
        >
            <Image
                src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
                alt="KakaoTalk"
                fill
                className="object-cover bg-[#FAE100] p-3" // Kakao signature yellow
            />
        </a>
    );
}
