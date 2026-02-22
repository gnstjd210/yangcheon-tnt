"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getReviews() {
    try {
        const reviews = await prisma.review.findMany({
            where: { isApproved: true },
            orderBy: { createdAt: "desc" },
        });
        return reviews;
    } catch {
        return [];
    }
}

export async function createReview(formData: FormData) {
    const name = formData.get("name") as string;
    const program = formData.get("program") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);

    if (!name || !content) {
        return { success: false, message: "필수 입력 항목이 누락되었습니다." };
    }

    try {
        await prisma.review.create({
            data: {
                name,
                program,
                content,
                rating: rating || 5,
                color: "bg-white", // Default or random
            },
        });

        revalidatePath("/community/reviews");
        revalidatePath("/"); // Sync with main page
        return { success: true, message: "후기가 등록되었습니다." };
    } catch (error) {
        console.error("Review creation failed:", error);
        return { success: false, message: "후기 등록 중 오류가 발생했습니다." };
    }
}
