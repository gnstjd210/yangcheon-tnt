"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RegistrationForm from "@/components/program/RegistrationForm";

export default function YouthJoinPage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            // Need a way to alert, maybe specialized toast or just window.alert for now
            // But since this runs on mount, window.alert might block render cycle or be annoying.
            // Better to use a non-blocking approach if possible, but user asked for "message" and redirect.
            alert("로그인이 필요한 서비스입니다.");
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <RegistrationForm
            type="Youth"
            title="유소년 아카데미 입단 신청"
            subtitle="꿈을 향한 첫걸음, 티앤티스포츠아카데미와 함께하세요"
        />
    );
}
