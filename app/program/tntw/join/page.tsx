"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RegistrationForm from "@/components/program/RegistrationForm";

export default function TNTWJoinPage() {
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
            type="TNTW"
            title="TNT W 입단신청"
            subtitle="초보부터 숙련자 까지 당신의 열정을 그라운드에서 펼쳐보세요"
        />
    );
}
