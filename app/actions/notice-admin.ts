"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotices() {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { createdAt: "desc" },
        });
        return notices;
    } catch (error) {
        console.error("Failed to fetch notices:", error);
        return [];
    }
}

export async function createNotice(data: { title: string; content: string; author?: string }) {
    try {
        const notice = await prisma.notice.create({
            data: {
                title: data.title,
                content: data.content,
                author: data.author || "관리자",
            },
        });
        revalidatePath("/admin/notices");
        return notice;
    } catch (error) {
        console.error("Failed to create notice:", error);
        throw new Error("공지사항 생성에 실패했습니다.");
    }
}

export async function updateNotice(id: string, data: { title: string; content: string; author?: string }) {
    try {
        const notice = await prisma.notice.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                author: data.author || "관리자",
            },
        });
        revalidatePath("/admin/notices");
        return notice;
    } catch (error) {
        console.error("Failed to update notice:", error);
        throw new Error("공지사항 수정에 실패했습니다.");
    }
}

export async function deleteNotice(id: string) {
    try {
        await prisma.notice.delete({
            where: { id },
        });
        revalidatePath("/admin/notices");
        return true;
    } catch (error) {
        console.error("Failed to delete notice:", error);
        throw new Error("공지사항 삭제에 실패했습니다.");
    }
}
