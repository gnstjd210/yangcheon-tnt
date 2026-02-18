"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RegistrationForm from "@/components/program/RegistrationForm";

export default function AdultJoinPage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            alert("로그인이 필요한 서비스입니다.");
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <RegistrationForm
            type="Adult"
            title="성인부 훈련 입단 신청"
            subtitle="기초부터 실전까지 체계적인 트레이닝을 제공합니다."
        />
    );
}
