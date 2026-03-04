"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type AdminMenuSeed = {
    label: string;
    href: string;
    iconName: string;
    group: string;
    orderIndex: number;
};

// Hardcoded initial seed based on current layout
const INITIAL_MENUS: AdminMenuSeed[] = [
    { label: "대시보드", href: "/admin", iconName: "LayoutDashboard", group: "기본", orderIndex: 0 },
    { label: "메인 페이지 관리", href: "/admin/main-page", iconName: "LayoutDashboard", group: "운영", orderIndex: 1 },
    { label: "공지사항 관리", href: "/admin/notices", iconName: "Megaphone", group: "운영", orderIndex: 2 },
    { label: "레슨 후기 관리", href: "/admin/reviews", iconName: "Star", group: "운영", orderIndex: 3 },
    { label: "신청서 관리", href: "/admin/registrations", iconName: "FileText", group: "회원", orderIndex: 4 },
    { label: "회원 관리", href: "/admin/users", iconName: "Users", group: "회원", orderIndex: 5 },
    { label: "인사말 관리", href: "/admin/greeting", iconName: "FileText", group: "TSA 소개 관리", orderIndex: 6 },
    { label: "코치진 관리", href: "/admin/coach", iconName: "Users", group: "TSA 소개 관리", orderIndex: 7 },
    { label: "시설 관리", href: "/admin/facility", iconName: "Building2", group: "TSA 소개 관리", orderIndex: 8 },
    { label: "프로그램 이미지 관리", href: "/admin/program", iconName: "Camera", group: "TSA 소개 관리", orderIndex: 9 },
    { label: "월간 스케줄 관리", href: "/admin/schedule", iconName: "FileText", group: "TSA 소개 관리", orderIndex: 10 },
    { label: "갤러리 관리", href: "/admin/gallery", iconName: "Camera", group: "기타", orderIndex: 11 },
    { label: "체험수업 신청 관리", href: "/admin/trials", iconName: "FileText", group: "기타", orderIndex: 12 },
    { label: "성인 커리큘럼 카드 관리", href: "/admin/adult-classes", iconName: "FileText", group: "기타", orderIndex: 13 },
];

export async function getAdminMenus() {
    try {
        let menus = await prisma.adminMenu.findMany({
            orderBy: [{ group: 'asc' }, { orderIndex: 'asc' }]
        });

        if (menus.length === 0) {
            // Seed the database
            await prisma.adminMenu.createMany({
                data: INITIAL_MENUS
            });
            menus = await prisma.adminMenu.findMany({
                orderBy: [{ group: 'asc' }, { orderIndex: 'asc' }]
            });
        }

        return { success: true, menus };
    } catch (error) {
        console.error("Failed to get admin menus:", error);
        return { success: false, error: "메뉴를 불러오는데 실패했습니다." };
    }
}

export async function updateAdminMenuOrder(items: { id: string; group: string; orderIndex: number }[]) {
    try {
        // Use a transaction to perform all updates atomically
        await prisma.$transaction(
            items.map((item) =>
                prisma.adminMenu.update({
                    where: { id: item.id },
                    data: {
                        group: item.group,
                        orderIndex: item.orderIndex
                    }
                })
            )
        );

        revalidatePath("/admin", "layout");
        return { success: true };
    } catch (error) {
        console.error("Failed to update menu order:", error);
        return { success: false, error: "메뉴 순서 저장에 실패했습니다." };
    }
}
