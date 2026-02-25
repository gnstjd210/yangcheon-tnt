"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function KakaoFloatingBtn() {
    const pathname = usePathname();

    if ((pathname || "").startsWith("/admin")) {
        return null;
    }

    return (
        <a
            href="http://pf.kakao.com/_xxxx" // 실제 카카오톡 채널 링크로 변경해주세요
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center justify-center w-[60px] h-[60px] rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 bg-[#FAE100] border-2 border-white"
            aria-label="카카오톡 상담하기"
        >
            <Image
                src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
                alt="KakaoTalk"
                width={34}
                height={34}
                className="object-contain"
            />
        </a>
    );
}
