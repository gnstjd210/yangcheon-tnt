"use server";

import prisma from "@/lib/prisma";

export async function getNotices() {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { createdAt: "desc" },
        });
        return notices;
    } catch {
        return [];
    }
}

export async function getFAQs() {
    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: { order: "asc" },
        });
        return faqs;
    } catch {
        return [];
    }
}
